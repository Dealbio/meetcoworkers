import { z } from "zod";

export const roles = ["Founder", "Investor", "Operator", "Consultant", "Designer", "Developer", "Marketer", "Freelancer", "Other"] as const;

export const profileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(60),
  last_name: z.string().trim().min(1, "Last name is required").max(60),
  avatar_url: z.string().url("Add a profile photo"),
  headline: z.string().trim().min(2, "Add your professional headline").max(120),
  company_name: z.string().trim().max(100).optional(),
  working_on: z.string().trim().min(10, "Tell us a little more").max(240),
  role_category: z.enum(roles),
  city_id: z.string().uuid(),
  open_to_meet: z.boolean(),
  linkedin_url: z.union([z.literal(""), z.string().url().regex(/^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//, "Use a LinkedIn URL")]),
  industry_ids: z.array(z.string().uuid()).min(1, "Choose at least one industry").max(3, "Choose up to 3 industries"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
