import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Zap, RefreshCw, Scale, TrendingUp, Lock, 
  Unlock, Sparkles, ShieldCheck, AlertTriangle, ChevronRight, 
  Info, ArrowLeftRight, Landmark, HelpCircle, ExternalLink 
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/useUserStore';
import { savePageVisit, saveSchemeView } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface ComparisonItem {
  id: string;
  name: string;
  category: string;
  risk: 'Low' | 'Medium' | 'High' | 'Zero';
  riskLabel: string;
  returnPotential: string;
  liquidity: 'High' | 'Medium' | 'Low' | 'Very High';
  liquidityLabel: string;
  lockIn: string;
  beginnerFriendly: boolean;
  beginnerLabel: string;
  fullOverview: string;
  suitability: string;
  authorityLink: string;
}

export default function ComparisonPage() {
  const navigate = useNavigate();
  const currentUser = useUserStore(state => state.currentUser);
  const clearUser = useUserStore(state => state.clearUser);

  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  // Comparison matrix dataset representing 6 instruments
  const comparisonData: ComparisonItem[] = [
    {
      id: 'fd',
      name: 'Fixed Deposit (FD)',
      category: 'Savings',
      risk: 'Low',
      riskLabel: 'Low (Insured up to ₹5 Lakhs per bank; immune to stock swings)',
      returnPotential: '6.0% - 7.5% (Guaranteed & fixed on deposit)',
      liquidity: 'Medium',
      liquidityLabel: 'Medium (Premature closure allowed; incurs minor interest rate penalty)',
      lockIn: '1 to 5 Years (Tenure flexible based on term choice)',
      beginnerFriendly: true,
      beginnerLabel: 'Yes - Extremely simple lump-sum capital preservation',
      fullOverview: 'A Fixed Deposit is a savings instrument where you lock in a lump sum for a fixed period at a guaranteed interest rate. It is one of the safest financial tools available for keeping short-to-medium-term cash stable.',
      suitability: 'Ideal for conservative savers seeking capital safety, emergency cash storage, or predictable income payouts.',
      authorityLink: 'https://www.rbi.org.in'
    },
    {
      id: 'sip',
      name: 'Systematic Investment Plan (SIP)',
      category: 'Investments',
      risk: 'Medium',
      riskLabel: 'Medium to High (Varies depending on backing equity or debt mutual fund assets)',
      returnPotential: '12.0% - 15.0% (Inflation-beating long-term averages)',
      liquidity: 'Very High',
      liquidityLabel: 'Very High (Redeem units instantly; minor exit loads inside 1 year)',
      lockIn: 'None (Zero lock-in except for tax-saving ELSS funds)',
      beginnerFriendly: true,
      beginnerLabel: 'Yes - Automates regular small deposits, averaging market entries',
      fullOverview: 'A SIP is an automated recurring mutual fund investment mode. It removes emotional timing and buys more units during market lows, providing an excellent long-term wealth compounding asset.',
      suitability: 'Perfect for long-term goals like retirement planning, wealth accumulation, or home down-payments.',
      authorityLink: 'https://www.sebi.gov.in'
    },
    {
      id: 'gold',
      name: 'Sovereign Gold Bonds (SGB) / Gold Savings',
      category: 'Traditional',
      risk: 'Medium',
      riskLabel: 'Low to Medium (Tracks global gold commodity price cycles)',
      returnPotential: '8.0% - 11.0% (Commodity hedge + 2.5% annual guaranteed interest)',
      liquidity: 'High',
      liquidityLabel: 'Medium-High (Digital gold is instant; SGB has active stock market trading)',
      lockIn: 'None to 8 Years (SGB maturity is 8 years, early sovereign exits after 5th year)',
      beginnerFriendly: true,
      beginnerLabel: 'Yes - Traditional physical security without purity or storage overheads',
      fullOverview: 'Gold Savings protect capital from purchasing power inflation. Sovereign Gold Bonds are government-backed securities that yield regular interest on top of physical gold appreciation.',
      suitability: 'Suited for investors looking for commodity diversification, macro hedges, or EEE tax-exempt long term gold savings.',
      authorityLink: 'https://www.rbi.org.in'
    },
    {
      id: 'chit',
      name: 'Chit Funds (Traditional savings)',
      category: 'Traditional',
      risk: 'High',
      riskLabel: 'High (Susceptible to subscriber bidding default and foreman credit risks)',
      returnPotential: '7.0% - 10.0% (Highly variable bidding-rate dividends)',
      liquidity: 'Low',
      liquidityLabel: 'Low (Access depends on monthly bidding results and foreman commission)',
      lockIn: 'Entire Chit Tenure (Typically 2 to 3 years)',
      beginnerFriendly: false,
      beginnerLabel: 'No - Requires deep comprehension of bidding discounts and foreman trust',
      fullOverview: 'A chit fund is a local rotating credit and savings scheme. Subscribers pay a monthly premium, and one subscriber bids to take home the pool discount monthly.',
      suitability: 'Traditional savers with steady income who require sudden borrowing credits without bank loans.',
      authorityLink: 'https://www.rbi.org.in'
    },
    {
      id: 'ppf',
      name: 'Public Provident Fund (PPF)',
      category: 'Government',
      risk: 'Zero',
      riskLabel: 'Zero (Sovereign central government backed and fully guaranteed)',
      returnPotential: '7.1% (Exempt-Exempt-Exempt EEE fully tax-free returns)',
      liquidity: 'Low',
      liquidityLabel: 'Low (Partial emergency withdrawals allowed after the 7th year)',
      lockIn: '15 Years (Maturity extendable in blocks of 5 years indefinitely)',
      beginnerFriendly: true,
      beginnerLabel: 'Yes - Highly secure and straightforward tax-saving retirement vault',
      fullOverview: 'PPF is a government savings plan offering outstanding EEE tax exemptions (contribution, growth, and withdrawals are tax-exempt), ideal for long-term secure compound safety.',
      suitability: 'Perfect for risk-averse individuals, tax optimization, and long-term security building.',
      authorityLink: 'https://www.indiapost.gov.in'
    },
    {
      id: 'po',
      name: 'Post Office Savings / Time Deposit',
      category: 'Government',
      risk: 'Zero',
      riskLabel: 'Zero (Sovereign central government backed and fully guaranteed)',
      returnPotential: '6.5% - 7.5% (Stable, predictable quarterly returns)',
      liquidity: 'Medium',
      liquidityLabel: 'Medium (Early exits allowed after 6 months with small penalty)',
      lockIn: '1 to 5 Years (Varies based on RD or Time Deposit tenure)',
      beginnerFriendly: true,
      beginnerLabel: 'Yes - Highly traditional Offline/Online sovereign trust structures',
      fullOverview: 'Post Office small savings plans offer bank-like FDs backed by the sovereign state. It features stable interest payouts, easy post office branch operations, and tax benefits under section 80C.',
      suitability: 'Excellent for senior citizens, rural savers, and risk-free fixed income planning.',
      authorityLink: 'https://www.indiapost.gov.in'
    }
  ];

  // Dynamic filter state
  const [visibleIds, setVisibleIds] = useState<string[]>(comparisonData.map(d => d.id));

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
        pageVisited: 'compare',
        timestamp: new Date()
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  // Toggle scheme visibility
  const toggleVisibility = (id: string) => {
    setVisibleIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    );
  };

  const handleLearnMore = (scheme: ComparisonItem) => {
    setSelectedSchemeId(scheme.id);
    saveSchemeView('compare_detail_' + scheme.id, currentUser.id);
  };

  const selectedScheme = comparisonData.find(d => d.id === selectedSchemeId);
  const activeItems = comparisonData.filter(d => visibleIds.includes(d.id));

  return (
    <div className="min-h-screen bg-[#070b09] bg-gradient-to-br from-[#070b09] via-[#0E5A44]/10 to-[#0b1311] py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-100 antialiased">
      
      {/* Floating Developer Tools Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 shrink-0">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="border-slate-800 bg-transparent text-slate-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
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
            className="border-slate-800 bg-transparent text-slate-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300"
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

      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header Greeting Banner */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-emerald-950/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Scale className="h-8 w-8 text-[#D4AF37]" />
              Side-by-Side Scheme Comparison
            </h1>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed font-medium">
              Objective comparison of core wealth savings models. Toggle checklist filters to isolate items, inspect risk parameters, lock-ins, return potentials, and liquidities.
            </p>
          </div>
        </div>

        {/* Dynamic Selectors Card */}
        <Card className="bg-slate-900/40 border border-slate-800/60 rounded-xl shadow-lg relative overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-800/40">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-[#D4AF37]" />
              Select Models to Compare Side-by-Side
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-semibold">
              Check or uncheck instruments below to customize your comparison workspace in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2.5">
              {comparisonData.map(item => {
                const isActive = visibleIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleVisibility(item.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-black border transition-all duration-300 flex items-center gap-2 cursor-pointer",
                      isActive
                        ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-md shadow-[#D4AF37]/5"
                        : "bg-transparent text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700"
                    )}
                  >
                    <div className={cn(
                      "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0",
                      isActive ? "bg-[#D4AF37] border-[#D4AF37] text-slate-950" : "border-slate-700"
                    )}>
                      {isActive && (
                        <svg className="w-2.5 h-2.5 fill-current stroke-current" viewBox="0 0 24 24">
                          <path fill="none" strokeWidth="3" d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    {item.name}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-5">Financial Model</th>
                <th className="py-4 px-5">Risk Rating</th>
                <th className="py-4 px-5">Return Potential</th>
                <th className="py-4 px-5">Liquidity Frame</th>
                <th className="py-4 px-5">Lock-in Period</th>
                <th className="py-4 px-5">Beginner Friendly</th>
                <th className="py-4 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs font-semibold">
              {activeItems.map((item) => {
                const isZeroRisk = item.risk === 'Zero';
                const isLowRisk = item.risk === 'Low';
                const isMediumRisk = item.risk === 'Medium';
                
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-800/20 transition-all duration-200 group"
                  >
                    {/* Model Name */}
                    <td className="py-4 px-5 text-white font-extrabold text-sm group-hover:text-emerald-400 transition-colors duration-200">
                      {item.name}
                    </td>

                    {/* Risk Badge */}
                    <td className="py-4 px-5">
                      <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded inline-flex items-center gap-1",
                        isZeroRisk && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        isLowRisk && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        isMediumRisk && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                        item.risk === 'High' && "bg-red-500/10 text-red-400 border border-red-500/20"
                      )}>
                        <ShieldCheck className="h-2.5 w-2.5 fill-current" />
                        {item.risk} Risk
                      </span>
                    </td>

                    {/* Return Potential */}
                    <td className="py-4 px-5 text-slate-300 font-extrabold flex items-center gap-1.5 pt-4.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      {item.returnPotential}
                    </td>

                    {/* Liquidity Class */}
                    <td className="py-4 px-5 text-slate-400 font-bold">
                      {item.liquidityLabel}
                    </td>

                    {/* Lock-in */}
                    <td className="py-4 px-5 text-slate-300 font-extrabold">
                      <div className="flex items-center gap-1">
                        {item.lockIn.toLowerCase().includes('none') ? (
                          <Unlock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        )}
                        {item.lockIn}
                      </div>
                    </td>

                    {/* Beginner Friendly */}
                    <td className="py-4 px-5">
                      {item.beginnerFriendly ? (
                        <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                          Yes
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1">
                          <HelpCircle className="h-3 w-3 text-slate-600" />
                          No
                        </span>
                      )}
                    </td>

                    {/* Learn More Button */}
                    <td className="py-4 px-5 text-right">
                      <Button
                        onClick={() => handleLearnMore(item)}
                        variant="outline"
                        className="border-slate-800 bg-transparent text-slate-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-[10px] font-black px-2.5 py-1 rounded transition-all duration-300"
                      >
                        Read Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {activeItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                    No models selected. Check instruments in the dynamic list above to begin comparison.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Stacking Layout */}
        <div className="md:hidden space-y-6">
          {activeItems.map((item) => {
            const isZeroRisk = item.risk === 'Zero';
            const isLowRisk = item.risk === 'Low';
            const isMediumRisk = item.risk === 'Medium';
            return (
              <Card 
                key={item.id}
                className="bg-slate-900/40 border border-slate-800/60 rounded-xl relative overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <CardHeader className="pb-3 border-b border-slate-800/40 bg-slate-950/20">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                      {item.category}
                    </span>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded inline-flex items-center gap-1",
                      isZeroRisk && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                      isLowRisk && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                      isMediumRisk && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                      item.risk === 'High' && "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                      <ShieldCheck className="h-2.5 w-2.5" />
                      {item.risk} Risk
                    </span>
                  </div>
                  <CardTitle className="text-base font-extrabold text-white">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="py-4 space-y-3 text-xs font-semibold leading-relaxed px-5 border-b border-slate-800/40">
                  <div className="flex justify-between py-1 border-b border-slate-800/30">
                    <span className="text-slate-500 font-bold">Return Potential:</span>
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {item.returnPotential}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/30">
                    <span className="text-slate-500 font-bold">Liquidity:</span>
                    <span className="text-slate-300 font-extrabold truncate max-w-[200px]">{item.liquidityLabel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/30">
                    <span className="text-slate-500 font-bold">Lock-In:</span>
                    <span className="text-slate-300 font-extrabold flex items-center gap-1">
                      {item.lockIn.toLowerCase().includes('none') ? <Unlock className="h-3 w-3 text-emerald-400" /> : <Lock className="h-3 w-3 text-slate-500" />}
                      {item.lockIn}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-bold">Beginner Friendly:</span>
                    <span className="text-slate-300 font-extrabold flex items-center gap-1">
                      {item.beginnerFriendly ? <Sparkles className="h-3 w-3 text-[#D4AF37]" /> : <HelpCircle className="h-3 w-3 text-slate-500" />}
                      {item.beginnerFriendly ? 'Yes' : 'No'}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-3 pb-3 bg-slate-950/20 flex gap-2">
                  <Button
                    onClick={() => handleLearnMore(item)}
                    className="w-full bg-transparent hover:bg-emerald-500/5 text-emerald-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/30 text-xs font-bold py-2 rounded-lg transition-all duration-300"
                  >
                    View Comprehensive Analysis
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          {activeItems.length === 0 && (
            <div className="bg-slate-900/20 border border-slate-800/60 rounded-xl p-8 text-center text-slate-500 font-semibold">
              No models selected. Check instruments in the dynamic list above to begin comparison.
            </div>
          )}
        </div>
      </div>

      {/* Detailed Slide-out Drawer Panel overlay */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
            
            <CardHeader className="border-b border-slate-800 pb-4 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {selectedScheme.category}
                  </span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {selectedScheme.risk} Risk
                  </span>
                </div>
                <CardTitle className="text-xl font-extrabold text-white">
                  {selectedScheme.name}
                </CardTitle>
              </div>
              <button
                onClick={() => setSelectedSchemeId(null)}
                className="text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-all duration-300 shrink-0"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </CardHeader>

            <CardContent className="pt-5 space-y-6 pb-6 max-h-[65vh] overflow-y-auto">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Core Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                  {selectedScheme.fullOverview}
                </p>
              </div>

              {/* Suitability */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Target Suitability</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                  {selectedScheme.suitability}
                </p>
              </div>

              {/* Param Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-semibold leading-relaxed">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Risk Matrix Details</span>
                  <span className="text-white font-extrabold text-xs">{selectedScheme.riskLabel}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Return Framework</span>
                  <span className="text-white font-extrabold text-xs">{selectedScheme.returnPotential}</span>
                </div>
                <div className="space-y-1 pt-1 sm:pt-0">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Liquidity Framework</span>
                  <span className="text-white font-extrabold text-xs">{selectedScheme.liquidityLabel}</span>
                </div>
                <div className="space-y-1 pt-1 sm:pt-0">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Beginner Friendly Details</span>
                  <span className="text-white font-extrabold text-xs">{selectedScheme.beginnerLabel}</span>
                </div>
              </div>

              {/* Educational Advisory */}
              <div className="space-y-2.5 p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  Regulatory Guidance Notice
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  To align with transparent financial counseling directives: this model operates under sovereign banking or capital market authorities ({new URL(selectedScheme.authorityLink).hostname}). Always check regulatory notifications on their official portals before committing capital resources.
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-800 pt-4 pb-5 flex gap-3 bg-slate-950/40">
              <Button
                onClick={() => setSelectedSchemeId(null)}
                variant="outline"
                className="flex-1 border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold py-2.5 rounded-lg transition-all duration-300"
              >
                Close Analysis
              </Button>
              <a
                href={selectedScheme.authorityLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => saveSchemeView('compare_external_' + selectedScheme.id, currentUser.id)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all duration-300"
              >
                Visit Official Authority Portal
                <ExternalLink className="h-3.5 w-3.5 text-slate-950" />
              </a>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  );
}
