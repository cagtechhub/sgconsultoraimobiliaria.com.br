import { z } from "zod"
import { propertyCategorySummarySchema } from "./category.js"

export const propertyStatusSchema = z.enum(["LAUNCH", "UNDER_CONSTRUCTION", "READY"])

export const mediaKindSchema = z.enum(["IMAGE", "VIDEO", "DOCUMENT"])

export const propertyMediaSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  storagePath: z.string(),
  kind: mediaKindSchema,
  mimeType: z.string(),
  fileName: z.string(),
  sortOrder: z.number().int(),
  isCover: z.boolean(),
  createdAt: z.coerce.date(),
})

/** @deprecated use propertyMediaSchema */
export const propertyImageSchema = propertyMediaSchema

export const reorderPropertyMediaSchema = z.object({
  mediaIds: z.array(z.string()).min(1),
})

export const createPropertySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(10000),
  location: z.string().trim().max(200).default(""),
  status: propertyStatusSchema.default("LAUNCH"),
  constructionStartDate: z
    .union([z.coerce.date(), z.literal("")])
    .optional()
    .nullable()
    .transform((v) => (v === "" || v == null ? null : v)),
  constructionEndDate: z
    .union([z.coerce.date(), z.literal("")])
    .optional()
    .nullable()
    .transform((v) => (v === "" || v == null ? null : v)),
  availableUnits: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  categoryId: z.string().optional().nullable(),
})

export const updatePropertySchema = createPropertySchema.partial()

export const propertySchema = createPropertySchema.extend({
  id: z.string(),
  media: z.array(propertyMediaSchema).default([]),
  category: propertyCategorySummarySchema.optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PropertyStatus = z.infer<typeof propertyStatusSchema>
export type MediaKind = z.infer<typeof mediaKindSchema>
export type PropertyMedia = z.infer<typeof propertyMediaSchema>
export type PropertyImage = PropertyMedia
export type ReorderPropertyMediaInput = z.infer<typeof reorderPropertyMediaSchema>
export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
export type Property = z.infer<typeof propertySchema>
