import { z } from "zod"

export const createPropertyCategorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  description: z.string().trim().max(2000).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
})

export const updatePropertyCategorySchema = createPropertyCategorySchema.partial()

export const propertyCategorySchema = createPropertyCategorySchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const propertyCategorySummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

export type CreatePropertyCategoryInput = z.infer<typeof createPropertyCategorySchema>
export type UpdatePropertyCategoryInput = z.infer<typeof updatePropertyCategorySchema>
export type PropertyCategory = z.infer<typeof propertyCategorySchema>
export type PropertyCategorySummary = z.infer<typeof propertyCategorySummarySchema>
