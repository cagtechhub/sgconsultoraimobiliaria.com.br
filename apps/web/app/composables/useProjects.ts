import type { Property } from '@gutierres/shared'
import type { Project } from '~/types/project'
import { mapPropertyToProject } from '~/utils/mapProperty'

export function useProjects() {
  const baseUrl = useApiBase()

  const { data: featuredRaw } = useAsyncData(
    'properties-featured',
    () => $fetch<Property[]>(`${baseUrl.value}/properties?featured=true`),
    { default: () => [] },
  )

  const { data: selectedRaw } = useAsyncData(
    'properties-selected',
    () => $fetch<Property[]>(`${baseUrl.value}/properties?selected=true`),
    { default: () => [] },
  )

  const featuredProject = computed<Project | undefined>(() => {
    const first = featuredRaw.value?.[0]
    return first ? mapPropertyToProject(first) : undefined
  })

  const allProjects = computed<Project[]>(() =>
    (selectedRaw.value || []).map(mapPropertyToProject),
  )

  return { featuredProject, allProjects }
}
