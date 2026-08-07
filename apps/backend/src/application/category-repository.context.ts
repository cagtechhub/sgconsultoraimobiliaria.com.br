import { Context } from "effect"
import type { CategoryRepositoryPort } from "./ports/category-repository.port.js"

export class CategoryRepository extends Context.Tag("@gutierres/CategoryRepository")<
  CategoryRepository,
  CategoryRepositoryPort
>() {}
