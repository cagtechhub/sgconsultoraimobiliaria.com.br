import { z } from "zod"

export const createTestimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).default(""),
  quote: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

export const testimonialSchema = createTestimonialSchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
export type Testimonial = z.infer<typeof testimonialSchema>
