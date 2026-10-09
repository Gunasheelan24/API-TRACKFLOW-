import { z } from 'zod';

// Here this one is for how the response object i get from openai
export const SuggestionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Here i am validation the response before sending to the UI
export const ValidatedSuggestionSchema = z.object({
  title: z.string().trim().min(10).max(30),
  description: z.string().trim().min(25).max(60),
});

export type TaskSuggestionResponse = z.infer<typeof ValidatedSuggestionSchema>;
