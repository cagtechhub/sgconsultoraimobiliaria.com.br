import type { SoldCase } from '@gutierres/shared'
import { useApiBaseUrl } from '~/utils/mapProperty'

export function useSoldCases() {
  const baseUrl = useApiBaseUrl()

  const { data: soldCases, pending, error } = useAsyncData(
    'sold-cases',
    () => $fetch<SoldCase[]>(`${baseUrl.value}/sold-cases`),
    { default: () => [] },
  )

  return { soldCases, pending, error }
}
