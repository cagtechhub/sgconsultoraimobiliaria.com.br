import { CategoryRepository } from "../../application/category-repository.context.js"
import { Effect, Layer } from "effect"
import { makePrismaCategoryRepository } from "./prisma-category-repository.adapter.js"
import { PrismaService } from "./prisma.service.js"

export const CategoryRepositoryFromPrisma = Layer.effect(
  CategoryRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaCategoryRepository(prisma)
  })
)
