import {
  propertyMediaSchema,
  propertySchema,
  type CreatePropertyInput,
  type Property,
  type PropertyMedia,
  type UpdatePropertyInput,
} from "@gutierres/shared"
import type {
  AddPropertyMediaInput,
  ListPropertiesOptions,
  PropertyRepositoryPort,
} from "../../application/ports/property-repository.port.js"
import { InfraError } from "../../domain/errors/infra-error.js"
import { Effect } from "effect"
import type { PrismaClient } from "./output/client.js"

type MediaRecord = {
  id: string
  url: string
  storagePath: string
  kind: "IMAGE" | "VIDEO" | "DOCUMENT"
  mimeType: string
  fileName: string
  sortOrder: number
  isCover: boolean
  createdAt: Date
}

type PropertyRecord = {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  location: string
  status: "LAUNCH" | "UNDER_CONSTRUCTION" | "READY"
  constructionStartDate: Date | null
  constructionEndDate: Date | null
  availableUnits: number
  progress: number
  highlights: unknown
  floorPlanUrl: string | null
  featured: boolean
  selectedOnHome: boolean
  published: boolean
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
  category: { id: string; name: string; slug: string } | null
  media: MediaRecord[]
}

const parseHighlights = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

const mapMedia = (media: MediaRecord): PropertyMedia =>
  propertyMediaSchema.parse({
    id: media.id,
    url: media.url,
    storagePath: media.storagePath,
    kind: media.kind,
    mimeType: media.mimeType,
    fileName: media.fileName,
    sortOrder: media.sortOrder,
    isCover: media.isCover,
    createdAt: media.createdAt,
  })

const mapProperty = (record: PropertyRecord): Property =>
  propertySchema.parse({
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    longDescription: record.longDescription,
    location: record.location,
    status: record.status,
    constructionStartDate: record.constructionStartDate,
    constructionEndDate: record.constructionEndDate,
    availableUnits: record.availableUnits,
    progress: record.progress,
    highlights: parseHighlights(record.highlights),
    floorPlanUrl: record.floorPlanUrl,
    featured: record.featured,
    selectedOnHome: record.selectedOnHome,
    published: record.published,
    categoryId: record.categoryId,
    category: record.category,
    media: record.media.map(mapMedia),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  })

const includeRelations = {
  media: { orderBy: { sortOrder: "asc" as const } },
  category: { select: { id: true, name: true, slug: true } },
}

export const makePrismaPropertyRepository = (prisma: PrismaClient): PropertyRepositoryPort => ({
  list: (opts?: ListPropertiesOptions) =>
    Effect.tryPromise({
      try: () =>
        prisma.property.findMany({
          where: {
            ...(opts?.publishedOnly ? { published: true } : {}),
            ...(opts?.featured ? { featured: true } : {}),
            ...(opts?.selectedOnHome ? { selectedOnHome: true } : {}),
            ...(opts?.status ? { status: opts.status } : {}),
            ...(opts?.categorySlug
              ? { category: { slug: opts.categorySlug, active: true } }
              : {}),
          },
          include: includeRelations,
          orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        }),
      catch: (cause) => new InfraError("Failed to list properties", cause),
    }).pipe(Effect.map((rows) => rows.map(mapProperty))),

  findById: (id) =>
    Effect.tryPromise({
      try: () => prisma.property.findUnique({ where: { id }, include: includeRelations }),
      catch: (cause) => new InfraError("Failed to find property", cause),
    }).pipe(Effect.map((row) => (row ? mapProperty(row) : null))),

  findBySlug: (slug) =>
    Effect.tryPromise({
      try: () => prisma.property.findUnique({ where: { slug }, include: includeRelations }),
      catch: (cause) => new InfraError("Failed to find property by slug", cause),
    }).pipe(Effect.map((row) => (row ? mapProperty(row) : null))),

  create: (input: CreatePropertyInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.property.create({
          data: {
            slug: input.slug,
            title: input.title,
            description: input.description,
            longDescription: input.longDescription ?? "",
            location: input.location ?? "",
            status: input.status,
            constructionStartDate: input.constructionStartDate ?? null,
            constructionEndDate: input.constructionEndDate ?? null,
            availableUnits: input.availableUnits ?? 0,
            progress: input.progress ?? 0,
            highlights: input.highlights ?? [],
            floorPlanUrl: input.floorPlanUrl ?? null,
            featured: input.featured ?? false,
            selectedOnHome: input.selectedOnHome ?? false,
            published: input.published ?? true,
            categoryId: input.categoryId ?? null,
          },
          include: includeRelations,
        }),
      catch: (cause) => new InfraError("Failed to create property", cause),
    }).pipe(Effect.map(mapProperty)),

  update: (id, input: UpdatePropertyInput) =>
    Effect.tryPromise({
      try: () =>
        prisma.property.update({
          where: { id },
          data: {
            ...(input.slug !== undefined ? { slug: input.slug } : {}),
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.longDescription !== undefined
              ? { longDescription: input.longDescription }
              : {}),
            ...(input.location !== undefined ? { location: input.location } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
            ...(input.constructionStartDate !== undefined
              ? { constructionStartDate: input.constructionStartDate }
              : {}),
            ...(input.constructionEndDate !== undefined
              ? { constructionEndDate: input.constructionEndDate }
              : {}),
            ...(input.availableUnits !== undefined
              ? { availableUnits: input.availableUnits }
              : {}),
            ...(input.progress !== undefined ? { progress: input.progress } : {}),
            ...(input.highlights !== undefined ? { highlights: input.highlights } : {}),
            ...(input.floorPlanUrl !== undefined ? { floorPlanUrl: input.floorPlanUrl } : {}),
            ...(input.featured !== undefined ? { featured: input.featured } : {}),
            ...(input.selectedOnHome !== undefined
              ? { selectedOnHome: input.selectedOnHome }
              : {}),
            ...(input.published !== undefined ? { published: input.published } : {}),
            ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
          },
          include: includeRelations,
        }),
      catch: (cause) => new InfraError("Failed to update property", cause),
    }).pipe(Effect.map(mapProperty)),

  remove: (id) =>
    Effect.tryPromise({
      try: () => prisma.property.delete({ where: { id } }),
      catch: (cause) => new InfraError("Failed to delete property", cause),
    }).pipe(Effect.asVoid),

  addMedia: (input: AddPropertyMediaInput) =>
    Effect.tryPromise({
      try: async () => {
        if (input.isCover) {
          await prisma.propertyMedia.updateMany({
            where: { propertyId: input.propertyId, isCover: true },
            data: { isCover: false },
          })
        }
        return prisma.propertyMedia.create({
          data: {
            propertyId: input.propertyId,
            url: input.url,
            storagePath: input.storagePath,
            kind: input.kind,
            mimeType: input.mimeType,
            fileName: input.fileName,
            sortOrder: input.sortOrder ?? 0,
            isCover: input.isCover ?? false,
          },
        })
      },
      catch: (cause) => new InfraError("Failed to add property media", cause),
    }).pipe(Effect.map(mapMedia)),

  removeMedia: (propertyId, mediaId) =>
    Effect.tryPromise({
      try: async () => {
        const media = await prisma.propertyMedia.findFirst({
          where: { id: mediaId, propertyId },
        })
        if (!media) return null
        await prisma.propertyMedia.delete({ where: { id: mediaId } })
        return media
      },
      catch: (cause) => new InfraError("Failed to remove property media", cause),
    }).pipe(Effect.map((row) => (row ? mapMedia(row) : null))),

  reorderMedia: (propertyId, mediaIds) =>
    Effect.tryPromise({
      try: async () => {
        const existing = await prisma.propertyMedia.findMany({ where: { propertyId } })
        const existingIds = new Set(existing.map((m) => m.id))
        if (mediaIds.length !== existing.length || mediaIds.some((id) => !existingIds.has(id))) {
          throw new Error("Invalid media order payload")
        }
        await prisma.$transaction(
          mediaIds.map((id, index) =>
            prisma.propertyMedia.update({
              where: { id },
              data: { sortOrder: index },
            })
          )
        )
        return prisma.propertyMedia.findMany({
          where: { propertyId },
          orderBy: { sortOrder: "asc" },
        })
      },
      catch: (cause) => new InfraError("Failed to reorder property media", cause),
    }).pipe(Effect.map((rows) => rows.map(mapMedia))),

  setCoverMedia: (propertyId, mediaId) =>
    Effect.tryPromise({
      try: async () => {
        const media = await prisma.propertyMedia.findFirst({
          where: { id: mediaId, propertyId },
        })
        if (!media) throw new Error("Media not found")
        if (media.kind !== "IMAGE") throw new Error("Only images can be set as cover")
        await prisma.$transaction([
          prisma.propertyMedia.updateMany({
            where: { propertyId, isCover: true },
            data: { isCover: false },
          }),
          prisma.propertyMedia.update({
            where: { id: mediaId },
            data: { isCover: true },
          }),
        ])
        return prisma.propertyMedia.findUniqueOrThrow({ where: { id: mediaId } })
      },
      catch: (cause) =>
        new InfraError(cause instanceof Error ? cause.message : "Failed to set cover media", cause),
    }).pipe(Effect.map(mapMedia)),
})
