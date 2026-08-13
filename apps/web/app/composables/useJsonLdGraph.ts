type SchemaNode = Record<string, unknown>

/** JSON-LD via useHead do Nuxt — evita @unhead/schema-org (injectHead sem contexto no SSR). */
export function useJsonLdGraph(key: string, nodes: () => SchemaNode[]) {
  useHead(() => {
    const graph = nodes().filter((node) => Object.keys(node).length > 0)
    if (!graph.length) return {}

    return {
      script: [
        {
          key,
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': graph,
          }).replace(/</g, '\\u003c'),
        },
      ],
    }
  })
}
