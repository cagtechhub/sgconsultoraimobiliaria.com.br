import { projects } from '~/data/projects'
import type { Project } from '~/types/project'

export function useProjects() {
  const featuredProject = computed<Project | undefined>(() => projects.find((p) => p.featured))
  const allProjects = computed(() => projects)

  function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug)
  }

  return { featuredProject, allProjects, getProjectBySlug }
}
