import { z } from "zod"

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v == null ? null : v))

const optionalDate = z
  .union([z.coerce.date(), z.literal(""), z.null()])
  .optional()
  .nullable()
  .transform((v) => (v === "" || v == null ? null : v))

export const createSoldCaseSchema = z.object({
  propertyTitle: z.string().trim().min(2).max(160),
  location: z.string().trim().max(200).default(""),
  coverUrl: optionalUrl,
  clientName: z.string().trim().min(2).max(120),
  clientRole: z.string().trim().max(120).default(""),
  quote: z.string().trim().min(10).max(2000),
  soldAt: optionalDate,
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
})

export const updateSoldCaseSchema = createSoldCaseSchema.partial()

export const soldCaseSchema = z.object({
  id: z.string(),
  propertyTitle: z.string(),
  location: z.string(),
  coverUrl: z.string().url().nullable(),
  coverStoragePath: z.string().nullable(),
  clientName: z.string(),
  clientRole: z.string(),
  quote: z.string(),
  soldAt: z.coerce.date().nullable(),
  sortOrder: z.number().int(),
  active: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CreateSoldCaseInput = z.infer<typeof createSoldCaseSchema>
export type UpdateSoldCaseInput = z.infer<typeof updateSoldCaseSchema>
export type SoldCase = z.infer<typeof soldCaseSchema>
