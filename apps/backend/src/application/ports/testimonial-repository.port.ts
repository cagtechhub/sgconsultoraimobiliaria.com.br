import type {
  CreateTestimonialInput,
  Testimonial,
  UpdateTestimonialInput,
} from "@gutierres/shared"
import type { Effect } from "effect"
import type { InfraError } from "@/domain/errors/infra-error.js"

export interface TestimonialRepositoryPort {
  readonly list: (opts?: { activeOnly?: boolean }) => Effect.Effect<Testimonial[], InfraError, never>
  readonly findById: (id: string) => Effect.Effect<Testimonial | null, InfraError, never>
  readonly create: (input: CreateTestimonialInput) => Effect.Effect<Testimonial, InfraError, never>
  readonly update: (
    id: string,
    input: UpdateTestimonialInput
  ) => Effect.Effect<Testimonial, InfraError, never>
  readonly remove: (id: string) => Effect.Effect<void, InfraError, never>
}
