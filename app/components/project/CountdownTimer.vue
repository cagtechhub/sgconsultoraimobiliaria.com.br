<script setup lang="ts">
const props = defineProps<{
  deadline: string
}>()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

const timeLeft = ref<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })

function calculateTimeLeft(): TimeLeft {
  const target = new Date(props.deadline).getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

let interval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timeLeft.value = calculateTimeLeft()
  interval = setInterval(() => {
    timeLeft.value = calculateTimeLeft()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const units = computed(() => [
  { label: 'Dias', value: timeLeft.value.days },
  { label: 'Horas', value: timeLeft.value.hours },
  { label: 'Min', value: timeLeft.value.minutes },
  { label: 'Seg', value: timeLeft.value.seconds },
])

function pad(n: number) {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div class="rounded-lg border border-brand-200/60 bg-white p-6 shadow-card">
    <p class="text-xs font-semibold uppercase tracking-widest text-brand-600">Previsão de entrega</p>

    <div v-if="timeLeft.expired" class="mt-4">
      <p class="font-display text-2xl font-semibold text-ink">Obra concluída</p>
      <p class="mt-1 text-sm text-slate-500">Empreendimento entregue conforme cronograma.</p>
    </div>

    <div v-else class="mt-4 grid grid-cols-4 gap-3">
      <div
        v-for="unit in units"
        :key="unit.label"
        class="flex flex-col items-center rounded-md bg-ink px-2 py-3"
      >
        <span class="font-display text-2xl font-bold tabular-nums text-brand-400 sm:text-3xl">
          {{ pad(unit.value) }}
        </span>
        <span class="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/50">
          {{ unit.label }}
        </span>
      </div>
    </div>
  </div>
</template>
