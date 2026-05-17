import { create } from 'zustand';
import type { Scheme } from '@/types';

interface SchemeState {
  schemes: Scheme[];
  filteredSchemes: Scheme[];
  loadSchemes: (schemes: Scheme[]) => void;
  filterByAge: (age: number) => void;
  filterByIncome: (income: number) => void;
  filterByGoals: (goals: string[]) => void;
  filterByRisk: (risk: string) => void;
}

export const useSchemeStore = create<SchemeState>((set, get) => ({
  schemes: [],
  filteredSchemes: [],
  
  loadSchemes: (schemes) => {
    set({ schemes, filteredSchemes: schemes });
  },
  
  filterByAge: (age) => {
    const { schemes } = get();
    // Placeholder logic for age filtering since 'Scheme' type uses 'eligibility' string
    // This can be expanded with real parsing logic later
    set({ filteredSchemes: schemes });
  },
  
  filterByIncome: (income) => {
    const { schemes } = get();
    // Placeholder logic for income filtering
    set({ filteredSchemes: schemes });
  },
  
  filterByGoals: (goals) => {
    const { schemes } = get();
    // Filter schemes that match at least one of the goals in their category/subcategory/description
    if (!goals || goals.length === 0) {
      set({ filteredSchemes: schemes });
      return;
    }
    
    const filtered = schemes.filter(scheme => 
      goals.some(goal => 
        scheme.category.toLowerCase().includes(goal.toLowerCase()) ||
        scheme.subcategory.toLowerCase().includes(goal.toLowerCase()) ||
        scheme.description.toLowerCase().includes(goal.toLowerCase())
      )
    );
    set({ filteredSchemes: filtered });
  },
  
  filterByRisk: (risk) => {
    const { schemes } = get();
    if (!risk) {
      set({ filteredSchemes: schemes });
      return;
    }
    const filtered = schemes.filter(scheme => 
      scheme.riskLevel.toLowerCase() === risk.toLowerCase()
    );
    set({ filteredSchemes: filtered });
  },
}));
