import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BarChart3, Clock, Eye, Trash2, ArrowLeft, RefreshCw, 
  User, Mail, Phone, Calendar, MapPin, Briefcase, DollarSign, Goal, 
  Database, ShieldCheck, HelpCircle, Activity, ChevronRight, LayoutDashboard,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Legend, Cell 
} from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store/useAdminStore';
import { useUserStore } from '@/store/useUserStore';
import { clearStorage, savePageVisit } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const navigate = useNavigate();
  const { users, analytics, schemeViews, loadUsers, loadAnalytics } = useAdminStore();
  const clearUser = useUserStore(state => state.clearUser);
  const currentUser = useUserStore(state => state.currentUser);

  // Tab section state
  const [activeTab, setActiveTab] = useState<'roster' | 'analytics' | 'journey'>('roster');

  // Load telemetry logs on mount
  useEffect(() => {
    loadUsers();
    loadAnalytics();
  }, [loadUsers, loadAnalytics]);

  // Track admin visit in page visits
  useEffect(() => {
    savePageVisit({
      userId: currentUser?.id || 'admin',
      pageVisited: 'admin',
      timestamp: new Date()
    });
  }, [currentUser]);

  const handleClearDatabase = () => {
    if (window.confirm("Are you sure you want to purge all local storage databases? This deletes all users, analytics, and views.")) {
      clearUser();
      clearStorage();
      loadUsers();
      loadAnalytics();
      navigate('/onboarding');
    }
  };

  // Format date readable
  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 1. Process Page Visit Analytics Data for Recharts
  const getPageVisitsChartData = () => {
    const counts: { [key: string]: number } = {
      onboarding: 0,
      dashboard: 0,
      compare: 0,
      learning: 0,
      admin: 0
    };
    analytics.forEach(visit => {
      const page = visit.pageVisited.toLowerCase();
      if (counts[page] !== undefined) {
        counts[page]++;
      }
    });
    return Object.keys(counts).map(key => ({
      name: key.toUpperCase(),
      visits: counts[key]
    }));
  };

  // 2. Process Scheme Click Popularity Data for Recharts
  const getSchemeClicksChartData = () => {
    const counts: { [key: string]: number } = {
      FD: 0,
      SIP: 0,
      Gold: 0,
      Chit: 0,
      PPF: 0,
      PostOffice: 0
    };
    schemeViews.forEach(view => {
      const id = view.schemeId.toLowerCase();
      if (id.includes('fd')) counts['FD']++;
      else if (id.includes('sip')) counts['SIP']++;
      else if (id.includes('gold') || id.includes('sgb')) counts['Gold']++;
      else if (id.includes('chit')) counts['Chit']++;
      else if (id.includes('ppf')) counts['PPF']++;
      else if (id.includes('po') || id.includes('post')) counts['PostOffice']++;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      clicks: counts[key]
    }));
  };

  // 3. Process User Journey Funnel Data
  const getFunnelMetrics = () => {
    // Total dashboard hits in page visits
    const dashboardHits = analytics.filter(v => v.pageVisited.toLowerCase() === 'dashboard').length;
    
    // Total clicks recorded on scheme cards
    const schemeClicks = schemeViews.filter(v => 
      !v.schemeId.includes('ai_chat') && 
      !v.schemeId.includes('learning_filter')
    ).length;

    // Total comparison page hits in page visits
    const compareHits = analytics.filter(v => v.pageVisited.toLowerCase() === 'compare').length;

    // Safety checks for division by zero
    const schemeConvRate = dashboardHits > 0 ? Math.round((schemeClicks / dashboardHits) * 100) : 0;
    const compareConvRate = schemeClicks > 0 ? Math.round((compareHits / schemeClicks) * 100) : 0;
    const overallConvRate = dashboardHits > 0 ? Math.round((compareHits / dashboardHits) * 100) : 0;

    return {
      dashboardHits,
      schemeClicks,
      compareHits,
      schemeConvRate,
      compareConvRate,
      overallConvRate
    };
  };

  const funnel = getFunnelMetrics();
  const pageVisitsData = getPageVisitsChartData();
  const schemeClicksData = getSchemeClicksChartData();

  // Premium colors aligned with HSL design guidelines
  const chartColors = ['#10b981', '#fbbf24', '#f87171', '#38bdf8', '#a78bfa', '#f472b6'];

  return (
    <div className="min-h-screen bg-[#070b09] bg-gradient-to-br from-[#070b09] via-[#0b1311] to-[#070b09] py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-100 antialiased">
      
      {/* Upper Navigation Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5 shrink-0">
        <div className="space-y-1">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-slate-800 bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300 mb-3 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Database className="h-8 w-8 text-emerald-400" />
            Developer Platform Console
          </h1>
          <p className="text-slate-400 text-sm font-semibold">
            Track user registries, analytical page distribution charts, and user conversion journeys in real-time.
          </p>
        </div>

        <Button
          onClick={handleClearDatabase}
          variant="outline"
          className="border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-slate-950 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-red-500/5 cursor-pointer"
        >
          <Trash2 className="h-4.5 w-4.5" />
          Purge All Databases
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Dynamic Section Tabs Selectors */}
        <div className="flex border-b border-slate-800 pb-1 shrink-0">
          <button
            onClick={() => setActiveTab('roster')}
            className={cn(
              "px-5 py-2.5 text-xs font-black border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer",
              activeTab === 'roster'
                ? "border-emerald-500 text-emerald-400 bg-slate-900/10"
                : "border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            <Users className="h-4 w-4" />
            User Registry
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "px-5 py-2.5 text-xs font-black border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer",
              activeTab === 'analytics'
                ? "border-emerald-500 text-emerald-400 bg-slate-900/10"
                : "border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics Distribution
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={cn(
              "px-5 py-2.5 text-xs font-black border-b-2 transition-all duration-300 flex items-center gap-2 cursor-pointer",
              activeTab === 'journey'
                ? "border-emerald-500 text-emerald-400 bg-slate-900/10"
                : "border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            <Activity className="h-4 w-4" />
            Conversion Journey Funnel
          </button>
        </div>

        {/* TAB 1: USER REGISTRY ROSTER */}
        {activeTab === 'roster' && (
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl rounded-2xl animate-in fade-in duration-300">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                Onboarded User Roster ({users.length})
              </CardTitle>
              <CardDescription className="text-slate-400">
                A complete database of registered user profiles extracted directly from localStorage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {users.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-semibold">
                  No users have completed onboarding yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-wider bg-slate-950/40">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-4">Email</th>
                      <th className="py-4 px-4">Phone</th>
                      <th className="py-4 px-4 text-center">Age</th>
                      <th className="py-4 px-4 text-right">Income</th>
                      <th className="py-4 px-4">City</th>
                      <th className="py-4 px-6">Employment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs font-semibold">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/20 transition-all duration-300">
                        {/* Name */}
                        <td className="py-4 px-6 font-extrabold text-white">
                          {u.name}
                        </td>
                        {/* Email */}
                        <td className="py-4 px-4 text-slate-300">
                          {u.email}
                        </td>
                        {/* Phone */}
                        <td className="py-4 px-4 text-slate-300">
                          {u.phone}
                        </td>
                        {/* Age */}
                        <td className="py-4 px-4 text-center text-slate-200">
                          {u.age} Years
                        </td>
                        {/* Income */}
                        <td className="py-4 px-4 text-right text-emerald-400 font-bold">
                          ${u.monthlyIncome.toLocaleString()} /mo
                        </td>
                        {/* City */}
                        <td className="py-4 px-4 text-slate-300">
                          {u.city}
                        </td>
                        {/* Employment Status */}
                        <td className="py-4 px-6 capitalize">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                            u.employmentStatus === 'employed' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                            u.employmentStatus === 'student' && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                            u.employmentStatus === 'unemployed' && "bg-red-500/10 text-red-400 border border-red-500/20",
                            u.employmentStatus === 'self-employed' && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          )}>
                            {u.employmentStatus === 'self-employed' ? 'Freelancer' : u.employmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 2: ANALYTICS DISTRIBUTION (RECHARTS) */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow p-5 flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Total Users Onboarded</span>
                <span className="text-3xl font-black text-white">{users.length}</span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">Active localStorage Profiles</span>
              </Card>
              <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow p-5 flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Total Page Visits Tracked</span>
                <span className="text-3xl font-black text-white">{analytics.length}</span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">Captured hits across the routes</span>
              </Card>
              <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow p-5 flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Total Scheme Clicks</span>
                <span className="text-3xl font-black text-white">{schemeViews.length}</span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-2">Interactions, external link visits, video plays</span>
              </Card>
            </div>

            {/* Recharts Grid Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Page hit visits chart */}
              <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg p-5">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-400" />
                    Page Visits Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 h-72">
                  {analytics.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
                      No visits recorded in telemetry.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pageVisitsData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="visits" fill="#10b981" radius={[4, 4, 0, 0]}>
                          {pageVisitsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Scheme click popularity chart */}
              <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg p-5">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#D4AF37]" />
                    Scheme Popularity Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 h-72">
                  {schemeViews.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
                      No click views logged in telemetry.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={schemeClicksData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="clicks" fill="#38bdf8" radius={[4, 4, 0, 0]}>
                          {schemeClicksData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[(index + 3) % chartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 3: USER JOURNEY CONVERSION FUNNEL */}
        {activeTab === 'journey' && (
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl rounded-2xl animate-in fade-in duration-300">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                User Journey Funnel Conversion Rate
              </CardTitle>
              <CardDescription className="text-slate-400">
                Visualizes the progression rate of users transitioning: **dashboard** ➔ **scheme engagement** ➔ **compare page**.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Dynamic conversion path flow widget */}
              <div className="space-y-6 max-w-4xl mx-auto py-4">
                {/* Step 1: Dashboard Hits */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2 text-white">
                      <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                      Step 1: Dashboard Visits
                    </span>
                    <span>{funnel.dashboardHits} Hits (100% baseline)</span>
                  </div>
                  <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-lg shadow-emerald-500/20" style={{ width: '100%' }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Captured hits of onboarded users entering the personal financial model workspace.
                  </p>
                </div>

                {/* Conversion Divider */}
                <div className="flex justify-center shrink-0">
                  <div className="bg-slate-900 border border-slate-800/60 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 shadow-md">
                    Conversion Rate: {funnel.schemeConvRate}%
                  </div>
                </div>

                {/* Step 2: Scheme Clicks */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2 text-white">
                      <Eye className="h-4 w-4 text-[#D4AF37]" />
                      Step 2: Scheme Card Clicks
                    </span>
                    <span>{funnel.schemeClicks} Clicks ({funnel.schemeConvRate}% conversion)</span>
                  </div>
                  <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-500 rounded-full shadow-lg shadow-[#D4AF37]/15" style={{ width: `${Math.min(100, funnel.schemeConvRate)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Users exploring specific schemes by clicking "Learn More", playing tutorials, or viewing authority cards.
                  </p>
                </div>

                {/* Conversion Divider */}
                <div className="flex justify-center shrink-0">
                  <div className="bg-slate-900 border border-slate-800/60 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider text-amber-500 shadow-md">
                    Conversion Rate: {funnel.compareConvRate}%
                  </div>
                </div>

                {/* Step 3: Compare Page visits */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400">
                    <span className="flex items-center gap-2 text-white">
                      <Scale className="h-4 w-4 text-emerald-400" />
                      Step 3: Comparison Workspace Clicks
                    </span>
                    <span>{funnel.compareHits} Hits ({funnel.overallConvRate}% overall conversion)</span>
                  </div>
                  <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-[#D4AF37] rounded-full shadow-lg shadow-emerald-500/10" style={{ width: `${Math.min(100, funnel.overallConvRate)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Users initiating a comparison between different secure investment models side-by-side.
                  </p>
                </div>
              </div>

              {/* Informational Summary Callout */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-xs font-semibold leading-relaxed max-w-4xl mx-auto mt-6">
                <h4 className="text-white font-extrabold mb-1 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-[#D4AF37]" />
                  Journey Conversion Insights
                </h4>
                <p className="text-slate-400">
                  An efficient personal finance counseling journey shows smooth transitions across all steps. Large drop-offs at Step 2 (Scheme Clicks) indicate that the model recommendations need higher visual triggers. Drop-offs at Step 3 (Compare Clicks) indicate that comparisons are accessed only after heavy concept evaluation.
                </p>
              </div>

            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
