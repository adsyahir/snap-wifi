export default defineNuxtPlugin(() => {
  // Apply theme immediately on client load to prevent flash
  const storedTheme = localStorage.getItem('snapwifi-color-mode')

  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
