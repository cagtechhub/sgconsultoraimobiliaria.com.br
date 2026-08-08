import {
  checkHealth,
  createCategory,
  createContact,
  createLead,
  createProperty,
  createSoldCase,
  createTestimonial,
  deleteCategory,
  deleteLead,
  deleteProperty,
  deletePropertyMedia,
  deleteSoldCase,
  deleteTestimonial,
  getCategoryById,
  getLeadById,
  getPropertyById,
  getPropertyBySlug,
  getSiteSettings,
  getSoldCaseById,
  getTestimonialById,
  listCategories,
  listLeads,
  listProperties,
  listSoldCases,
  listTestimonials,
  removeSoldCaseCover,
  reorderPropertyMedia,
  setPropertyCoverMedia,
  updateCategory,
  updateLead,
  updateProperty,
  updateSiteSettings,
  updateSoldCase,
  updateTestimonial,
  uploadPropertyMedia,
  uploadSoldCaseCover,
} from "../../application/index.js"
import {
  contactSchema,
  createContactSchema,
  createLeadSchema,
  createPropertyCategorySchema,
  createPropertySchema,
  createSoldCaseSchema,
  createTestimonialSchema,
  healthResponseSchema,
  leadSchema,
  propertyCategorySchema,
  propertyMediaSchema,
  propertySchema,
  propertyStatusSchema,
  reorderPropertyMediaSchema,
  siteSettingsSchema,
  soldCaseSchema,
  testimonialSchema,
  updateLeadSchema,
  updatePropertyCategorySchema,
  updatePropertySchema,
  updateSiteSettingsSchema,
  updateSoldCaseSchema,
  updateTestimonialSchema,
} from "@gutierres/shared"
import { Cause, Effect, Exit, ManagedRuntime } from "effect"
import express, { type Express, type Request, type Response } from "express"
import multer from "multer"
import type { AppServices } from "../../infrastructure/runtime.js"
import { requireAdmin } from "./require-admin.js"
import { ALLOWED_MEDIA_MIME_TYPES } from "../../domain/media/media-kind.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      ALLOWED_MEDIA_MIME_TYPES.has(file.mimetype) ||
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true)
      return
    }
    cb(new Error("Unsupported file type"))
  },
})

const failureMessage = (exit: Exit.Exit<unknown, unknown>, fallback: string) => {
  if (Exit.isSuccess(exit)) return fallback
  const failures = [...Cause.failures(exit.cause), ...Cause.defects(exit.cause)]
  const first = failures[0]
  if (first instanceof Error) return first.message
  if (typeof first === "string") return first
  return fallback
}

const sendExitError = (
  res: Response,
  exit: Exit.Exit<unknown, unknown>,
  notFoundMessage: string
) => {
  const message = failureMessage(exit, notFoundMessage)
  const isNotFound = message.toLowerCase().includes("not found")
  res.status(isNotFound ? 404 : 500).json({
    error: isNotFound ? "not_found" : "internal_error",
    message,
  })
}

const runEffect = <A, E>(
  runtime: ManagedRuntime.ManagedRuntime<AppServices, never>,
  effect: Effect.Effect<A, E, AppServices>,
  res: Response,
  onSuccess: (value: A) => void,
  notFoundMessage = "Resource not found"
) => {
  void runtime.runPromiseExit(effect).then((exit) => {
    if (Exit.isSuccess(exit)) {
      onSuccess(exit.value)
      return
    }
    sendExitError(res, exit, notFoundMessage)
  })
}

const parseBoolQuery = (value: unknown) => value === "true" || value === "1"

const parseStringQuery = (value: unknown) => {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

const parseStatusQuery = (value: unknown) => {
  const raw = parseStringQuery(value)
  if (!raw) return undefined
  const parsed = propertyStatusSchema.safeParse(raw)
  return parsed.success ? parsed.data : undefined
}

export const createApp = (
  runtime: ManagedRuntime.ManagedRuntime<AppServices, never>
): Express => {
  const app = express()
  app.use(express.json({ limit: "2mb" }))
  app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    if (_req.method === "OPTIONS") {
      res.sendStatus(204)
      return
    }
    next()
  })

  app.get("/", (_req, res) => {
    res.json({
      name: "@gutierres/backend",
      docs: {
        health: "GET /health",
        properties: "GET /properties",
        settings: "GET /settings",
        testimonials: "GET /testimonials",
        soldCases: "GET /sold-cases",
        contacts: "POST /contacts",
        admin: "/admin/*",
      },
    })
  })

  app.get("/health", (_req, res) => {
    void runtime.runPromiseExit(checkHealth).then((exit) => {
      if (Exit.isSuccess(exit)) {
        res.status(200).json(
          healthResponseSchema.parse({
            status: "ok",
            ...exit.value,
          })
        )
        return
      }
      res.status(503).json(
        healthResponseSchema.parse({
          status: "degraded",
          api: "ok",
          database: "error",
        })
      )
    })
  })

  app.post("/contacts", (req, res) => {
    const parsed = createContactSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }

    runEffect(runtime, createContact(parsed.data), res, (contact) => {
      res.status(201).json(contactSchema.parse(contact))
    })
  })

  app.get("/settings", (_req, res) => {
    runEffect(runtime, getSiteSettings, res, (item) => {
      res.json(siteSettingsSchema.parse(item))
    })
  })

  app.get("/testimonials", (_req, res) => {
    runEffect(runtime, listTestimonials({ activeOnly: true }), res, (items) => {
      res.json(items.map((item) => testimonialSchema.parse(item)))
    })
  })

  app.get("/sold-cases", (_req, res) => {
    runEffect(runtime, listSoldCases({ activeOnly: true }), res, (items) => {
      res.json(items.map((item) => soldCaseSchema.parse(item)))
    })
  })

  app.get("/properties", (req, res) => {
    runEffect(
      runtime,
      listProperties({
        publishedOnly: true,
        featured: parseBoolQuery(req.query.featured) || undefined,
        selectedOnHome: parseBoolQuery(req.query.selected) || undefined,
        categorySlug: parseStringQuery(req.query.category),
        status: parseStatusQuery(req.query.status),
      }),
      res,
      (items) => {
        res.json(items.map((item) => propertySchema.parse(item)))
      }
    )
  })

  app.get("/properties/:slug", (req, res) => {
    runEffect(
      runtime,
      getPropertyBySlug(req.params.slug, { publishedOnly: true }),
      res,
      (item) => {
        res.json(propertySchema.parse(item))
      },
      "Property not found"
    )
  })

  app.get("/admin/properties", requireAdmin, (_req, res) => {
    runEffect(runtime, listProperties(), res, (items) => {
      res.json(items.map((item) => propertySchema.parse(item)))
    })
  })

  app.get("/admin/properties/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getPropertyById(req.params.id),
      res,
      (item) => {
        res.json(propertySchema.parse(item))
      },
      "Property not found"
    )
  })

  app.post("/admin/properties", requireAdmin, (req, res) => {
    const parsed = createPropertySchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(runtime, createProperty(parsed.data), res, (item) => {
      res.status(201).json(propertySchema.parse(item))
    })
  })

  app.patch("/admin/properties/:id", requireAdmin, (req, res) => {
    const parsed = updatePropertySchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(
      runtime,
      updateProperty(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(propertySchema.parse(item))
      },
      "Property not found"
    )
  })

  app.delete("/admin/properties/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deleteProperty(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      "Property not found"
    )
  })

  app.post("/admin/properties/:id/media", requireAdmin, (req, res) => {
    const handleUpload = upload.single("file") as unknown as (
      req: Request,
      res: Response,
      cb: (err?: unknown) => void
    ) => void

    handleUpload(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: "upload_error", message: String(err) })
        return
      }
      const file = (
        req as Request & {
          file?: { originalname: string; mimetype: string; buffer: Buffer }
        }
      ).file
      if (!file) {
        res.status(400).json({ error: "validation_error", message: "Arquivo obrigatório (file)" })
        return
      }
      runEffect(
        runtime,
        uploadPropertyMedia(req.params.id, {
          fileName: file.originalname,
          contentType: file.mimetype,
          body: file.buffer,
        }),
        res,
        (media) => {
          res.status(201).json(propertyMediaSchema.parse(media))
        },
        "Property not found"
      )
    })
  })

  app.delete("/admin/properties/:id/media/:mediaId", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deletePropertyMedia(req.params.id, req.params.mediaId),
      res,
      () => {
        res.status(204).send()
      },
      "Media not found"
    )
  })

  app.put("/admin/properties/:id/media/order", requireAdmin, (req, res) => {
    const parsed = reorderPropertyMediaSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(
      runtime,
      reorderPropertyMedia(req.params.id, parsed.data.mediaIds),
      res,
      (items) => {
        res.json(items.map((item) => propertyMediaSchema.parse(item)))
      },
      "Property not found"
    )
  })

  app.post("/admin/properties/:id/media/:mediaId/cover", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      setPropertyCoverMedia(req.params.id, req.params.mediaId),
      res,
      (media) => {
        res.json(propertyMediaSchema.parse(media))
      },
      "Media not found"
    )
  })

  app.get("/categories", (_req, res) => {
    runEffect(runtime, listCategories({ activeOnly: true }), res, (items) => {
      res.json(items.map((item) => propertyCategorySchema.parse(item)))
    })
  })

  app.get("/admin/categories", requireAdmin, (_req, res) => {
    runEffect(runtime, listCategories(), res, (items) => {
      res.json(items.map((item) => propertyCategorySchema.parse(item)))
    })
  })

  app.get("/admin/categories/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getCategoryById(req.params.id),
      res,
      (item) => {
        res.json(propertyCategorySchema.parse(item))
      },
      "Category not found"
    )
  })

  app.post("/admin/categories", requireAdmin, (req, res) => {
    const parsed = createPropertyCategorySchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(runtime, createCategory(parsed.data), res, (item) => {
      res.status(201).json(propertyCategorySchema.parse(item))
    })
  })

  app.patch("/admin/categories/:id", requireAdmin, (req, res) => {
    const parsed = updatePropertyCategorySchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(
      runtime,
      updateCategory(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(propertyCategorySchema.parse(item))
      },
      "Category not found"
    )
  })

  app.delete("/admin/categories/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deleteCategory(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      "Category not found"
    )
  })

  app.get("/admin/leads", requireAdmin, (_req, res) => {
    runEffect(runtime, listLeads, res, (items) => {
      res.json(items.map((item) => leadSchema.parse(item)))
    })
  })

  app.get("/admin/leads/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getLeadById(req.params.id),
      res,
      (item) => {
        res.json(leadSchema.parse(item))
      },
      "Lead not found"
    )
  })

  app.post("/admin/leads", requireAdmin, (req, res) => {
    const parsed = createLeadSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(runtime, createLead(parsed.data), res, (item) => {
      res.status(201).json(leadSchema.parse(item))
    })
  })

  app.patch("/admin/leads/:id", requireAdmin, (req, res) => {
    const parsed = updateLeadSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(
      runtime,
      updateLead(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(leadSchema.parse(item))
      },
      "Lead not found"
    )
  })

  app.delete("/admin/leads/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deleteLead(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      "Lead not found"
    )
  })

  app.get("/admin/settings", requireAdmin, (_req, res) => {
    runEffect(runtime, getSiteSettings, res, (item) => {
      res.json(siteSettingsSchema.parse(item))
    })
  })

  app.put("/admin/settings", requireAdmin, (req, res) => {
    const parsed = updateSiteSettingsSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(runtime, updateSiteSettings(parsed.data), res, (item) => {
      res.json(siteSettingsSchema.parse(item))
    })
  })

  app.get("/admin/testimonials", requireAdmin, (_req, res) => {
    runEffect(runtime, listTestimonials(), res, (items) => {
      res.json(items.map((item) => testimonialSchema.parse(item)))
    })
  })

  app.get("/admin/testimonials/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getTestimonialById(req.params.id),
      res,
      (item) => {
        res.json(testimonialSchema.parse(item))
      },
      "Testimonial not found"
    )
  })

  app.post("/admin/testimonials", requireAdmin, (req, res) => {
    const parsed = createTestimonialSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(runtime, createTestimonial(parsed.data), res, (item) => {
      res.status(201).json(testimonialSchema.parse(item))
    })
  })

  app.patch("/admin/testimonials/:id", requireAdmin, (req, res) => {
    const parsed = updateTestimonialSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(
      runtime,
      updateTestimonial(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(testimonialSchema.parse(item))
      },
      "Testimonial not found"
    )
  })

  app.delete("/admin/testimonials/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deleteTestimonial(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      "Testimonial not found"
    )
  })

  app.get("/admin/sold-cases", requireAdmin, (_req, res) => {
    runEffect(runtime, listSoldCases(), res, (items) => {
      res.json(items.map((item) => soldCaseSchema.parse(item)))
    })
  })

  app.get("/admin/sold-cases/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getSoldCaseById(req.params.id),
      res,
      (item) => {
        res.json(soldCaseSchema.parse(item))
      },
      "Sold case not found"
    )
  })

  app.post("/admin/sold-cases", requireAdmin, (req, res) => {
    const parsed = createSoldCaseSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(runtime, createSoldCase(parsed.data), res, (item) => {
      res.status(201).json(soldCaseSchema.parse(item))
    })
  })

  app.patch("/admin/sold-cases/:id", requireAdmin, (req, res) => {
    const parsed = updateSoldCaseSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: "validation_error",
        issues: parsed.error.flatten().fieldErrors,
      })
      return
    }
    runEffect(
      runtime,
      updateSoldCase(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(soldCaseSchema.parse(item))
      },
      "Sold case not found"
    )
  })

  app.delete("/admin/sold-cases/:id", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deleteSoldCase(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      "Sold case not found"
    )
  })

  app.post("/admin/sold-cases/:id/cover", requireAdmin, (req, res) => {
    const handleUpload = upload.single("file") as unknown as (
      req: Request,
      res: Response,
      cb: (err?: unknown) => void
    ) => void

    handleUpload(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: "upload_error", message: String(err) })
        return
      }
      const file = (
        req as Request & {
          file?: { originalname: string; mimetype: string; buffer: Buffer }
        }
      ).file
      if (!file) {
        res.status(400).json({ error: "validation_error", message: "File is required" })
        return
      }
      runEffect(
        runtime,
        uploadSoldCaseCover(req.params.id, {
          fileName: file.originalname,
          contentType: file.mimetype,
          body: file.buffer,
        }),
        res,
        (item) => {
          res.json(soldCaseSchema.parse(item))
        },
        "Sold case not found"
      )
    })
  })

  app.delete("/admin/sold-cases/:id/cover", requireAdmin, (req, res) => {
    runEffect(
      runtime,
      removeSoldCaseCover(req.params.id),
      res,
      (item) => {
        res.json(soldCaseSchema.parse(item))
      },
      "Sold case not found"
    )
  })

  return app
}
