import type { Testimonial } from '@gutierres/shared'
import { useApiBaseUrl } from '~/utils/mapProperty'

export function useTestimonials() {
  const baseUrl = useApiBaseUrl()

  const { data: testimonials, pending, error } = useAsyncData(
    'testimonials',
    () => $fetch<Testimonial[]>(`${baseUrl.value}/testimonials`),
    { default: () => [] },
  )

  return { testimonials, pending, error }
}
