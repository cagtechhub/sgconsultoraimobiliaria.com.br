export type ProjectStatus = 'Lançamento' | 'Em construção' | 'Pronto para morar'

export interface Project {
  slug: string
  title: string
  location: string
  status: ProjectStatus
  description: string
  longDescription: string
  deadline: string
  progress: number
  featured: boolean
  image: string
  floorPlanImage: string
  highlights: string[]
}
