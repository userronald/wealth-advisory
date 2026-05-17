// src/lib/governmentSchemeService.ts

/**
 * Service for fetching government scheme data (e.g., Data.gov.in).
 * Currently returns mock data; later will integrate real API calls.
 */
export interface GovernmentScheme {
  id: string;
  title: string;
  description: string;
  department: string;
  eligibility: string;
  benefitAmount?: string;
}

const mockGovSchemes: GovernmentScheme[] = [
  {
    id: 'PMJJBY',
    title: 'Pradhan Mantri Jan Dhan Yojana',
    description: 'Financial inclusion scheme for bank account opening.',
    department: 'Ministry of Finance',
    eligibility: 'All Indian residents (18+)',
    benefitAmount: 'Subsidised debit card & zero‑balance account'
  },
  {
    id: 'PMKVY',
    title: 'Pradhan Mantri Kaushal Vikas Yojana',
    description: 'Skill development and training for youth.',
    department: 'Ministry of Skill Development',
    eligibility: 'Unemployed youth (18‑35)'
  },
  {
    id: 'PMAY',
    title: 'Pradhan Mantri Awas Yojana',
    description: 'Affordable housing for low‑income families.',
    department: 'Ministry of Housing & Urban Affairs',
    eligibility: 'Families with annual income < ₹6 Lakhs',
    benefitAmount: 'Interest subsidy up to 6.5%'
  }
];

/**
 * Simulated async fetch for government schemes.
 */
export async function fetchGovernmentSchemes(): Promise<GovernmentScheme[]> {
  await new Promise((resolve) => setTimeout(resolve, 250)); // simulate latency
  return mockGovSchemes;
}

/**
 * Get a single government scheme by ID.
 */
export async function getGovernmentSchemeById(id: string): Promise<GovernmentScheme | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockGovSchemes.find((s) => s.id === id);
}

// End of src/lib/governmentSchemeService.ts
