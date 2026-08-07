import { Context } from "effect"
import type { DatabaseHealthPort } from "./ports/database-health.port.js"

export class DatabaseHealth extends Context.Tag("@gutierres/DatabaseHealth")<
  DatabaseHealth,
  DatabaseHealthPort
>() {}
