import {
  createLeadSchema,
  createPropertyCategorySchema,
  createPropertySchema,
  createTestimonialSchema,
  leadChannelSchema,
  leadSchema,
  leadStatusSchema,
  propertySchema,
  propertyStatusSchema,
  updateLeadSchema,
  updatePropertyCategorySchema,
  updatePropertySchema,
  updateSiteSettingsSchema,
  updateTestimonialSchema,
  type CreateLeadInput,
  type CreatePropertyCategoryInput,
  type CreatePropertyInput,
  type CreateTestimonialInput,
  type Lead,
  type Property,
  type PropertyCategory,
  type SiteSettings,
  type Testimonial,
  type UpdateLeadInput,
  type UpdatePropertyCategoryInput,
  type UpdatePropertyInput,
  type UpdateSiteSettingsInput,
  type UpdateTestimonialInput,
} from '@gutierres/shared'

export const useAdminApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('admin_token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })

  const baseUrl = computed(() => String(config.public.apiUrl || 'http://localhost:3001').replace(/\/$/, ''))

  const ensureAccessToken = async (): Promise<string | null> => {
    if (import.meta.client) {
      try {
        const supabase = useSupabaseClient()
        const { data } = await supabase.auth.getSession()
        token.value = data.session?.access_token ?? null
      } catch {
        // keep cookie value
      }
    }
    return token.value
  }

  const authHeaders = async (): Promise<HeadersInit> => {
    const accessToken = await ensureAccessToken()
    if (!accessToken) return {}
    return { Authorization: `Bearer ${accessToken}` }
  }

  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const headers = new Headers(init.headers)
    if (!(init.body instanceof FormData) && !headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json')
    }
    for (const [key, value] of Object.entries(await authHeaders())) {
      headers.set(key, value)
    }

    const response = await fetch(`${baseUrl.value}${path}`, {
      ...init,
      headers,
    })

    if (response.status === 204) {
      return undefined as T
    }

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
      }
      throw createError({
        statusCode: response.status,
        statusMessage: data?.message || data?.error || 'Erro na API',
        data,
      })
    }
    return data as T
  }

  const login = async (email: string, password: string) => {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error || !data.session) {
      throw createError({
        statusCode: 401,
        statusMessage: error?.message || 'E-mail ou senha inválidos',
      })
    }
    token.value = data.session.access_token
    await listProperties()
  }

  const logout = async () => {
    try {
      if (import.meta.client) {
        await useSupabaseClient().auth.signOut()
      }
    } finally {
      token.value = null
    }
  }

  const isAuthenticated = computed(() => Boolean(token.value))

  const listProperties = () => request<Property[]>('/admin/properties')
  const getProperty = (id: string) => request<Property>(`/admin/properties/${id}`)
  const createProperty = (input: CreatePropertyInput) => {
    const parsed = createPropertySchema.safeParse(input)
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: {
          error: 'validation_error',
          issues: parsed.error.flatten().fieldErrors,
          message: parsed.error.issues.map((i) => i.message).join(' · '),
        },
      })
    }
    return request<Property>('/admin/properties', {
      method: 'POST',
      body: JSON.stringify({
        ...parsed.data,
        constructionStartDate: parsed.data.constructionStartDate
          ? new Date(parsed.data.constructionStartDate).toISOString()
          : null,
        constructionEndDate: parsed.data.constructionEndDate
          ? new Date(parsed.data.constructionEndDate).toISOString()
          : null,
      }),
    })
  }
  const updateProperty = (id: string, input: UpdatePropertyInput) =>
    request<Property>(`/admin/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePropertySchema.parse(input)),
    })
  const removeProperty = (id: string) =>
    request<void>(`/admin/properties/${id}`, { method: 'DELETE' })

  const uploadPropertyMedia = async (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request(`/admin/properties/${id}/media`, {
      method: 'POST',
      body: form,
    })
  }

  const removePropertyMedia = (id: string, mediaId: string) =>
    request<void>(`/admin/properties/${id}/media/${mediaId}`, { method: 'DELETE' })

  const reorderPropertyMedia = (id: string, mediaIds: string[]) =>
    request(`/admin/properties/${id}/media/order`, {
      method: 'PUT',
      body: JSON.stringify({ mediaIds }),
    })

  const setPropertyCoverMedia = (id: string, mediaId: string) =>
    request(`/admin/properties/${id}/media/${mediaId}/cover`, { method: 'POST' })

  const listLeads = () => request<Lead[]>('/admin/leads')
  const createLead = (input: CreateLeadInput) =>
    request<Lead>('/admin/leads', {
      method: 'POST',
      body: JSON.stringify(createLeadSchema.parse(input)),
    })
  const updateLead = (id: string, input: UpdateLeadInput) =>
    request<Lead>(`/admin/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateLeadSchema.parse(input)),
    })
  const removeLead = (id: string) => request<void>(`/admin/leads/${id}`, { method: 'DELETE' })

  const listCategories = () => request<PropertyCategory[]>('/admin/categories')
  const createCategory = (input: CreatePropertyCategoryInput) => {
    const parsed = createPropertyCategorySchema.safeParse(input)
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: {
          error: 'validation_error',
          issues: parsed.error.flatten().fieldErrors,
          message: parsed.error.issues.map((i) => i.message).join(' · '),
        },
      })
    }
    return request<PropertyCategory>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    })
  }
  const updateCategory = (id: string, input: UpdatePropertyCategoryInput) =>
    request<PropertyCategory>(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePropertyCategorySchema.parse(input)),
    })
  const removeCategory = (id: string) =>
    request<void>(`/admin/categories/${id}`, { method: 'DELETE' })

  const getSettings = () => request<SiteSettings>('/admin/settings')
  const updateSettings = (input: UpdateSiteSettingsInput) =>
    request<SiteSettings>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(updateSiteSettingsSchema.parse(input)),
    })

  const listTestimonials = () => request<Testimonial[]>('/admin/testimonials')
  const createTestimonial = (input: CreateTestimonialInput) =>
    request<Testimonial>('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(createTestimonialSchema.parse(input)),
    })
  const updateTestimonial = (id: string, input: UpdateTestimonialInput) =>
    request<Testimonial>(`/admin/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateTestimonialSchema.parse(input)),
    })
  const removeTestimonial = (id: string) =>
    request<void>(`/admin/testimonials/${id}`, { method: 'DELETE' })

  return {
    token,
    isAuthenticated,
    login,
    logout,
    listProperties,
    getProperty,
    createProperty,
    updateProperty,
    removeProperty,
    uploadPropertyMedia,
    removePropertyMedia,
    reorderPropertyMedia,
    setPropertyCoverMedia,
    listLeads,
    createLead,
    updateLead,
    removeLead,
    listCategories,
    createCategory,
    updateCategory,
    removeCategory,
    getSettings,
    updateSettings,
    listTestimonials,
    createTestimonial,
    updateTestimonial,
    removeTestimonial,
    propertySchema,
    propertyStatusSchema,
    leadSchema,
    leadChannelSchema,
    leadStatusSchema,
  }
}
