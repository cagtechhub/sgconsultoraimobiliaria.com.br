import type { UpdateSiteSettingsInput } from "@gutierres/shared"
import { Effect } from "effect"
import { SiteSettingsRepository } from "../site-settings-repository.context.js"

export const getSiteSettings = Effect.gen(function* () {
  const repo = yield* SiteSettingsRepository
  return yield* repo.get()
})

export const updateSiteSettings = (input: UpdateSiteSettingsInput) =>
  Effect.gen(function* () {
    const repo = yield* SiteSettingsRepository
    return yield* repo.update(input)
  })
