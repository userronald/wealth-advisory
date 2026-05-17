import { z } from 'zod';

export const onboardingSchema = z.object({
  name: z.string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Full name must not exceed 100 characters.' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Full name should only contain letters and spaces.' }),
  
  email: z.string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  
  phone: z.string()
    .min(1, { message: 'Phone number is required.' })
    .regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits.' }),
  
  age: z.coerce.number()
    .int({ message: 'Age must be a whole number.' })
    .min(18, { message: 'You must be at least 18 years old to join.' })
    .max(120, { message: 'Please enter a valid age.' }),
  
  city: z.string()
    .min(1, { message: 'City is required.' })
    .max(100, { message: 'City name is too long.' }),
  
  employmentStatus: z.enum(['employed', 'self-employed', 'business', 'student', 'unemployed'], {
    errorMap: () => ({ message: 'Please select an employment status.' }),
  }),
  
  monthlyIncome: z.coerce.number()
    .min(0, { message: 'Monthly income must be 0 or greater.' }),
  
  savings: z.coerce.number()
    .min(0, { message: 'Current savings must be 0 or greater.' }),
  
  riskProfile: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a risk profile.' }),
  }),
  
  goals: z.array(z.string())
    .min(1, { message: 'Please select at least one financial goal.' }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
