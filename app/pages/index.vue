<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header -->
    <header class="border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold tracking-tight">SnapWiFi</h1>
          <Button variant="ghost" size="icon" @click="toggleTheme" class="rounded-full">
            <ClientOnly>
              <Sun v-if="isDark" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
              <template #fallback>
                <div class="h-5 w-5 rounded-full border-2 border-current"></div>
              </template>
            </ClientOnly>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-1 mb-8">
          <TabsTrigger value="qr">WiFi QR Code</TabsTrigger>
        </TabsList>

        <!-- QR Code Tab -->
        <TabsContent value="qr">
          <div class="grid gap-6">
            <!-- WiFi Credentials Form -->
            <Card v-if="!isSharedView">
              <CardHeader>
                <CardTitle>WiFi Credentials</CardTitle>
                <CardDescription>
                  Enter your WiFi details to generate a QR code
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-2">
                  <Label for="ssid">Network Name (SSID)</Label>
                  <Input id="ssid" v-model="form.ssid" placeholder="MyWiFiNetwork" />
                  <p v-if="errors.ssid" class="text-sm text-destructive">{{ errors.ssid }}</p>
                </div>

                <div class="space-y-2">
                  <Label for="password">Password</Label>
                  <div class="relative">
                    <Input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                      placeholder="Enter password" class="pr-10" />
                    <Button type="button" variant="ghost" size="icon"
                      class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      @click="showPassword = !showPassword">
                      <Eye v-if="!showPassword" class="h-4 w-4 text-muted-foreground" />
                      <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
                </div>

                <div class="space-y-2">
                  <Label for="encryption">Security Type</Label>
                  <select id="encryption" v-model="form.encryption"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
                <Button @click="generateQRCode" class="w-full" :disabled="isGenerating">
                  <Loader2 v-if="isGenerating" class="mr-2 h-4 w-4 animate-spin" />
                  {{ isGenerating ? 'Generating...' : 'Generate QR Code' }}
                </Button>
              </CardContent>
            </Card>

            <!-- QR Code Display -->
            <div v-if="qrCodeData" ref="qrCardRef">
              <Card>
                <CardHeader>
                  <CardTitle>{{ isSharedView ? 'WiFi QR Code' : 'Your WiFi QR Code' }}</CardTitle>
                  <CardDescription>
                    <span v-if="isSharedView">
                      Scan this code with your phone to connect to <strong>{{ form.ssid }}</strong>
                    </span>
                    <span v-else>
                      Scan this code to connect to <strong>{{ form.ssid }}</strong>
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col items-center space-y-4">
                  <div class="bg-white p-6 rounded-lg">
                    <img :src="qrCode" alt="QR Code" />
                  </div>

                  <div v-if="!isSharedView" class="flex gap-2 w-full">
                    <div class="flex gap-2 flex-1">
                      <Button @click="downloadQRCode('png')" variant="outline" class="flex-1">
                        <Download class="mr-2 h-4 w-4" />
                        PNG
                      </Button>
                      <Button @click="downloadQRCode('jpg')" variant="outline" class="flex-1">
                        <Download class="mr-2 h-4 w-4" />
                        JPG
                      </Button>
                    </div>
                  </div>

                  <div v-if="isSharedView" class="flex gap-2 w-full">
                    <Button @click="downloadQRCode('png')" variant="outline" class="flex-1">
                      <Download class="mr-2 h-4 w-4" />
                      PNG
                    </Button>
                    <Button @click="downloadQRCode('jpg')" variant="outline" class="flex-1">
                      <Download class="mr-2 h-4 w-4" />
                      JPG
                    </Button>
                  </div>

                  <p v-if="linkCopied" class="text-sm text-muted-foreground">
                    Link copied to clipboard!
                  </p>
                </CardContent>
              </Card>
            </div>

            <!-- Saved Networks -->
            <Card v-if="!isSharedView && savedNetworks.length > 0">
              <CardHeader>
                <div class="flex flex-col gap-2">
                  <CardTitle>Saved Networks</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipContent side="bottom" class="max-w-xs">
                        <p class="text-sm">Your networks are stored locally on your device only. They never leave your
                          browser and are completely secure.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>
                  Previously generated QR codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-2">
                  <div v-for="(network, index) in savedNetworks" :key="index" :class="[
                    'flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer',
                    isQRCodeExpired(network) ? 'opacity-60 border-destructive/50' : 'hover:bg-accent'
                  ]" @click="loadNetwork(network)">
                    <div class="flex-1">
                      <p class="font-medium">{{ network.ssid }}</p>
                      <p class="text-sm text-muted-foreground">{{ network.encryption }}</p>
                      <p v-if="network.expiresAt" class="text-xs mt-1"
                        :class="isQRCodeExpired(network) ? 'text-destructive' : 'text-muted-foreground'">
                        {{ isQRCodeExpired(network) ? 'Expired' : `Expires: ${new
                          Date(network.expiresAt).toLocaleString()}`
                        }}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" @click.stop="deleteNetwork(index)">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useColorMode } from '@vueuse/core'
import {
  Moon,
  Sun,
  Download,
  Share2,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { z } from 'zod'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { encryptData, decryptData } from '~/lib/crypto'
import Footer from '~/components/Footer.vue'
import { Info, Trash2 } from 'lucide-vue-next'

// Theme management
const colorMode = useColorMode({
  storageKey: 'snapwifi-color-mode',
  storage: typeof window !== 'undefined' ? localStorage : undefined,
})

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('snapwifi-color-mode', colorMode.value)
}

// Tab management
const activeTab = ref('qr')

// Password visibility
const showPassword = ref(false)

// Loading state
const isGenerating = ref(false)

// WiFi credentials
interface form {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
}

// Stored network with encrypted password and QR data
interface StoredNetwork {
  ssid: string
  encryptedPassword: string
  encryptedQRData: string
  ivPassword: string
  ivQRData: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  expiresAt?: number
}

const wifiSchema = z.object({
  ssid: z.string()
    .min(1, 'SSID is required'),
  password: z.string()
    .optional()
    .or(z.literal('')),

  encryption: z.enum(['WPA', 'WEP', 'nopass'])
}).refine((data) => {
  if (data.encryption !== 'nopass' && !data.password) {
    return false
  }
  return true
}, {
  message: 'Password is required for WPA/WEP encryption',
  path: ['password']
})

const errors = ref<Record<string, string>>({})


const form = ref<form>({
  ssid: '',
  password: '',
  encryption: 'WPA'
})

const generateWifiString = (ssid: string, password: string, encryption: 'WPA' | 'WEP' | 'nopass') => {
  if (!ssid) return ''

  const escapeString = (str: string) => str.replace(/[\\;,:]/g, '\\$&')
  const type = encryption === 'nopass' ? 'nopass' : encryption

  return `WIFI:T:${type};S:${escapeString(ssid)};P:${escapeString(password)};H:false;;`
}

// QR code data reactive ref
const qrCodeData = ref('')

// QR code generated from qrCodeData
const qrCode = useQRCode(qrCodeData, { width: 300 })

const validateForm = (): boolean => {
  errors.value = {}

  // Use .value to access the ref
  const result = wifiSchema.safeParse(form.value)

  if (!result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string
      errors.value[field] = err.message
    })
    return false
  }

  return true
}

const linkCopied = ref(false)
const savedNetworks = ref<StoredNetwork[]>([])
const isSharedView = ref(false)
const qrCardRef = ref<HTMLElement | null>(null)

// Load saved networks on mount
onMounted(() => {
  const saved = localStorage.getItem('snap-wifi-networks')
  if (saved) {
    try {
      savedNetworks.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load saved networks:', error)
    }
  }
})

// Functions - Implement your logic here
const generateQRCode = () => {
  try {
    isGenerating.value = true

    // Validate form
    if (!validateForm()) {
      isGenerating.value = false
      return
    }

    console.log('Generating QR code for:', form.value)

    // Generate WiFi string
    const wifiString = generateWifiString(form.value.ssid, form.value.password, form.value.encryption)

    // Set the QR code data - this will trigger QR code generation
    qrCodeData.value = wifiString

    // Encrypt and save network
    const passwordEncrypted = encryptData(form.value.password)
    const qrDataEncrypted = encryptData(wifiString)

    const network: StoredNetwork = {
      ssid: form.value.ssid,
      encryptedPassword: passwordEncrypted.encrypted,
      ivPassword: passwordEncrypted.iv,
      encryptedQRData: qrDataEncrypted.encrypted,
      ivQRData: qrDataEncrypted.iv,
      encryption: form.value.encryption,
    }

    // Check if network already exists and update it
    const existingIndex = savedNetworks.value.findIndex(n => n.ssid === form.value.ssid)
    if (existingIndex !== -1) {
      savedNetworks.value[existingIndex] = network
    } else {
      savedNetworks.value.unshift(network)
    }

    // Save to localStorage
    localStorage.setItem('snap-wifi-networks', JSON.stringify(savedNetworks.value))
    // console.log('Saved networks:', localStorage);

  } catch (error) {
    console.error('Error:', error)
    alert('Failed to generate QR code')
  } finally {
    isGenerating.value = false
  }
}



const isMobileDevice = () => {
  // Check for mobile/tablet devices
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Exclude desktop devices
  const isDesktop = /windows nt|macintosh|linux x86_64/i.test(userAgent) && !isTouch
  
  return isMobile || (isTouch && !isDesktop)
}

const downloadQRCode = async (format: 'png' | 'jpg' = 'png') => {
  if (!qrCode.value) return

  const img = new Image()
  img.onload = async () => {
    // Create canvas with extra space for text
    const canvas = document.createElement('canvas')
    const padding = 60
    const textHeight = 120
    const qrSize = img.width

    canvas.width = qrSize + (padding * 2)
    canvas.height = qrSize + (padding * 2) + textHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set background color based on format
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw title text
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 28px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Your WiFi QR Code', canvas.width / 2, padding + 30)

    // Draw subtitle text
    ctx.font = '20px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillStyle = '#666666'
    ctx.fillText(
      `Scan this code to connect to ${form.value.ssid}`,
      canvas.width / 2,
      padding + 65
    )

    // Draw white background for QR code
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(padding, padding + textHeight, qrSize, qrSize)

    // Draw the QR code
    ctx.drawImage(img, padding, padding + textHeight)

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return

      // Only use share API on mobile devices
      if (isMobileDevice() && navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], `wifi-qr-${form.value.ssid || 'code'}.${format}`, {
            type: format === 'jpg' ? 'image/jpeg' : 'image/png'
          })

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'WiFi QR Code',
              text: `QR Code for ${form.value.ssid}`
            })
            return
          }
        } catch (err) {
          console.log('Share failed, falling back to download')
        }
      }

      // Fallback: traditional download for desktop or if share fails
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `wifi-qr-${form.value.ssid || 'code'}.${format}`
      link.click()
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100)
    }, format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95)
  }
  img.src = qrCode.value
}

const copyShareLink = () => {
  // TODO: Implement copy share link logic
}

const loadNetwork = async (network: StoredNetwork) => {
  try {
    // Decrypt password
    const decryptedPassword = decryptData(network.encryptedPassword, network.ivPassword)
    const decryptedQRData = decryptData(network.encryptedQRData, network.ivQRData)

    // Load into form
    form.value = {
      ssid: network.ssid,
      password: decryptedPassword,
      encryption: network.encryption
    }

    // Set QR code data
    qrCodeData.value = decryptedQRData

    // Scroll to QR code
    setTimeout(() => {
      qrCardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  } catch (error) {
    console.error('Failed to load network:', error)
    alert('Failed to load network. The data may be corrupted.')
  }
}

const deleteNetwork = (index: number) => {
  const network = savedNetworks.value[index]
  if (!network) return

  if (confirm(`Delete "${network.ssid}" from saved networks?`)) {
    savedNetworks.value.splice(index, 1)
    localStorage.setItem('snap-wifi-networks', JSON.stringify(savedNetworks.value))
  }
}

const isQRCodeExpired = (network: StoredNetwork): boolean => {
  if (!network.expiresAt) return false
  return Date.now() > network.expiresAt
}
</script>
