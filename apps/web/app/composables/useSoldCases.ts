import type { SoldCase } from '@gutierres/shared'

export function useSoldCases() {
  const baseUrl = useApiBase()

  const { data: soldCases, pending, error } = useAsyncData(
    'sold-cases',
    () => $fetch<SoldCase[]>(`${baseUrl.value}/sold-cases`),
    { default: () => [] },
  )

  return { soldCases, pending, error }
}
