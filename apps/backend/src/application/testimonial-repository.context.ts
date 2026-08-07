import { Context } from "effect"
import type { TestimonialRepositoryPort } from "./ports/testimonial-repository.port.js"

export class TestimonialRepository extends Context.Tag("@gutierres/TestimonialRepository")<
  TestimonialRepository,
  TestimonialRepositoryPort
>() {}
