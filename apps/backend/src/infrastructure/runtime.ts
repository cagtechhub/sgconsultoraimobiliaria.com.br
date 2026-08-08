import { Layer } from "effect"
import { CategoryRepository } from "../application/category-repository.context.js"
import { ContactRepository } from "../application/contact-repository.context.js"
import { DatabaseHealth } from "../application/database-health.context.js"
import { LeadRepository } from "../application/lead-repository.context.js"
import { ObjectStorage } from "../application/object-storage.context.js"
import { PropertyRepository } from "../application/property-repository.context.js"
import { SiteSettingsRepository } from "../application/site-settings-repository.context.js"
import { SoldCaseRepository } from "../application/sold-case-repository.context.js"
import { CategoryRepositoryFromPrisma } from "./prisma/category-repository.layer.js"
import { ContactRepositoryFromPrisma } from "./prisma/contact-repository.layer.js"
import { DatabaseHealthFromPrisma } from "./prisma/database-health.layer.js"
import { LeadRepositoryFromPrisma } from "./prisma/lead-repository.layer.js"
import { PropertyRepositoryFromPrisma } from "./prisma/property-repository.layer.js"
import { SiteSettingsRepositoryFromPrisma } from "./prisma/site-settings-repository.layer.js"
import { SoldCaseRepositoryFromPrisma } from "./prisma/sold-case-repository.layer.js"
import { PrismaLayer } from "./prisma/prisma.service.js"
import { ObjectStorageFromSupabase } from "./supabase/object-storage.layer.js"

export type AppServices =
  | DatabaseHealth
  | ContactRepository
  | PropertyRepository
  | CategoryRepository
  | LeadRepository
  | ObjectStorage
  | SiteSettingsRepository
  | SoldCaseRepository

export const AppRuntimeLayer: Layer.Layer<AppServices, never, never> = Layer.mergeAll(
  DatabaseHealthFromPrisma,
  ContactRepositoryFromPrisma,
  PropertyRepositoryFromPrisma,
  CategoryRepositoryFromPrisma,
  LeadRepositoryFromPrisma,
  ObjectStorageFromSupabase,
  SiteSettingsRepositoryFromPrisma,
  SoldCaseRepositoryFromPrisma
).pipe(Layer.provide(PrismaLayer))
