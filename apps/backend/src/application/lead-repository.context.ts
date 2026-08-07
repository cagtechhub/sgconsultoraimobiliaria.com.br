import { Context } from "effect"
import type { LeadRepositoryPort } from "./ports/lead-repository.port.js"

export class LeadRepository extends Context.Tag("@gutierres/LeadRepository")<
  LeadRepository,
  LeadRepositoryPort
>() {}
