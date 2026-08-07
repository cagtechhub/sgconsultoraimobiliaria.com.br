import type {
  CreatePropertyCategoryInput,
  PropertyCategory,
  UpdatePropertyCategoryInput,
} from "@gutierres/shared"
import type { Effect } from "effect"
import type { InfraError } from "@/domain/errors/infra-error.js"

export interface CategoryRepositoryPort {
  readonly list: (opts?: { activeOnly?: boolean }) => Effect.Effect<PropertyCategory[], InfraError, never>
  readonly findById: (id: string) => Effect.Effect<PropertyCategory | null, InfraError, never>
  readonly create: (
    input: CreatePropertyCategoryInput
  ) => Effect.Effect<PropertyCategory, InfraError, never>
  readonly update: (
    id: string,
    input: UpdatePropertyCategoryInput
  ) => Effect.Effect<PropertyCategory, InfraError, never>
  readonly remove: (id: string) => Effect.Effect<void, InfraError, never>
}
