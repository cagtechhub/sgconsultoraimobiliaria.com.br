import {
  soldCaseSchema,
  type CreateSoldCaseInput,
  type SoldCase,
  type UpdateSoldCaseInput,
} from "@gutierres/shared"
import type { SoldCaseRepositoryPort } from "../../application/ports/sold-case-repository.port.js"
import { InfraError } from "../../domain/errors/infra-error.js"
import { Effect } from "effect"
import type { PrismaClient } from "./output/client.js"

const mapSoldCase = (record: {
  id: string
  propertyTitle: string
  location: string
  coverUrl: string | null
  coverStoragePath: string | null
  clientName: string
  clientRole: string
  quote: string
  soldAt: Date | null
  sortOrder: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}): SoldCase => soldCaseSchema.parse(record)

type SoldCaseUpdateData = UpdateSoldCaseInput & {
  coverUrl?: string | null
  coverStoragePath?: string | null
}

export const makePrismaSoldCaseRepository = (prisma: PrismaClient): SoldCaseRepositoryPort => ({
  list: (opts) =>
    Effect.tryPromise({
      try: () =>
        prisma.soldCase.findMany({
          where: opts?.activeOnly ? { active: true } : undefined,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
      catch: (cause) => new InfraError("Failed to list sold cases", cause),
    }).pipe(Effect.map((rows) => rows.map(mapSoldCase))),

  findById: (id) =>
    Effect.tryPromise({
      try: () => prisma.soldCase.findUnique({ where: { id } }),
      catch: (cause) => new InfraError("Failed to find sold case", cause),
    }).pipe(Effect.map((row) => (row ? mapSoldCase(row) : null))),

  create: (input: CreateSoldCaseInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.soldCase.create({
          data: {
            propertyTitle: input.propertyTitle,
            location: input.location ?? "",
            coverUrl: input.coverUrl ?? null,
            clientName: input.clientName,
            clientRole: input.clientRole ?? "",
            quote: input.quote,
            soldAt: input.soldAt ?? null,
            sortOrder: input.sortOrder ?? 0,
            active: input.active ?? true,
          },
        }),
      catch: (cause) => new InfraError("Failed to create sold case", cause),
    }).pipe(Effect.map(mapSoldCase)),

  update: (id, input: SoldCaseUpdateData) =>
    Effect.tryPromise({
      try: () =>
        prisma.soldCase.update({
          where: { id },
          data: {
            ...(input.propertyTitle !== undefined ? { propertyTitle: input.propertyTitle } : {}),
            ...(input.location !== undefined ? { location: input.location } : {}),
            ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl } : {}),
            ...(input.coverStoragePath !== undefined
              ? { coverStoragePath: input.coverStoragePath }
              : {}),
            ...(input.clientName !== undefined ? { clientName: input.clientName } : {}),
            ...(input.clientRole !== undefined ? { clientRole: input.clientRole } : {}),
            ...(input.quote !== undefined ? { quote: input.quote } : {}),
            ...(input.soldAt !== undefined ? { soldAt: input.soldAt } : {}),
            ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
            ...(input.active !== undefined ? { active: input.active } : {}),
          },
        }),
      catch: (cause) => new InfraError("Failed to update sold case", cause),
    }).pipe(Effect.map(mapSoldCase)),

  remove: (id) =>
    Effect.tryPromise({
      try: () => prisma.soldCase.delete({ where: { id } }),
      catch: (cause) => new InfraError("Failed to delete sold case", cause),
    }).pipe(Effect.asVoid),
})
