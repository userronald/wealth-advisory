import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Zap, RefreshCw, Scale, TrendingUp, Lock, 
  Unlock, Sparkles, ShieldCheck, AlertTriangle, ChevronRight, 
  Info, ArrowLeftRight, Search, Play, FileText, Landmark, Shield, 
  ExternalLink 
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/useUserStore';
import { savePageVisit, saveSchemeView } from '@/lib/storage';
import learningData from '@/data/learning.json';
import { cn } from '@/lib/utils';
import type { LearningContent } from '@/types';

export default function LearningHubPage() {
  const navigate = useNavigate();
  const currentUser = useUserStore(state => state.currentUser);
  const clearUser = useUserStore(state => state.clearUser);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedVideo, setSelectedVideo] = useState<LearningContent | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<LearningContent | null>(null);

  const learningList = learningData as LearningContent[];

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
        pageVisited: 'learning',
        timestamp: new Date()
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  // Get distinct categories
  const categories = ['All', ...Array.from(new Set(learningList.map(item => item.category)))];

  // Filter learning modules based on category and search query
  const getFilteredLearning = () => {
    return learningList.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Map icon component per category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'investments':
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case 'savings':
        return <Landmark className="h-5 w-5 text-emerald-400" />;
      case 'protection':
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      case 'traditional':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'wealth basics':
      default:
        return <Sparkles className="h-5 w-5 text-[#D4AF37]" />;
    }
  };

  // Get custom educational guide breakdowns for each card article
  const getArticleContent = (id: string): string => {
    switch (id) {
      case 'learn-sip':
        return "Systematic Investment Plans (SIP) function on the cornerstone principle of discipline and dollar-cost averaging. Instead of attempting to time the market (which is highly volatile and risky for beginners), you invest a constant cash pool regularly. Over time, when stock prices drop, your fixed budget buys more units; when prices rise, you buy fewer. This compounding mechanism reduces the average cost per unit and consistently builds powerful wealth over 5, 10, or 20 years.";
      case 'learn-fd':
        return "Fixed Deposits are standard cash-preservation structures. You contract with a bank or post office, locking in your capital for a specified tenure (e.g. 1 year, 3 years, 5 years) in exchange for a fixed interest rate. Since the return is legally locked and banks are backstopped by RBI DICGC insurance (up to ₹5 Lakhs per bank), your cash is immune to market volatility, making it an excellent option for low-risk needs like an emergency fund.";
      case 'learn-health-ins':
        return "Health insurance acts as your primary asset shield. A single critical surgery or medical emergency can wipe out years of accumulated savings in days. Health insurance pools risk, covering major inpatient hospitalizations, pre/post care, and surgeries in exchange for a small annual premium. Cashless networks make treatment instant and stress-free. It also offers solid tax savings under Section 80D.";
      case 'learn-term-ins':
        return "Term insurance is the purest and most essential form of financial protection. Unlike premium investment-linked insurance plans, term plans offer high death cover for extremely low premiums because they have no investment value. If the policyholder passes away during the term, the complete sum assured goes to the family nominees, securing their home mortgages, children's educations, and daily living requirements. It is a critical foundation for any family's financial plan.";
      case 'learn-emergency-fund':
        return "An emergency fund is your personal financial shock absorber. Life is full of unexpected events like medical crises, car breakdowns, or sudden job loss. Keeping 3 to 6 months of basic living costs easily accessible in a liquid savings account or short-term bank FD ensures that you can navigate unexpected storms without having to liquidate long-term growth investments early or accumulate high-interest credit card debt.";
      case 'learn-chit-risks':
        return "Chit funds are traditional community-based saving circles. Subscribers pay monthly pools, which are bid out monthly. While popular historically, they lack commercial banking security. Key risks include subscriber defaults (which collapse the pool), bidding yield losses, and lack of strict regulatory coverage, making them high-risk instruments compared to standard bank FDs or mutual fund SIPs.";
      case 'learn-gold-saving':
        return "Gold is a timeless store of value. It historically preserves purchasing power during high inflation and geopolitical instability. Modern gold saving methods include digital gold (buying fractional, physical gold online) and Sovereign Gold Bonds (SGBs). SGBs are particularly secure: backed by the central bank, they track market gold prices tax-free at maturity while paying an additional 2.5% annual interest yield.";
      default:
        return "Objective education is key to stable personal finance strategy blueprinting. Take the time to study and understand each financial model before deploying your capital assets.";
    }
  };

  const handlePlayVideo = (item: LearningContent) => {
    setSelectedVideo(item);
    saveSchemeView('learning_video_' + item.id, currentUser.id);
  };

  const handleReadArticle = (item: LearningContent) => {
    setSelectedArticle(item);
    saveSchemeView('learning_article_' + item.id, currentUser.id);
  };

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
            onClick={() => navigate('/compare')}
            variant="outline"
            className="border-amber-500/30 bg-amber-500/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all duration-300 animate-pulse"
          >
            <Scale className="h-3.5 w-3.5" />
            Compare Schemes
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
              <BookOpen className="h-8 w-8 text-emerald-400" />
              Wealth Academy Learning Hub
            </h1>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed font-medium">
              Sift through personal finance models simply. Explore curated educational modules, watch responsive video tutorials, and read core strategy breakdowns.
            </p>
          </div>
        </div>

        {/* Search & Filter Header Grid */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Categories selectors */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 shrink-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  saveSchemeView('learning_filter_' + cat.toLowerCase().replace(/[^a-z0-9]/g, '_'), currentUser.id);
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 cursor-pointer",
                  activeCategory === cat
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-900/40 text-slate-500 border-slate-800/80 hover:text-slate-300 hover:border-slate-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts or key terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 font-medium transition-all duration-300"
            />
          </div>
        </div>

        {/* Modules Card Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredLearning().map((item) => (
            <Card 
              key={item.id}
              className="bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 hover:border-emerald-500/30 transition-all duration-300 rounded-xl flex flex-col justify-between group shadow-lg hover:shadow-xl hover:shadow-emerald-950/5 relative overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                    {item.category}
                  </span>
                  <div className="p-1 rounded bg-slate-950/40 border border-slate-800/40">
                    {getCategoryIcon(item.category)}
                  </div>
                </div>
                <CardTitle className="text-base font-extrabold text-white leading-tight group-hover:text-emerald-400 transition-colors duration-300">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs line-clamp-3 pt-1.5 font-medium leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-5 pb-2">
                <div 
                  onClick={() => handlePlayVideo(item)}
                  className="relative h-32 rounded-lg bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 group-hover:border-emerald-500/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-cover bg-center filter brightness-50 group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60')` }} />
                  <div className="relative z-10 w-11 h-11 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-5 w-5 fill-current pl-0.5 text-slate-950" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 pb-4 border-t border-slate-800/40 bg-slate-950/20 flex gap-2">
                <Button
                  onClick={() => handleReadArticle(item)}
                  variant="outline"
                  className="flex-1 border-slate-800 bg-transparent text-slate-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-xs font-bold py-1.5 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  Read Guide
                </Button>
                <Button
                  onClick={() => handlePlayVideo(item)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 text-slate-950 fill-current" />
                  Watch Video
                </Button>
              </CardFooter>
            </Card>
          ))}
          {getFilteredLearning().length === 0 && (
            <div className="bg-slate-900/20 border border-slate-800/60 rounded-xl p-8 text-center text-slate-500 font-semibold w-full col-span-full">
              No learning modules match your search filter keywords.
            </div>
          )}
        </div>
      </div>

      {/* Video Overlay Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden rounded-2xl animate-in zoom-in-95 duration-300">
            <CardHeader className="border-b border-slate-800 pb-4 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {selectedVideo.category}
                </span>
                <CardTitle className="text-xl font-extrabold text-white pt-1">
                  {selectedVideo.title}
                </CardTitle>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
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
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </CardContent>

            <CardFooter className="border-t border-slate-800 pt-4 pb-5 px-6 flex justify-between items-center bg-slate-950/40">
              <p className="text-xs text-slate-400 max-w-md leading-relaxed font-semibold">
                {selectedVideo.description}
              </p>
              <Button
                onClick={() => setSelectedVideo(null)}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-2 px-5 rounded-lg transition-all duration-300"
              >
                Done Watching
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Article Overlay Text Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <CardHeader className="border-b border-slate-800 pb-4 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {selectedArticle.category}
                </span>
                <CardTitle className="text-xl font-extrabold text-white pt-1">
                  {selectedArticle.title}
                </CardTitle>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-all duration-300 shrink-0"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </CardHeader>

            <CardContent className="pt-5 space-y-4 pb-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Guide Description</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {selectedArticle.description}
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  In-Depth Strategy Guide
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-bold">
                  {getArticleContent(selectedArticle.id)}
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-800 pt-4 pb-5 flex gap-3 bg-slate-950/40">
              <Button
                onClick={() => setSelectedArticle(null)}
                variant="outline"
                className="flex-1 border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold py-2.5 rounded-lg transition-all duration-300 cursor-pointer"
              >
                Close Guide
              </Button>
              <Button
                onClick={() => {
                  setSelectedArticle(null);
                  handlePlayVideo(selectedArticle);
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 text-slate-950 fill-current" />
                Watch Video Tutorial
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  );
}
