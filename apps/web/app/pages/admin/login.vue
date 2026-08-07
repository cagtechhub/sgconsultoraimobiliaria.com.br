<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { login, isAuthenticated } = useAdminApi()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

if (import.meta.client && isAuthenticated.value) {
  await navigateTo('/admin')
}

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/admin')
  } catch (e: unknown) {
    const message =
      e && typeof e === 'object' && 'statusMessage' in e
        ? String((e as { statusMessage?: string }).statusMessage)
        : ''
    error.value = message || 'E-mail ou senha inválidos.'
    await useAdminApi().logout()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#11100e] px-5">
    <form
      class="w-full max-w-md rounded-2xl border border-brand-500/20 bg-[#1a1815] p-8 shadow-2xl"
      @submit.prevent="onSubmit"
    >
      <p class="text-xs uppercase tracking-[0.22em] text-brand-300">Acesso restrito</p>
      <h1 class="mt-2 font-display text-3xl text-white">Admin</h1>
      <p class="mt-2 text-sm text-white/60">
        Entre com a conta Supabase Auth do painel.
      </p>
      <label class="mt-6 block text-sm text-white/80">
        E-mail
        <input
          v-model="email"
          type="email"
          required
          class="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-brand-400"
          autocomplete="username"
        />
      </label>
      <label class="mt-4 block text-sm text-white/80">
        Senha
        <input
          v-model="password"
          type="password"
          required
          class="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-brand-400"
          autocomplete="current-password"
        />
      </label>
      <p v-if="error" class="mt-3 text-sm text-red-300">{{ error }}</p>
      <button
        type="submit"
        class="mt-6 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-ink hover:bg-brand-400 disabled:opacity-60"
        :disabled="loading"
      >
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>
