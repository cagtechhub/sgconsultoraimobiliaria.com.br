import { PropertyRepository } from "../../application/property-repository.context.js"
import { Effect, Layer } from "effect"
import { makePrismaPropertyRepository } from "./prisma-property-repository.adapter.js"
import { PrismaService } from "./prisma.service.js"

export const PropertyRepositoryFromPrisma = Layer.effect(
  PropertyRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaPropertyRepository(prisma)
  })
)
