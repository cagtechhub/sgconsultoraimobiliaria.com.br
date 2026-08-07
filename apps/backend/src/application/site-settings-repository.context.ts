import { Context } from "effect"
import type { SiteSettingsRepositoryPort } from "./ports/site-settings-repository.port.js"

export class SiteSettingsRepository extends Context.Tag("@gutierres/SiteSettingsRepository")<
  SiteSettingsRepository,
  SiteSettingsRepositoryPort
>() {}
