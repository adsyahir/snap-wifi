<template>
  <NuxtPage />
</template>

<script setup>
import { useColorMode } from '@vueuse/core'
useSeoMeta({
  title: 'SnapWifi - Instant WiFi QR Code Generator',
  description: 'Generate secure QR codes for your WiFi network in seconds. Share your WiFi password instantly - no typing required. Fast, free, and privacy-focused.'
})
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