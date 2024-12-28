import { z } from 'zod';

export const onboardingSchema = z.object({
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters'),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
