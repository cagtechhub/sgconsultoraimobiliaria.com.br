import type { Property, PropertyStatus } from '@gutierres/shared'
import type { Project, ProjectStatus } from '~/types/project'

const STATUS_LABEL: Record<PropertyStatus, ProjectStatus> = {
  LAUNCH: 'Lançamento',
  UNDER_CONSTRUCTION: 'Em construção',
  READY: 'Pronto para morar',
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'

export function mapPropertyToProject(property: Property): Project {
  const images = property.media
    .filter((item) => item.kind === 'IMAGE')
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const cover =
    images.find((item) => item.isCover) || images[0]

  const deadline = property.constructionEndDate
    ? new Date(property.constructionEndDate).toISOString()
    : new Date().toISOString()

  return {
    slug: property.slug,
    title: property.title,
    location: property.location || 'Sob consulta',
    status: STATUS_LABEL[property.status],
    description: property.description,
    longDescription: property.longDescription || property.description,
    deadline,
    progress: property.progress ?? 0,
    featured: property.featured,
    image: cover?.url || FALLBACK_IMAGE,
    floorPlanImage: property.floorPlanUrl || cover?.url || FALLBACK_IMAGE,
    highlights: property.highlights || [],
    gallery: images.map((item, index) => ({
      id: item.id,
      url: item.url,
      alt: `${property.title} — imagem ${index + 1}`,
      isCover: item.isCover,
    })),
  }
}

export function useApiBaseUrl() {
  const config = useRuntimeConfig()
  return computed(() => String(config.public.apiUrl || 'http://localhost:3001').replace(/\/$/, ''))
}
