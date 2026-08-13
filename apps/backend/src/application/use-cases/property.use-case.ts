import type { CreatePropertyInput, PropertyStatus, UpdatePropertyInput } from "@gutierres/shared"
import { Effect } from "effect"
import { PropertyRepository } from "../property-repository.context.js"
import { ObjectStorage } from "../object-storage.context.js"
import { InfraError } from "../../domain/errors/infra-error.js"
import { resolveMediaKind } from "../../domain/media/media-kind.js"

export const listProperties = (opts?: {
  publishedOnly?: boolean
  featured?: boolean
  selectedOnHome?: boolean
  categorySlug?: string
  status?: PropertyStatus
}) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    return yield* repo.list(opts)
  })

export const getPropertyById = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const property = yield* repo.findById(id)
    if (!property) {
      return yield* Effect.fail(new InfraError("Property not found"))
    }
    return property
  })

export const getPropertyBySlug = (slug: string, opts?: { publishedOnly?: boolean }) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const property = yield* repo.findBySlug(slug)
    if (!property || (opts?.publishedOnly && !property.published)) {
      return yield* Effect.fail(new InfraError("Property not found"))
    }
    return property
  })

export const createProperty = (input: CreatePropertyInput) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    return yield* repo.create(input)
  })

export const updateProperty = (id: string, input: UpdatePropertyInput) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Property not found"))
    }
    return yield* repo.update(id, input)
  })

export const deleteProperty = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const storage = yield* ObjectStorage
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Property not found"))
    }
    for (const item of existing.media) {
      yield* storage.remove(item.storagePath)
    }
    yield* repo.remove(id)
  })

export const uploadPropertyMedia = (
  propertyId: string,
  file: { fileName: string; contentType: string; body: Buffer }
) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const storage = yield* ObjectStorage
    const existing = yield* repo.findById(propertyId)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Property not found"))
    }

    const kind = resolveMediaKind(file.contentType, file.fileName)
    if (!kind) {
      return yield* Effect.fail(
        new InfraError("Unsupported file type. Allowed: images, videos (mp4/webm), PDF and DOCX.")
      )
    }

    const uploaded = yield* storage.upload({
      folder: `properties/${propertyId}`,
      fileName: file.fileName,
      contentType: file.contentType,
      body: file.body,
    })

    const hasCover = existing.media.some((m) => m.isCover)
    const isCover = kind === "IMAGE" && !hasCover

    return yield* repo.addMedia({
      propertyId,
      url: uploaded.url,
      storagePath: uploaded.storagePath,
      kind,
      mimeType: file.contentType,
      fileName: file.fileName,
      sortOrder: existing.media.length,
      isCover,
    })
  })

export const deletePropertyMedia = (propertyId: string, mediaId: string) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const storage = yield* ObjectStorage
    const removed = yield* repo.removeMedia(propertyId, mediaId)
    if (!removed) {
      return yield* Effect.fail(new InfraError("Media not found"))
    }
    yield* storage.remove(removed.storagePath)
    return removed
  })

export const reorderPropertyMedia = (propertyId: string, mediaIds: string[]) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const existing = yield* repo.findById(propertyId)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Property not found"))
    }
    return yield* repo.reorderMedia(propertyId, mediaIds)
  })

export const setPropertyCoverMedia = (propertyId: string, mediaId: string) =>
  Effect.gen(function* () {
    const repo = yield* PropertyRepository
    const existing = yield* repo.findById(propertyId)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Property not found"))
    }
    return yield* repo.setCoverMedia(propertyId, mediaId)
  })
