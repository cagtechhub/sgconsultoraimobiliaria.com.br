import type {
  CreatePropertyInput,
  Property,
  PropertyMedia,
  PropertyStatus,
  UpdatePropertyInput,
} from "@gutierres/shared"
import type { Effect } from "effect"
import type { InfraError } from "@/domain/errors/infra-error.js"
import type { MediaKind } from "@/domain/media/media-kind.js"

export interface ListPropertiesOptions {
  readonly publishedOnly?: boolean
  readonly featured?: boolean
  readonly selectedOnHome?: boolean
  readonly categorySlug?: string
  readonly status?: PropertyStatus
}

export interface AddPropertyMediaInput {
  readonly propertyId: string
  readonly url: string
  readonly storagePath: string
  readonly kind: MediaKind
  readonly mimeType: string
  readonly fileName: string
  readonly sortOrder?: number
  readonly isCover?: boolean
}

export interface PropertyRepositoryPort {
  readonly list: (opts?: ListPropertiesOptions) => Effect.Effect<Property[], InfraError, never>
  readonly findById: (id: string) => Effect.Effect<Property | null, InfraError, never>
  readonly findBySlug: (slug: string) => Effect.Effect<Property | null, InfraError, never>
  readonly create: (input: CreatePropertyInput) => Effect.Effect<Property, InfraError, never>
  readonly update: (
    id: string,
    input: UpdatePropertyInput
  ) => Effect.Effect<Property, InfraError, never>
  readonly remove: (id: string) => Effect.Effect<void, InfraError, never>
  readonly addMedia: (
    input: AddPropertyMediaInput
  ) => Effect.Effect<PropertyMedia, InfraError, never>
  readonly removeMedia: (
    propertyId: string,
    mediaId: string
  ) => Effect.Effect<PropertyMedia | null, InfraError, never>
  readonly reorderMedia: (
    propertyId: string,
    mediaIds: string[]
  ) => Effect.Effect<PropertyMedia[], InfraError, never>
  readonly setCoverMedia: (
    propertyId: string,
    mediaId: string
  ) => Effect.Effect<PropertyMedia, InfraError, never>
}
