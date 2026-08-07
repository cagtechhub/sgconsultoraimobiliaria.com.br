import { TestimonialRepository } from "../../application/testimonial-repository.context.js"
import { Effect, Layer } from "effect"
import { makePrismaTestimonialRepository } from "./prisma-testimonial-repository.adapter.js"
import { PrismaService } from "./prisma.service.js"

export const TestimonialRepositoryFromPrisma = Layer.effect(
  TestimonialRepository,
  Effect.gen(function* () {
    const prisma = yield* PrismaService
    return makePrismaTestimonialRepository(prisma)
  })
)
