import { Context } from "effect"
import type { PropertyRepositoryPort } from "./ports/property-repository.port.js"

export class PropertyRepository extends Context.Tag("@gutierres/PropertyRepository")<
  PropertyRepository,
  PropertyRepositoryPort
>() {}
