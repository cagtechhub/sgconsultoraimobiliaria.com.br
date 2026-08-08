import { Context } from "effect"
import type { SoldCaseRepositoryPort } from "./ports/sold-case-repository.port.js"

export class SoldCaseRepository extends Context.Tag("@gutierres/SoldCaseRepository")<
  SoldCaseRepository,
  SoldCaseRepositoryPort
>() {}
