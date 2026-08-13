import type { CreateSoldCaseInput, UpdateSoldCaseInput } from "@gutierres/shared"
import { Effect } from "effect"
import { ObjectStorage } from "../object-storage.context.js"
import { SoldCaseRepository } from "../sold-case-repository.context.js"
import { InfraError } from "../../domain/errors/infra-error.js"

export const listSoldCases = (opts?: { activeOnly?: boolean }) =>
  Effect.gen(function* () {
    const repo = yield* SoldCaseRepository
    return yield* repo.list(opts)
  })

export const getSoldCaseById = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* SoldCaseRepository
    const item = yield* repo.findById(id)
    if (!item) {
      return yield* Effect.fail(new InfraError("Sold case not found"))
    }
    return item
  })

export const createSoldCase = (input: CreateSoldCaseInput) =>
  Effect.gen(function* () {
    const repo = yield* SoldCaseRepository
    return yield* repo.create(input)
  })

export const updateSoldCase = (id: string, input: UpdateSoldCaseInput) =>
  Effect.gen(function* () {
    const repo = yield* SoldCaseRepository
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Sold case not found"))
    }
    return yield* repo.update(id, input)
  })

export const deleteSoldCase = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* SoldCaseRepository
    const storage = yield* ObjectStorage
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Sold case not found"))
    }
    if (existing.coverStoragePath) {
      yield* storage.remove(existing.coverStoragePath)
    }
    yield* repo.remove(id)
  })

export const uploadSoldCaseCover = (
  id: string,
  file: { fileName: string; contentType: string; body: Buffer }
) =>
  Effect.gen(function* () {
    const repo = yield* SoldCaseRepository
    const storage = yield* ObjectStorage
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Sold case not found"))
    }

    if (!file.contentType.startsWith("image/")) {
      return yield* Effect.fail(new InfraError("Cover must be an image file"))
    }

    const uploaded = yield* storage.upload({
      folder: `sold-cases/${id}`,
      fileName: file.fileName,
      contentType: file.contentType,
      body: file.body,
    })

    if (existing.coverStoragePath) {
      yield* storage.remove(existing.coverStoragePath)
    }

    return yield* repo.update(id, {
      coverUrl: uploaded.url,
      coverStoragePath: uploaded.storagePath,
    })
  })

export const removeSoldCaseCover = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* SoldCaseRepository
    const storage = yield* ObjectStorage
    const existing = yield* repo.findById(id)
    if (!existing) {
      return yield* Effect.fail(new InfraError("Sold case not found"))
    }
    if (existing.coverStoragePath) {
      yield* storage.remove(existing.coverStoragePath)
    }
    return yield* repo.update(id, {
      coverUrl: null,
      coverStoragePath: null,
    })
  })
