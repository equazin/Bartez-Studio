import { z } from "zod";

export const reportRangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const REPORT_GROUPINGS = ["day", "week", "month"] as const;
export type ReportGrouping = (typeof REPORT_GROUPINGS)[number];

export const salesReportSchema = reportRangeSchema.extend({
  groupBy: z.enum(REPORT_GROUPINGS).default("month"),
  accountId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
});
