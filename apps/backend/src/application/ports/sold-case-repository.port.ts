import type { CreateSoldCaseInput, SoldCase, UpdateSoldCaseInput } from "@gutierres/shared"
import type { Effect } from "effect"
import type { InfraError } from "@/domain/errors/infra-error.js"

export interface SoldCaseRepositoryPort {
  readonly list: (opts?: { activeOnly?: boolean }) => Effect.Effect<SoldCase[], InfraError, never>
  readonly findById: (id: string) => Effect.Effect<SoldCase | null, InfraError, never>
  readonly create: (input: CreateSoldCaseInput) => Effect.Effect<SoldCase, InfraError, never>
  readonly update: (
    id: string,
    input: UpdateSoldCaseInput & {
      coverUrl?: string | null
      coverStoragePath?: string | null
    }
  ) => Effect.Effect<SoldCase, InfraError, never>
  readonly remove: (id: string) => Effect.Effect<void, InfraError, never>
}
