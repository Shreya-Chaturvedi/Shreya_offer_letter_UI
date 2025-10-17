import { z } from "zod";

// Offer Letter Form Schema
export const offerLetterSchema = z.object({
  candidateName: z.string().min(1, "Candidate name is required"),
  designation: z.string().min(1, "Designation is required"),
  reportingManager: z.string().min(1, "Reporting manager is required"),
  timings: z.string().min(1, "Working hours are required"),
  department: z.string().min(1, "Department is required"),
  probationPeriod: z.string().min(1, "Probation period is required"),
  roleResponsibilities: z.string().min(1, "Core role & responsibilities are required"),
  ctc: z.string().min(1, "Compensation (CTC) is required"),
  salarySheet: z.string().min(1, "Salary sheet is required"),
  dateOfOffer: z.string().min(1, "Date of offer letter is required"),
  studentSignature: z.string().min(1, "Student signature is required"),
  resumeBase64: z.string().min(1, "Resume upload is required"),
  resumeFileName: z.string().optional(),
  resumeFileSize: z.number().optional(),
});

export type OfferLetterData = z.infer<typeof offerLetterSchema>;

// Webhook Payload Schema
export const webhookPayloadSchema = z.object({
  resume_base64: z.string(),
  fields: z.object({
    candidate_name: z.string(),
    designation: z.string(),
    reporting_manager: z.string(),
    timings: z.string(),
    department: z.string(),
    probation_period: z.string(),
    role_responsibilities: z.string(),
    ctc: z.string(),
    salary_sheet: z.string(),
    date_of_offer_letter: z.string(),
    student_signature: z.string(),
  }),
});

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;

// Auth Schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
