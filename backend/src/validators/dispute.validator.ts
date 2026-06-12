import { z } from "zod";

export const createDisputeSchema = z.object({
  params: z.object({
    reportId: z.string().uuid()
  }),
  body: z.object({
    submitterName: z.string().trim().min(2).max(120),
    submitterEmail: z.string().trim().email(),
    reason: z.string().trim().min(20).max(5000)
  })
});
