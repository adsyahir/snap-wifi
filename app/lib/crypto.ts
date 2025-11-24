import CryptoJS from 'crypto-js'

// Use environment variable or fallback to default key
const ENCRYPTION_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

export const encryptData = (data: string): { encrypted: string; iv: string } => {
  const iv = CryptoJS.lib.WordArray.random(16).toString()
  const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY, {
    iv: CryptoJS.enc.Hex.parse(iv)
  }).toString()
  return { encrypted, iv }
}

export const decryptData = (encrypted: string, iv: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY, {
      iv: CryptoJS.enc.Hex.parse(iv)
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}