import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Briefcase, Landmark, Shield, TrendingUp, Sparkles, 
  DollarSign, PieChart as PieIcon, BookOpen, ExternalLink, HelpCircle, 
  ArrowLeftRight, Info, AlertTriangle, ShieldCheck, RefreshCw, Calendar, 
  ChevronRight, Award, Zap
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/useUserStore';
import { savePageVisit, saveSchemeView } from '@/lib/storage';
import type { Scheme, LearningContent } from '@/types';
import schemesData from '@/data/schemes.json';
import learningData from '@/data/learning.json';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = useUserStore(state => state.currentUser);
  const clearUser = useUserStore(state => state.clearUser);
  const [activeTab, setActiveTab] = useState<'savings' | 'investments' | 'insurance' | 'government' | 'learning'>('savings');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<LearningContent | null>(null);
  
  // Cast JSON data to Scheme[]
  const schemes = schemesData as Scheme[];

  // Redirect to onboarding if profile is missing
  useEffect(() => {
    if (!currentUser) {
      navigate('/onboarding');
    }
  }, [currentUser, navigate]);

  // Track page visit on mount
  useEffect(() => {
    if (currentUser) {
      savePageVisit({
        userId: currentUser.id,
        pageVisited: 'dashboard',
        timestamp: new Date()
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return null; // Guard against flashes of unauthenticated content
  }

  // Handle scheme click tracking
  const handleLearnMore = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    saveSchemeView(scheme.id, currentUser.id);
  };

  const handleExternalLink = (scheme: Scheme) => {
    saveSchemeView(scheme.id + '_official_link', currentUser.id);
  };

  // Relevance evaluation algorithm based on User Profile across 5 dimensions:
  // 1. Age, 2. Employment Status, 3. Monthly Income, 4. Risk Profile, 5. Wealth Goals
  const isSchemeRelevant = (scheme: Scheme) => {
    const { age, employmentStatus, monthlyIncome, riskProfile, goals } = currentUser;
    const risk = riskProfile.toLowerCase();

    // --- 1. Employment Status Filter ---
    if (scheme.id === 'gov-epf' && employmentStatus !== 'employed') {
      return false;
    }
    if (scheme.id === 'trad-chit' && (employmentStatus === 'student' || employmentStatus === 'unemployed')) {
      return false;
    }

    // --- 2. Age Filter ---
    if (scheme.id === 'gov-epf' && age >= 60) {
      return false;
    }
    if (scheme.id === 'prot-term' && age < 21) {
      return false;
    }
    if (scheme.id === 'gov-ppf' && age > 65) {
      return false;
    }

    // --- 3. Monthly Income Filter ---
    if (scheme.id === 'prot-term' && monthlyIncome < 1500) {
      return false;
    }
    if ((scheme.id === 'inv-sgb' || scheme.id === 'trad-chit' || scheme.id === 'inv-mf') && monthlyIncome < 1000) {
      return false;
    }

    // --- 4. Risk Profile Filter ---
    const schemeRisk = scheme.riskLevel.toLowerCase();
    if (risk === 'low' && schemeRisk !== 'low') {
      return false;
    }
    if (risk === 'medium' && schemeRisk === 'high') {
      return false;
    }

    // --- 5. Wealth Goals Filter ---
    const goalMapping: Record<string, string[]> = {
      'savings-fd': ['emergency', 'home', 'education'],
      'savings-rd': ['emergency', 'home', 'education'],
      'savings-sa': ['emergency', 'home'],
      'gov-ppf': ['retirement', 'tax'],
      'gov-epf': ['retirement', 'tax'],
      'gov-pos': ['emergency', 'retirement'],
      'inv-sip': ['retirement', 'wealth', 'education'],
      'inv-mf': ['retirement', 'wealth', 'education'],
      'inv-index': ['retirement', 'wealth', 'education'],
      'inv-getf': ['wealth', 'home', 'education'],
      'inv-sgb': ['retirement', 'wealth', 'home', 'education'],
      'trad-gold': ['wealth'],
      'trad-chit': ['emergency', 'wealth'],
      'prot-health': ['tax', 'emergency'],
      'prot-term': ['retirement', 'tax']
    };

    const schemeGoals = goalMapping[scheme.id] || [];
    const matchesGoals = goals.some(g => schemeGoals.includes(g));
    if (!matchesGoals) {
      return false;
    }

    return true;
  };

  // Filter schemes based on active explorer tabs
  const getFilteredSchemes = () => {
    let list: Scheme[] = [];
    switch (activeTab) {
      case 'savings':
        list = schemes.filter(s => s.category === 'Savings');
        break;
      case 'investments':
        list = schemes.filter(s => s.category === 'Investments' || s.category === 'Traditional');
        break;
      case 'insurance':
        list = schemes.filter(s => s.category === 'Protection');
        break;
      case 'government':
        list = schemes.filter(s => s.category === 'Government');
        break;
      case 'learning':
        // Learning surfaces all relevant schemes for educational exploration
        list = schemes;
        break;
      default:
        list = [];
    }
    // Filter to only surface relevant schemes using the multi-variable algorithm (no ranking)
    return list.filter(isSchemeRelevant);
  };

  // Dynamic asset allocation based on risk profile
  const getAllocationData = () => {
    const risk = currentUser.riskProfile.toLowerCase();
    if (risk === 'low') {
      return [
        { name: 'Fixed Income & Cash', value: 70, color: '#0E5A44' },
        { name: 'Sovereign Gold', value: 20, color: '#D4AF37' },
        { name: 'Equity Index', value: 10, color: '#10B981' }
      ];
    } else if (risk === 'medium') {
      return [
        { name: 'Fixed Income & Cash', value: 40, color: '#0E5A44' },
        { name: 'Sovereign Gold', value: 15, color: '#D4AF37' },
        { name: 'Equity Index / SIP', value: 45, color: '#10B981' }
      ];
    } else {
      return [
        { name: 'Fixed Income & Cash', value: 15, color: '#0E5A44' },
        { name: 'Sovereign Gold', value: 5, color: '#D4AF37' },
        { name: 'Equity / Small-Cap MF', value: 80, color: '#10B981' }
      ];
    }
  };

  const allocation = getAllocationData();

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Maps goal IDs to readable text
  const getGoalLabel = (goalId: string) => {
    const goalsMap: Record<string, string> = {
      retirement: 'Retirement Planning',
      wealth: 'Wealth Creation',
      home: 'Buying a Home',
      tax: 'Tax Optimization',
      education: 'Higher Education',
      emergency: 'Emergency Safety Net'
    };
    return goalsMap[goalId] || goalId;
  };

  // Dynamic advice card content
  const getDynamicAdvice = () => {
    const risk = currentUser.riskProfile.toLowerCase();
    if (risk === 'low') {
      return "Your primary objective is preservation of capital. You prefer guaranteed wealth builders over volatile markets. Government-backed instruments like PPF and highly secure bank deposits form the bedrock of your asset matrix.";
    } else if (risk === 'medium') {
      return "You maintain a balanced investment posture, seeking wealth growth through equity index products while ensuring capital stability with secure gold bonds and fixed-income assets.";
    } else {
      return "Your focus is aggressive long-term compounding. You leverage equity SIPs, active mutual funds, and index tracking to outperform inflation, allocating minimal reserves to low-yielding cash instruments.";
    }
  };

  return (
    <div className="min-h-screen bg-[#070b09] bg-gradient-to-br from-[#070b09] via-[#0E5A44]/10 to-[#0b1311] py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-100 antialiased">
      
      {/* Floating Developer Tools Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Live Wealth Feed</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/compare')}
            variant="outline"
            className="border-amber-500/30 bg-amber-500/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Compare Schemes
          </Button>
          <Button
            onClick={() => navigate('/learning')}
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300 animate-pulse"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Learning Hub
          </Button>
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-[#D4AF37]/10 bg-transparent text-slate-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300"
          >
            <Zap className="h-3.5 w-3.5" />
            Admin & Analytics
          </Button>
          <Button
            onClick={() => {
              clearUser();
              navigate('/onboarding');
            }}
            variant="outline"
            className="border-slate-800 bg-transparent text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Profile
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Greeting Banner */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xl shadow-emerald-950/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#D4AF37]">{currentUser.name}</span>
              <Award className="h-7 w-7 text-[#D4AF37] hidden sm:block animate-bounce" />
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed font-medium">
              Your wealth advisory workspace is fully initialized. Explore optimal financial models matched to your unique income stream and risk tolerance.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 bg-emerald-500/5 border border-emerald-500/20 px-4.5 py-3 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">Advisory Strategy</span>
            <span className="text-lg font-black text-white uppercase tracking-wide">
              {currentUser.riskProfile} Risk Profile
            </span>
          </div>
        </div>

        {/* User Summary & Asset Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Profile Summary Card */}
          <Card className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl rounded-2xl flex flex-col">
            <CardHeader className="border-b border-slate-800/80">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-400" />
                Profile Blueprint
              </CardTitle>
              <CardDescription className="text-slate-400">
                Verified demographics and financial statistics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 flex-1">
              
              {/* Income & Savings Metrics */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800/60">
                <div className="bg-[#0b1311]/50 border border-slate-800/80 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Monthly Income</span>
                  <span className="text-lg font-black text-white">{formatCurrency(currentUser.monthlyIncome)}</span>
                </div>
                <div className="bg-[#0b1311]/50 border border-slate-800/80 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Liquid Savings</span>
                  <span className="text-lg font-black text-[#D4AF37]">{formatCurrency(currentUser.savings)}</span>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold"><Calendar className="h-4 w-4" /> Age</span>
                  <span className="text-slate-200 font-extrabold">{currentUser.age} Years</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold"><MapPin className="h-4 w-4" /> Location</span>
                  <span className="text-slate-200 font-extrabold">{currentUser.city}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold"><Briefcase className="h-4 w-4" /> Employment</span>
                  <span className="text-slate-200 font-extrabold capitalize">{currentUser.employmentStatus === 'self-employed' ? 'Freelancer' : currentUser.employmentStatus}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold"><DollarSign className="h-4 w-4" /> Email</span>
                  <span className="text-slate-200 font-extrabold truncate max-w-[180px]">{currentUser.email}</span>
                </div>
              </div>

              {/* Wealth Goals */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 block mb-2">Target Goals</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.goals.map((g) => (
                    <span 
                      key={g} 
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 capitalize"
                    >
                      {getGoalLabel(g)}
                    </span>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Allocation Recharts Graph Card */}
          <Card className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl rounded-2xl flex flex-col">
            <CardHeader className="border-b border-slate-800/80">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <PieIcon className="h-5 w-5 text-[#D4AF37]" />
                Strategy Matrix Allocation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Suggested asset weighting mapping based on your registered tolerance profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col md:flex-row items-center justify-center gap-6">
              
              {/* Graphic Chart Wrapper */}
              <div className="w-56 h-56 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {allocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Core Text */}
                <div className="absolute text-center flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 leading-none">Risk Profile</span>
                  <span className="text-lg font-black text-white uppercase tracking-wider mt-1">{currentUser.riskProfile}</span>
                </div>
              </div>

              {/* Asset Allocation Breakdown details */}
              <div className="flex-1 w-full space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    {getDynamicAdvice()}
                  </p>
                </div>
                <div className="space-y-2">
                  {allocation.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 font-extrabold">{item.name}</span>
                      </div>
                      <span className="text-white font-black text-sm">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Regulatory Disclaimer Banner */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4.5 flex items-start gap-3.5 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
          <Info className="h-5.5 w-5.5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white tracking-wide uppercase">
              Financial Suitability Disclosure
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              <span className="text-[#D4AF37] font-bold">People with similar profiles often explore these options.</span> This catalog acts exclusively as an educational summary of common asset alternatives. The platform does not directly recommend or endorse individual schemes. Consult certified financial advisors before executing capital investments.
            </p>
          </div>
        </div>

        {/* Financial Options Explorer Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <Landmark className="h-6 w-6 text-emerald-400" />
                Financial Options Explorer
              </h2>
              <div className="space-y-1">
                <p className="text-[#D4AF37] text-sm font-extrabold tracking-wide uppercase flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-[#D4AF37] animate-pulse" />
                  People with similar profiles often explore these options.
                </p>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-xl">
                  Disclaimer: The catalog below features secure models matching your profile. The platform does not directly recommend or endorse individual schemes.
                </p>
              </div>
            </div>
            
            {/* Action-centric Stepper Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 border border-slate-800/80 rounded-xl max-w-full">
              {(['savings', 'investments', 'insurance', 'government', 'learning'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedScheme(null); // Clear active slide details
                  }}
                  className={cn(
                    "text-xs font-bold px-4 py-2 rounded-lg transition-all duration-300 capitalize",
                    activeTab === tab 
                      ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/10" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog grid */}
          {activeTab === 'learning' && (
            <div className="mb-10 space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-white">Curated Financial Literacy Tutorials</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(learningData as LearningContent[]).map((tutorial) => (
                  <Card 
                    key={tutorial.id}
                    className="bg-[#0b1311]/60 hover:bg-[#0b1311]/90 backdrop-blur-xl border border-slate-800/80 hover:border-[#D4AF37]/30 transition-all duration-300 rounded-xl flex flex-col justify-between group shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/5 relative overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                          {tutorial.category}
                        </span>
                      </div>
                      <CardTitle className="text-base font-extrabold text-white leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                        {tutorial.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs line-clamp-2 pt-1.5 font-medium leading-relaxed">
                        {tutorial.description}
                      </CardDescription>
                    </CardHeader>
                    
                    {/* Visual Video Thumbnail */}
                    <CardContent className="px-5 pb-2">
                      <div 
                        onClick={() => {
                          setSelectedTutorial(tutorial);
                          saveSchemeView(tutorial.id + '_video_click', currentUser.id);
                        }}
                        className="relative h-32 rounded-lg bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 group-hover:border-[#D4AF37]/20 transition-all duration-300 cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-cover bg-center filter brightness-50 group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60')` }} />
                        <div className="relative z-10 w-12 h-12 rounded-full bg-[#D4AF37] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-6 w-6 fill-current pl-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-3 pb-4 px-5">
                      <Button
                        onClick={() => {
                          setSelectedTutorial(tutorial);
                          saveSchemeView(tutorial.id + '_video_click', currentUser.id);
                        }}
                        className="w-full bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-slate-950 border border-[#D4AF37]/20 text-xs font-bold py-2 rounded-lg transition-all duration-300"
                      >
                        Watch Video Tutorial
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="border-t border-slate-800 pt-8 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Relevant Scheme Materials</h3>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredSchemes().map((scheme) => {
              const isLowRisk = scheme.riskLevel.toLowerCase() === 'low';
              const isMediumRisk = scheme.riskLevel.toLowerCase() === 'medium';
              return (
                <Card 
                  key={scheme.id}
                  className="bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 hover:border-emerald-500/30 transition-all duration-300 rounded-xl flex flex-col justify-between group hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-emerald-950/5 relative overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                        {scheme.category}
                      </span>
                      {/* Risk Badge */}
                      <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1",
                        isLowRisk && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        isMediumRisk && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                        !isLowRisk && !isMediumRisk && "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}>
                        <Shield className="h-2.5 w-2.5 fill-current" />
                        {scheme.riskLevel} Risk
                      </span>
                    </div>
                    <CardTitle className="text-base font-extrabold text-white leading-tight group-hover:text-emerald-400 transition-colors duration-300">
                      {scheme.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs line-clamp-2 pt-1.5 font-medium leading-relaxed">
                      {scheme.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 pb-4 pt-1 border-t border-slate-800/40 mt-1 px-5">
                    <div className="flex justify-between text-[11px] py-1 border-b border-slate-800/30">
                      <span className="text-slate-500 font-bold">Lock-In Period:</span>
                      <span className="text-slate-300 font-extrabold truncate max-w-[170px]">{scheme.lockIn}</span>
                    </div>
                    <div className="flex justify-between text-[11px] py-1">
                      <span className="text-slate-500 font-bold">Liquidity Class:</span>
                      <span className="text-slate-300 font-extrabold truncate max-w-[170px]">{scheme.liquidity}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 pb-4 border-t border-slate-800/60 bg-slate-950/20 flex gap-2">
                    <Button
                      onClick={() => handleLearnMore(scheme)}
                      variant="outline"
                      className="flex-1 border-slate-800 bg-transparent text-slate-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-xs font-bold py-1.5 rounded-lg transition-all duration-300"
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                      Learn More
                    </Button>
                    <a
                      href={scheme.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleExternalLink(scheme)}
                      className="px-3.5 py-2 rounded-lg border border-slate-800 bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all duration-300 shrink-0"
                      title="Visit Official Link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Empty state for tabs that return no relevant schemes */}
          {getFilteredSchemes().length === 0 && (
            <div className="bg-slate-900/20 border border-slate-800/60 rounded-xl p-8 text-center text-slate-500 font-semibold animate-fade-in w-full col-span-full">
              No financial options match your current profile criteria in this category. Adjust your strategy blueprint parameters to explore other models.
            </div>
          )}
        </div>

        {/* Detailed Study Panel / Learning View Drawer */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <Card className="w-full max-w-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden rounded-2xl animate-in zoom-in-95 duration-300">
              {/* Glowing decorative light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <CardHeader className="border-b border-slate-800 pb-4 flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {selectedScheme.category}
                    </span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {selectedScheme.riskLevel} Risk
                    </span>
                  </div>
                  <CardTitle className="text-xl font-extrabold text-white">
                    {selectedScheme.title}
                  </CardTitle>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-all duration-300 shrink-0"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </CardHeader>

              <CardContent className="pt-5 space-y-6 pb-6 max-h-[70vh] overflow-y-auto">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Core Overview</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                    {selectedScheme.description}
                  </p>
                </div>

                {/* Properties grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Lock-In Period</span>
                    <span className="text-xs text-white font-extrabold">{selectedScheme.lockIn}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Liquidity Framework</span>
                    <span className="text-xs text-white font-extrabold">{selectedScheme.liquidity}</span>
                  </div>
                  <div className="space-y-1 pt-1 md:pt-0">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Eligible Investors</span>
                    <span className="text-xs text-white font-extrabold">{selectedScheme.eligibility}</span>
                  </div>
                  <div className="space-y-1 pt-1 md:pt-0">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Sovereign Source</span>
                    <span className="text-xs text-emerald-400 font-extrabold truncate block">
                      {new URL(selectedScheme.officialLink).hostname}
                    </span>
                  </div>
                </div>

                {/* Educational Summary - Primary regulatory focus */}
                {selectedScheme.educationalSummary && (
                  <div className="space-y-2.5 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      Educational Summary & Analysis
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      {selectedScheme.educationalSummary}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t border-slate-800 pt-4 pb-5 flex gap-3 bg-slate-950/40">
                <Button
                  onClick={() => setSelectedScheme(null)}
                  variant="outline"
                  className="flex-1 border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold py-2.5 rounded-lg transition-all duration-300"
                >
                  Close Explorer
                </Button>
                <a
                  href={selectedScheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleExternalLink(selectedScheme)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all duration-300"
                >
                  Visit Official Portal
                  <ExternalLink className="h-3.5 w-3.5 text-slate-950" />
                </a>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Detailed Tutorial Video Play Panel */}
        {selectedTutorial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
            <Card className="w-full max-w-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden rounded-2xl animate-in zoom-in-95 duration-300">
              <CardHeader className="border-b border-slate-800 pb-4 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]">
                    {selectedTutorial.category}
                  </span>
                  <CardTitle className="text-xl font-extrabold text-white pt-1">
                    {selectedTutorial.title}
                  </CardTitle>
                </div>
                <button
                  onClick={() => setSelectedTutorial(null)}
                  className="text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-all duration-300 shrink-0"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </CardHeader>

              <CardContent className="p-0 bg-black aspect-video flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedTutorial.videoUrl}
                  title={selectedTutorial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </CardContent>

              <CardFooter className="border-t border-slate-800 pt-4 pb-5 px-6 flex justify-between items-center bg-slate-950/40">
                <p className="text-xs text-slate-400 max-w-md leading-relaxed font-semibold">
                  {selectedTutorial.description}
                </p>
                <Button
                  onClick={() => setSelectedTutorial(null)}
                  className="bg-[#D4AF37] hover:bg-[#c59d2a] text-slate-950 font-black text-xs py-2 px-5 rounded-lg transition-all duration-300"
                >
                  Done Learning
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
