<template>
  <NuxtPage />
</template>

<script setup>
import { useColorMode } from '@vueuse/core'

// Initialize color mode
const colorMode = useColorMode({
  storageKey: 'snapwifi-color-mode',
  storage: import.meta.client ? localStorage : undefined,
})

// Apply theme class to document element reactively
if (import.meta.client) {
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode.value === 'dark')
  })
}
</script>