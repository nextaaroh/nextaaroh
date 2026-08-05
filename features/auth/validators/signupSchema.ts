import { z } from "zod";

export const signupSchema = z.object({
  full_name: z.string().min(2).max(100),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "सिर्फ letters, numbers, underscore"),
  password: z.string().min(8, "कम से कम 8 characters"),
  mobile_number: z.string().regex(/^[6-9]\d{9}$/, "सही 10-digit मोबाइल नंबर डालें"),
  pin_code: z.string().regex(/^\d{6}$/, "6-digit PIN code"),
  state: z.string().min(2),
  district: z.string().min(2),
  class_segment: z.enum([
    "class_5_8",
    "class_9_10",
    "class_11_12",
    "iti_diploma_polytechnic",
    "graduation_pg",
    "upsc_ssc_railway_banking_defence",
    "neet_jee_cuet",
    "other",
  ]),
  segment_other_text: z.string().max(100).optional(),
  language_code: z.enum(["en", "hi", "hinglish"]),
  dream: z.string().max(200).optional(),
  referral_code: z.string().optional(),
  guardian_mobile_number: z
  .string()
  .regex(/^[6-9]\d{9}$/, "Invalid mobile number")
  .optional()
  .or(z.literal("")), 

});

export type SignupInput = z.infer<typeof signupSchema>;

export const MINOR_SEGMENTS = ["class_5_8", "class_9_10", "class_11_12"];