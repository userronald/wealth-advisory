// src/lib/schemeService.ts

/**
 * Service for "myScheme" API (placeholder).
 * In the future this will call the real external endpoint.
 * Currently returns mock scheme data.
 */
export interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  risk: string;
  lockIn?: string;
  liquidity?: string;
  returnPotential?: string;
}

/**
 * Mock data representing a few financial schemes.
 */
const mockSchemes: Scheme[] = [
  {
    id: 'FD',
    title: 'Fixed Deposit (FD)',
    description: 'Secure, low‑risk deposit with fixed interest.',
    category: 'Savings',
    risk: 'Low',
    lockIn: '6‑12 months',
    liquidity: 'Low – early withdrawal penalty',
    returnPotential: '3‑5% p.a.'
  },
  {
    id: 'SIP',
    title: 'Systematic Investment Plan (SIP)',
    description: 'Regular mutual‑fund investments via dollar‑cost averaging.',
    category: 'Investments',
    risk: 'Medium',
    lockIn: 'No lock‑in, can stop anytime',
    liquidity: 'High – withdraw after NAV is calculated',
    returnPotential: '7‑12% p.a. (historical)'
  },
  {
    id: 'Gold',
    title: 'Gold Savings (SGB)',
    description: 'Sovereign Gold Bonds backed by RBI.',
    category: 'Traditional',
    risk: 'Low‑Medium',
    lockIn: '8‑year tenure',
    liquidity: 'Limited – sell on secondary market',
    returnPotential: 'Fixed 2.5% + market price'
  }
];

/**
 * Simulated async fetch for schemes.
 */
export async function fetchSchemes(): Promise<Scheme[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockSchemes;
}

/**
 * Get a single scheme by its ID.
 */
export async function getSchemeById(id: string): Promise<Scheme | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockSchemes.find((s) => s.id === id);
}

// End of src/lib/schemeService.ts
