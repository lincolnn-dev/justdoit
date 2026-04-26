import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(2, "Use at least 2 characters").max(80, "Use at most 80 characters"),
  description: z.string().max(240, "Use at most 240 characters").optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

