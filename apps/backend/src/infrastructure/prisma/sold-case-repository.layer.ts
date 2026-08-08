import { SoldCaseRepository } from "../../application/sold-case-repository.context.js"
import { Effect, Layer } from "effect"
import { makePrismaSoldCaseRepository } from "./prisma-sold-case-repository.adapter.js"
import { PrismaService } from "./prisma.service.js"

export const SoldCaseRepositoryFromPrisma = Layer.effect(
  SoldCaseRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaSoldCaseRepository(prisma)
  })
)
