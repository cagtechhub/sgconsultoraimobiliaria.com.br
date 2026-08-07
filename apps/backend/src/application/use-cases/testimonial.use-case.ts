import type { CreateTestimonialInput, UpdateTestimonialInput } from "@gutierres/shared"
import { Effect } from "effect"
import { TestimonialRepository } from "../testimonial-repository.context.js"
import { InfraError } from "@/domain/errors/infra-error.js"

export const listTestimonials = (opts?: { activeOnly?: boolean }) =>
  Effect.gen(function* () {
    const repo = yield* TestimonialRepository
    return yield* repo.list(opts)
  })

export const getTestimonialById = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* TestimonialRepository
    const item = yield* repo.findById(id)
    if (!item) {
      return yield* Effect.fail(new InfraError("Testimonial not found"))
    }
    return item
  })

export const createTestimonial = (input: CreateTestimonialInput) =>
  Effect.gen(function* () {
    const repo = yield* TestimonialRepository
    return yield* repo.create(input)
  })

export const updateTestimonial = (id: string, input: UpdateTestimonialInput) =>
  Effect.gen(function* () {
    const repo = yield* TestimonialRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Testimonial not found"))
    }
    return yield* repo.update(id, input)
  })

export const deleteTestimonial = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* TestimonialRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Testimonial not found"))
    }
    yield* repo.remove(id)
  })
