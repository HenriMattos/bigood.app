const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const AUTH_COOKIE_NAME = "mydashbarber.session"
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 8
export const DEFAULT_ADMIN_EMAIL = "admin@empresa.com"
export const DEFAULT_ADMIN_PASSWORD = "admin123"

type SessionPayload = {
  sub: string
  exp: number
}

export function getAdminCredentials() {
  // Em produção, as variáveis devem ser definidas no dashboard, 
  // mas usaremos os padrões como fallback para evitar crash.

  return {
    email: process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
  }
}

export async function createAuthSession(email: string) {
  const payload: SessionPayload = {
    sub: email,
    exp: Math.floor(Date.now() / 1000) + AUTH_SESSION_MAX_AGE,
  }
  const encodedPayload = base64UrlEncode(
    encoder.encode(JSON.stringify(payload))
  )
  const signature = await sign(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export async function verifyAuthSession(token?: string) {
  if (!token) return false

  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) return false

  const expectedSignature = await sign(encodedPayload)

  if (!safeEqual(signature, expectedSignature)) return false

  try {
    const payload = JSON.parse(
      decoder.decode(base64UrlDecode(encodedPayload))
    ) as SessionPayload

    return Boolean(payload.sub && payload.exp > Math.floor(Date.now() / 1000))
  } catch {
    return false
  }
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))

  return base64UrlEncode(new Uint8Array(signature))
}

function getAuthSecret() {
  // AUTH_SECRET deve ser definido em produção.

  return process.env.AUTH_SECRET ?? "dev-only-change-this-secret"
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function safeEqual(first: string, second: string) {
  if (first.length !== second.length) return false

  let result = 0

  for (let index = 0; index < first.length; index += 1) {
    result |= first.charCodeAt(index) ^ second.charCodeAt(index)
  }

  return result === 0
}
