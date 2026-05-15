import type {
  ClientAuthUser,
  ClientLoginInput,
  ClientRegisterInput,
} from "@/types/client-auth"

const AUTH_KEY_PREFIX = "bigood.clientPortal"
const USERS_KEY_SUFFIX = "auth.users"
const SESSION_KEY_SUFFIX = "auth"

function getUsersStorageKey(slug: string) {
  return `${AUTH_KEY_PREFIX}.${slug}.${USERS_KEY_SUFFIX}`
}

function getSessionStorageKey(slug: string) {
  return `${AUTH_KEY_PREFIX}.${slug}.${SESSION_KEY_SUFFIX}`
}

type StoredUser = ClientAuthUser & { password: string }

const DEMO_BARBERSHOP_SLUG = "barbearia-vip"
const DEMO_CLIENT_USER: StoredUser = {
  id: "client_demo_001",
  name: "Henrique Demo",
  email: "cliente@barbeariavip.com",
  phone: "(11) 98888-0101",
  barbershopSlug: DEMO_BARBERSHOP_SLUG,
  createdAt: "2026-01-15T10:00:00.000Z",
  password: "cliente123",
}

function getSeedUsers(slug: string): StoredUser[] {
  return slug === DEMO_BARBERSHOP_SLUG ? [DEMO_CLIENT_USER] : []
}

function readUsers(slug: string): StoredUser[] {
  try {
    const raw = localStorage.getItem(getUsersStorageKey(slug))
    const storedUsers = raw ? (JSON.parse(raw) as StoredUser[]) : []
    const seedUsers = getSeedUsers(slug)
    const storedUsersWithoutSeedDuplicates = storedUsers.filter(
      (storedUser) =>
        !seedUsers.some(
          (seedUser) =>
            storedUser.email === seedUser.email ||
            storedUser.phone === seedUser.phone
        )
    )

    return [...seedUsers, ...storedUsersWithoutSeedDuplicates]
  } catch {
    return getSeedUsers(slug)
  }
}

function writeUsers(slug: string, users: StoredUser[]) {
  localStorage.setItem(getUsersStorageKey(slug), JSON.stringify(users))
}

function readSession(
  slug: string
): { user: ClientAuthUser; token: string } | null {
  try {
    const raw = localStorage.getItem(getSessionStorageKey(slug))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(slug: string, user: ClientAuthUser, token: string) {
  localStorage.setItem(
    getSessionStorageKey(slug),
    JSON.stringify({ user, token })
  )
}

function clearSession(slug: string) {
  localStorage.removeItem(getSessionStorageKey(slug))
}

function generateId() {
  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function generateToken() {
  return `tok_${Date.now()}_${Math.random().toString(36).slice(2, 16)}`
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase()
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

export async function registerClient(
  slug: string,
  input: ClientRegisterInput
): Promise<{ user: ClientAuthUser; token: string }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600))

  const users = readUsers(slug)
  const exists = users.some(
    (u) => u.email === input.email || u.phone === input.phone
  )

  if (exists) {
    throw new Error(
      "Este e-mail ou WhatsApp já está cadastrado nesta barbearia."
    )
  }

  const user: ClientAuthUser = {
    id: generateId(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    barbershopSlug: slug,
    createdAt: new Date().toISOString(),
  }

  const storedUser: StoredUser = { ...user, password: input.password }
  users.push(storedUser)
  writeUsers(slug, users)

  const token = generateToken()
  writeSession(slug, user, token)

  return { user, token }
}

export async function loginClient(
  slug: string,
  input: ClientLoginInput
): Promise<{ user: ClientAuthUser; token: string }> {
  await new Promise((r) => setTimeout(r, 600))

  const users = readUsers(slug)
  const identifier = normalizeIdentifier(input.identifier)
  const identifierDigits = onlyDigits(identifier)

  const found = users.find(
    (u) =>
      (u.email.toLowerCase() === identifier ||
        u.phone === identifier ||
        onlyDigits(u.phone) === identifierDigits) &&
      u.password === input.password.trim()
  )

  if (!found) {
    throw new Error(
      "Credenciais inválidas. Verifique seus dados e tente novamente."
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...user } = found
  const token = generateToken()
  writeSession(slug, user, token)

  return { user, token }
}

export async function logoutClient(slug: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200))
  clearSession(slug)
}

export async function getClientSession(
  slug: string
): Promise<{ user: ClientAuthUser; token: string } | null> {
  await new Promise((r) => setTimeout(r, 100))
  return readSession(slug)
}
