import { ObjectStorage } from "../../application/object-storage.context.js"
import type { ObjectStoragePort } from "../../application/ports/object-storage.port.js"
import { InfraError } from "../../domain/errors/infra-error.js"
import { createClient } from "@supabase/supabase-js"
import { Effect, Layer } from "effect"
import { makeSupabaseObjectStorage } from "./supabase-object-storage.adapter.js"

const missingStorage: ObjectStoragePort = {
  upload: () =>
    Effect.fail(
      new InfraError(
        "Supabase Storage não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
      )
    ),
  remove: () =>
    Effect.fail(
      new InfraError(
        "Supabase Storage não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
      )
    ),
}

export const ObjectStorageFromSupabase = Layer.succeed(
  ObjectStorage,
  (() => {
    const url = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "properties"

    if (!url || !serviceRoleKey) {
      return missingStorage
    }

    const client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    return makeSupabaseObjectStorage(client, bucket)
  })()
)
