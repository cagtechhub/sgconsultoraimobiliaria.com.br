import type {
  ObjectStoragePort,
  UploadObjectInput,
} from "../../application/ports/object-storage.port.js"
import { InfraError } from "../../domain/errors/infra-error.js"
import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import path from "node:path"
import type { SupabaseClient } from "@supabase/supabase-js"

const sanitizeFileName = (fileName: string) =>
  fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()

export const makeSupabaseObjectStorage = (
  client: SupabaseClient,
  bucket: string
): ObjectStoragePort => ({
  upload: (input: UploadObjectInput) =>
    Effect.tryPromise({
      try: async () => {
        const ext = path.extname(input.fileName) || ""
        const base = path.basename(input.fileName, ext)
        const storagePath = `${input.folder}/${randomUUID()}-${sanitizeFileName(base)}${ext}`
        const { error } = await client.storage.from(bucket).upload(storagePath, input.body, {
          contentType: input.contentType,
          upsert: false,
        })
        if (error) throw error
        const { data } = client.storage.from(bucket).getPublicUrl(storagePath)
        return { url: data.publicUrl, storagePath }
      },
      catch: (cause) => new InfraError("Failed to upload object to Supabase Storage", cause),
    }),

  remove: (storagePath) =>
    Effect.tryPromise({
      try: async () => {
        const { error } = await client.storage.from(bucket).remove([storagePath])
        if (error) throw error
      },
      catch: (cause) => new InfraError("Failed to remove object from Supabase Storage", cause),
    }).pipe(Effect.asVoid),
})
