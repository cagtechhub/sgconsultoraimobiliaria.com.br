import type { CreatePropertyCategoryInput, UpdatePropertyCategoryInput } from "@gutierres/shared"
import { Effect } from "effect"
import { CategoryRepository } from "../category-repository.context.js"
import { InfraError } from "@/domain/errors/infra-error.js"

export const listCategories = (opts?: { activeOnly?: boolean }) =>
  Effect.gen(function* () {
    const repo = yield* CategoryRepository
    return yield* repo.list(opts)
  })

export const getCategoryById = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* CategoryRepository
    const category = yield* repo.findById(id)
    if (!category) {
      return yield* Effect.fail(new InfraError("Category not found"))
    }
    return category
  })

export const createCategory = (input: CreatePropertyCategoryInput) =>
  Effect.gen(function* () {
    const repo = yield* CategoryRepository
    return yield* repo.create(input)
  })

export const updateCategory = (id: string, input: UpdatePropertyCategoryInput) =>
  Effect.gen(function* () {
    const repo = yield* CategoryRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Category not found"))
    }
    return yield* repo.update(id, input)
  })

export const deleteCategory = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* CategoryRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Category not found"))
    }
    yield* repo.remove(id)
  })
