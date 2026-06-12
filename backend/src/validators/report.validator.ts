import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal("").transform(() => undefined));
const optionalEmail = z.string().email().optional().or(z.literal("").transform(() => undefined));

export const createReportSchema = z.object({
  body: z.object({
    companyName: z.string().trim().min(2).max(160),
    internshipTitle: z.string().trim().min(2).max(180),
    description: z.string().trim().min(20).max(10000),
    scamType: z.string().trim().max(120).optional(),
    feeAmount: z.coerce.number().nonnegative().optional(),
    currency: z.string().trim().length(3).default("USD"),
    contactEmail: optionalEmail,
    contactPhone: z.string().trim().max(40).optional(),
    websiteUrl: optionalUrl,
    reporterName: z.string().trim().max(120).optional(),
    reporterEmail: optionalEmail,
    location: z.string().trim().max(160).optional()
  })
});

export const searchReportsSchema = z.object({
  query: z.object({
    companyName: z.string().trim().optional(),
    q: z.string().trim().optional(),
    minFee: z.coerce.number().nonnegative().optional(),
    maxFee: z.coerce.number().nonnegative().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
  })
});

export const reportIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
