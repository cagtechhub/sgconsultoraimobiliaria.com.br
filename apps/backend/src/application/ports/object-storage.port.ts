import type { Effect } from "effect"
import type { InfraError } from "../../domain/errors/infra-error.js"

export interface UploadedObject {
  readonly url: string
  readonly storagePath: string
}

export interface UploadObjectInput {
  readonly folder: string
  readonly fileName: string
  readonly contentType: string
  readonly body: Buffer
}

export interface ObjectStoragePort {
  readonly upload: (input: UploadObjectInput) => Effect.Effect<UploadedObject, InfraError, never>
  readonly remove: (storagePath: string) => Effect.Effect<void, InfraError, never>
}
