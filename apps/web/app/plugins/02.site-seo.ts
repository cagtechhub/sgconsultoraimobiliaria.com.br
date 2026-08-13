export default defineNuxtPlugin({
  name: 'site-seo',
  enforce: 'pre',
  setup() {
    useSiteSeoHead()
  },
})
