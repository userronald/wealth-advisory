export type RiskLevel = 'low' | 'medium' | 'high';
export type EmploymentStatus = 'employed' | 'self-employed' | 'business' | 'student' | 'retired' | 'unemployed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  employmentStatus: EmploymentStatus | string;
  monthlyIncome: number;
  savings: number;
  riskProfile: RiskLevel | string;
  goals: string[];
}

export interface Scheme {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  riskLevel: RiskLevel | string;
  lockIn: string;
  liquidity: string;
  sourceUrl: string;
  officialLink: string;
  eligibility: string;
  educationalSummary?: string;
}

export interface LearningContent {
  id: string;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
}

export interface Analytics {
  userId: string;
  pageVisited: string;
  timestamp: string | Date;
}
