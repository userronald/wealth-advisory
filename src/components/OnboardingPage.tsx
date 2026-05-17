import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, Mail, Phone, Calendar, MapPin, 
  Briefcase, GraduationCap, Laptop, Building2, UserMinus,
  PiggyBank, TrendingUp, ShieldAlert, Shield, ShieldCheck, Check,
  ChevronLeft, ChevronRight, Sparkles, Goal, Landmark, FileText
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { onboardingSchema, type OnboardingFormData } from '@/lib/onboarding-schema';
import { useUserStore } from '@/store/useUserStore';
import { saveUserToAdminList, savePageVisit } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);
  const currentUser = useUserStore(state => state.currentUser);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect to dashboard if user profile already exists
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Track page visit on mount
  useEffect(() => {
    savePageVisit({
      userId: 'anonymous',
      pageVisited: 'onboarding',
      timestamp: new Date()
    });
  }, []);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      age: undefined,
      city: '',
      employmentStatus: undefined,
      monthlyIncome: undefined,
      savings: undefined,
      riskProfile: undefined,
      goals: []
    }
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = methods;

  const watchedValues = watch();

  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof OnboardingFormData> = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email', 'phone', 'age', 'city'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['employmentStatus', 'monthlyIncome', 'savings'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      const userId = uuidv4();
      
      const userProfile = {
        id: userId,
        ...data
      };

      // 1. Save locally & Update state store
      setUser(userProfile);
      
      // 2. Add to Admin list
      saveUserToAdminList(userProfile);

      // 3. Track submission analytics
      savePageVisit({
        userId: userId,
        pageVisited: 'onboarding_submit',
        timestamp: new Date()
      });

      // 4. Redirect to Dashboard with brief delay for feeling premium
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  // Employment options details
  const employmentOptions = [
    { value: 'employed', label: 'Employed', icon: Briefcase, desc: 'Salaried professional' },
    { value: 'self-employed', label: 'Freelancer', icon: Laptop, desc: 'Self-employed / Freelancer' },
    { value: 'business', label: 'Business Owner', icon: Building2, desc: 'Enterprise owner' },
    { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Currently studying' },
    { value: 'unemployed', label: 'Unemployed', icon: UserMinus, desc: 'Seeking opportunities' }
  ] as const;

  // Risk profiles details
  const riskOptions = [
    { 
      value: 'low', 
      label: 'Conservative (Low)', 
      icon: Shield, 
      desc: 'Focus on capital protection and steady, guaranteed returns.',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
    },
    { 
      value: 'medium', 
      label: 'Balanced (Medium)', 
      icon: ShieldCheck, 
      desc: 'Moderate risk, balancing capital growth with volatility protection.',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
    },
    { 
      value: 'high', 
      label: 'Aggressive (High)', 
      icon: ShieldAlert, 
      desc: 'High risk, pursuing maximum compounding growth through equities.',
      color: 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10'
    }
  ] as const;

  // Financial goals
  const goalOptions = [
    { id: 'retirement', label: 'Retirement Planning', icon: Landmark, desc: 'Build a secure, tax-free nest egg.' },
    { id: 'wealth', label: 'Wealth Creation', icon: TrendingUp, desc: 'Long-term equity compounding.' },
    { id: 'home', label: 'Buying a Home', icon: Landmark, desc: 'Saving for property down-payment.' },
    { id: 'tax', label: 'Tax Optimization', icon: FileText, desc: 'Minimize liability under Section 80C.' },
    { id: 'education', label: 'Higher Education', icon: GraduationCap, desc: 'Fund studies or career development.' },
    { id: 'emergency', label: 'Emergency Safety Net', icon: Shield, desc: 'Liquid reserves for peace of mind.' }
  ];

  const toggleGoal = (goalId: string) => {
    const currentGoals = watchedValues.goals || [];
    if (currentGoals.includes(goalId)) {
      setValue('goals', currentGoals.filter(g => g !== goalId), { shouldValidate: true });
    } else {
      setValue('goals', [...currentGoals, goalId], { shouldValidate: true });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-[#070b09] bg-gradient-to-br from-[#070b09] via-[#0E5A44]/15 to-[#0b1311] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans antialiased text-slate-100">
        
        {/* Header Branding */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4 shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-[#D4AF37]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Wealth Architect Elite</span>
          </div>
          <h1 className="text-3.5xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-300">Wealth Journey</span>
          </h1>
          <p className="mt-3 text-base text-slate-400 max-w-xl mx-auto">
            Answer a few quick questions to receive a highly personalized wealth overview matched to your profile.
          </p>
        </div>

        {/* Stepper Progress bar */}
        <div className="w-full max-w-2xl mb-8 px-4">
          <div className="flex justify-between items-center relative">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
            {/* Active Highlight Line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-[#D4AF37] -translate-y-1/2 transition-all duration-500 ease-out z-0"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />

            {[1, 2, 3].map((step) => {
              const isActive = currentStep === step;
              const isCompleted = currentStep > step;
              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={async () => {
                      if (step < currentStep) {
                        setCurrentStep(step);
                      } else if (step > currentStep) {
                        // Validate current step before letting them click ahead
                        const isValid = await trigger(
                          currentStep === 1 
                            ? ['name', 'email', 'phone', 'age', 'city']
                            : ['employmentStatus', 'monthlyIncome', 'savings']
                        );
                        if (isValid && (step === currentStep + 1 || (currentStep === 1 && step === 3 && await trigger(['employmentStatus', 'monthlyIncome', 'savings'])))) {
                          setCurrentStep(step);
                        }
                      }
                    }}
                    type="button"
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300",
                      isActive && "bg-[#070b09] border-[#D4AF37] text-[#D4AF37] ring-4 ring-[#D4AF37]/20 scale-110 shadow-lg shadow-emerald-950/50",
                      isCompleted && "bg-emerald-500 border-emerald-500 text-slate-900 shadow-md shadow-emerald-500/20",
                      !isActive && !isCompleted && "bg-[#070b09] border-slate-700 text-slate-500 hover:border-slate-500"
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5 stroke-[3]" /> : step}
                  </button>
                  <span className={cn(
                    "text-xs font-semibold mt-2 transition-colors duration-300",
                    isActive ? "text-[#D4AF37]" : "text-slate-500",
                    isCompleted && "text-emerald-400"
                  )}>
                    {step === 1 ? 'Personal' : step === 2 ? 'Employment' : 'Preferences'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stepper Card container */}
        <Card className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl relative overflow-hidden rounded-2xl">
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <User className="h-5 w-5 text-emerald-400" />
                    Personal Roster
                  </CardTitle>
                  <CardDescription className="text-slate-400 pt-1">
                    Provide basic registration details to create your secure wealth advisory profile.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-5 pt-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-9 bg-[#0b1311]/50 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                        {...register('name')}
                        aria-invalid={errors.name ? "true" : "false"}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="johndoe@example.com"
                          className="pl-9 bg-[#0b1311]/50 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('email')}
                          aria-invalid={errors.email ? "true" : "false"}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="10-digit number"
                          className="pl-9 bg-[#0b1311]/50 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('phone')}
                          aria-invalid={errors.phone ? "true" : "false"}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Age & City grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Age */}
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        Age <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="age"
                          type="number"
                          placeholder="e.g. 25"
                          className="pl-9 bg-[#0b1311]/50 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('age')}
                          aria-invalid={errors.age ? "true" : "false"}
                        />
                      </div>
                      {errors.age && (
                        <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          {errors.age.message}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="city"
                          type="text"
                          placeholder="New York"
                          className="pl-9 bg-[#0b1311]/50 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('city')}
                          aria-invalid={errors.city ? "true" : "false"}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end pt-4 border-t border-slate-800 mt-6">
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-900 font-bold px-6 py-5 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all duration-300"
                  >
                    Continue
                    <ChevronRight className="h-4.5 w-4.5" />
                  </Button>
                </CardFooter>
              </div>
            )}

            {/* Step 2: Employment & Financials */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Landmark className="h-5 w-5 text-[#D4AF37]" />
                    Employment & Financial Health
                  </CardTitle>
                  <CardDescription className="text-slate-400 pt-1">
                    Describe your professional status and financial strength to inform cash reserves allocation.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-2">
                  
                  {/* Employment Status Visual Selection Card Roster */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                      Employment Roster <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {employmentOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = watchedValues.employmentStatus === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setValue('employmentStatus', opt.value, { shouldValidate: true })}
                            className={cn(
                              "flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 hover:-translate-y-0.5",
                              isSelected 
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500" 
                                : "bg-[#0b1311]/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                            )}
                          >
                            <Icon className={cn("h-6 w-6 mb-2 transition-transform duration-300", isSelected ? "scale-110 text-emerald-400" : "text-slate-500")} />
                            <span className="text-xs font-bold">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.employmentStatus && (
                      <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        {errors.employmentStatus.message}
                      </p>
                    )}
                  </div>

                  {/* Monthly Income & Current Savings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Monthly Income */}
                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        Monthly Net Income ($) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="monthlyIncome"
                          type="number"
                          placeholder="e.g. 5000"
                          className="pl-9 bg-[#0b1311]/50 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('monthlyIncome')}
                          aria-invalid={errors.monthlyIncome ? "true" : "false"}
                        />
                      </div>
                      {errors.monthlyIncome && (
                        <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          {errors.monthlyIncome.message}
                        </p>
                      )}
                    </div>

                    {/* Current Savings */}
                    <div className="space-y-2">
                      <Label htmlFor="savings" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                        Total Liquid Savings ($) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <PiggyBank className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="savings"
                          type="number"
                          placeholder="e.g. 20000"
                          className="pl-9 bg-[#0b1311]/50 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
                          {...register('savings')}
                          aria-invalid={errors.savings ? "true" : "false"}
                        />
                      </div>
                      {errors.savings && (
                        <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          {errors.savings.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-4 border-t border-slate-800 mt-6">
                  <Button 
                    type="button" 
                    onClick={handlePrevStep}
                    variant="outline"
                    className="border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white font-bold px-5 py-5 rounded-lg flex items-center gap-2 transition-all duration-300"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-900 font-bold px-6 py-5 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all duration-300"
                  >
                    Continue
                    <ChevronRight className="h-4.5 w-4.5" />
                  </Button>
                </CardFooter>
              </div>
            )}

            {/* Step 3: Investment Strategy & Risk Preferences */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Goal className="h-5 w-5 text-emerald-400" />
                    Investment Preferences & Strategy
                  </CardTitle>
                  <CardDescription className="text-slate-400 pt-1">
                    Select your risk threshold and goals. We track how different profiles explore secure alternatives.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-2">
                  
                  {/* Risk Profile Selection Cards */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                      Risk Profile Tolerance <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {riskOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = watchedValues.riskProfile === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setValue('riskProfile', opt.value, { shouldValidate: true })}
                            className={cn(
                              "flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 hover:-translate-y-0.5",
                              isSelected 
                                ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500 shadow-md shadow-emerald-950/40" 
                                : "bg-[#0b1311]/50 border-slate-800 text-slate-400 hover:border-slate-700"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-2 w-full justify-between">
                              <span className={cn(
                                "text-sm font-extrabold transition-colors duration-300",
                                isSelected ? "text-emerald-400" : "text-slate-300"
                              )}>
                                {opt.label}
                              </span>
                              <Icon className={cn("h-5 w-5", isSelected ? "text-emerald-400" : "text-slate-500")} />
                            </div>
                            <span className="text-xs text-slate-400 leading-relaxed font-medium">
                              {opt.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.riskProfile && (
                      <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        {errors.riskProfile.message}
                      </p>
                    )}
                  </div>

                  {/* Financial Goals Grid */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                      Wealth Goals <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {goalOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = (watchedValues.goals || []).includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleGoal(opt.id)}
                            className={cn(
                              "flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-300 hover:-translate-y-0.5",
                              isSelected 
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500" 
                                : "bg-[#0b1311]/50 border-slate-800 text-slate-400 hover:border-slate-700"
                            )}
                          >
                            <div className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300",
                              isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                            )}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs font-extrabold leading-none mb-1", isSelected ? "text-emerald-300" : "text-slate-300")}>
                                {opt.label}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate leading-tight font-medium">
                                {opt.desc}
                              </p>
                            </div>
                            <div className={cn(
                              "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300",
                              isSelected ? "bg-emerald-500 border-emerald-500 text-slate-900" : "border-slate-800"
                            )}>
                              {isSelected && <Check className="h-3.5 w-3.5 stroke-[3.5]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.goals && (
                      <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        {errors.goals.message}
                      </p>
                    )}
                  </div>

                </CardContent>

                <CardFooter className="flex justify-between pt-4 border-t border-slate-800 mt-6">
                  <Button 
                    type="button" 
                    onClick={handlePrevStep}
                    variant="outline"
                    className="border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white font-bold px-5 py-5 rounded-lg flex items-center gap-2 transition-all duration-300"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-400 hover:from-emerald-500 hover:via-[#c59d2a] hover:to-amber-500 text-slate-950 font-extrabold px-7 py-5 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Constructing...
                      </>
                    ) : (
                      <>
                        Complete Profile
                        <Sparkles className="h-4.5 w-4.5 stroke-[2.5] text-slate-950 animate-pulse" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </div>
            )}

          </form>
        </Card>
      </div>
    </FormProvider>
  );
}
