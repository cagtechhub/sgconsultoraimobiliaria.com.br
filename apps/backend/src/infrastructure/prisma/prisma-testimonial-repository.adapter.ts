import {
  testimonialSchema,
  type CreateTestimonialInput,
  type Testimonial,
  type UpdateTestimonialInput,
} from "@gutierres/shared"
import type { TestimonialRepositoryPort } from "@/application/ports/testimonial-repository.port.js"
import { InfraError } from "@/domain/errors/infra-error.js"
import { Effect } from "effect"
import type { PrismaClient } from "./output/client.js"

const mapTestimonial = (record: {
  id: string
  name: string
  role: string
  quote: string
  rating: number
  sortOrder: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}): Testimonial => testimonialSchema.parse(record)

export const makePrismaTestimonialRepository = (
  prisma: PrismaClient
): TestimonialRepositoryPort => ({
  list: (opts) =>
    Effect.tryPromise({
      try: () =>
        prisma.testimonial.findMany({
          where: opts?.activeOnly ? { active: true } : undefined,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
      catch: (cause) => new InfraError("Failed to list testimonials", cause),
    }).pipe(Effect.map((rows) => rows.map(mapTestimonial))),

  findById: (id) =>
    Effect.tryPromise({
      try: () => prisma.testimonial.findUnique({ where: { id } }),
      catch: (cause) => new InfraError("Failed to find testimonial", cause),
    }).pipe(Effect.map((row) => (row ? mapTestimonial(row) : null))),

  create: (input: CreateTestimonialInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.testimonial.create({
          data: {
            name: input.name,
            role: input.role ?? "",
            quote: input.quote,
            rating: input.rating ?? 5,
            sortOrder: input.sortOrder ?? 0,
            active: input.active ?? true,
          },
        }),
      catch: (cause) => new InfraError("Failed to create testimonial", cause),
    }).pipe(Effect.map(mapTestimonial)),

  update: (id, input: UpdateTestimonialInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.testimonial.update({
          where: { id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.role !== undefined ? { role: input.role } : {}),
            ...(input.quote !== undefined ? { quote: input.quote } : {}),
            ...(input.rating !== undefined ? { rating: input.rating } : {}),
            ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
            ...(input.active !== undefined ? { active: input.active } : {}),
          },
        }),
      catch: (cause) => new InfraError("Failed to update testimonial", cause),
    }).pipe(Effect.map(mapTestimonial)),

  remove: (id) =>
    Effect.tryPromise({
      try: () => prisma.testimonial.delete({ where: { id } }),
      catch: (cause) => new InfraError("Failed to delete testimonial", cause),
    }).pipe(Effect.asVoid),
})
