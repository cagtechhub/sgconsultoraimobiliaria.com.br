import {
  propertyCategorySchema,
  type CreatePropertyCategoryInput,
  type PropertyCategory,
  type UpdatePropertyCategoryInput,
} from "@gutierres/shared"
import type { CategoryRepositoryPort } from "@/application/ports/category-repository.port.js"
import { InfraError } from "@/domain/errors/infra-error.js"
import { Effect } from "effect"
import type { PrismaClient } from "./output/client.js"

type CategoryRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const mapCategory = (record: CategoryRecord): PropertyCategory =>
  propertyCategorySchema.parse({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    sortOrder: record.sortOrder,
    active: record.active,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  })

export const makePrismaCategoryRepository = (prisma: PrismaClient): CategoryRepositoryPort => ({
  list: (opts) =>
    Effect.tryPromise({
      try: () =>
        prisma.propertyCategory.findMany({
          where: opts?.activeOnly ? { active: true } : undefined,
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        }),
      catch: (cause) => new InfraError("Failed to list categories", cause),
    }).pipe(Effect.map((rows) => rows.map(mapCategory))),

  findById: (id) =>
    Effect.tryPromise({
      try: () => prisma.propertyCategory.findUnique({ where: { id } }),
      catch: (cause) => new InfraError("Failed to find category", cause),
    }).pipe(Effect.map((row) => (row ? mapCategory(row) : null))),

  create: (input: CreatePropertyCategoryInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.propertyCategory.create({
          data: {
            name: input.name,
            slug: input.slug,
            description: input.description ?? null,
            sortOrder: input.sortOrder ?? 0,
            active: input.active ?? true,
          },
        }),
      catch: (cause) => new InfraError("Failed to create category", cause),
    }).pipe(Effect.map(mapCategory)),

  update: (id, input: UpdatePropertyCategoryInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.propertyCategory.update({
          where: { id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.slug !== undefined ? { slug: input.slug } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
            ...(input.active !== undefined ? { active: input.active } : {}),
          },
        }),
      catch: (cause) => new InfraError("Failed to update category", cause),
    }).pipe(Effect.map(mapCategory)),

  remove: (id) =>
    Effect.tryPromise({
      try: () => prisma.propertyCategory.delete({ where: { id } }),
      catch: (cause) => new InfraError("Failed to delete category", cause),
    }).pipe(Effect.asVoid),
})
