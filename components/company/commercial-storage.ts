import type { Plan, Subscription } from "@/components/admin/database"

const COMMERCIAL_PLANS_STORAGE_KEY = "mydashbarber.v1.commercial.plans"
const COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY =
  "mydashbarber.v1.commercial.subscriptions"

export function getStoredCommercialPlans<T extends Plan>(fallback: T[]) {
  const stored = readStorage<T[] | null>(COMMERCIAL_PLANS_STORAGE_KEY, null)

  if (!stored || stored.length === 0) {
    return fallback
  }

  if (fallback.length > 0 && stored[0].name !== fallback[0].name) {
    return fallback
  }

  return stored
}

export function saveCommercialPlans<T extends Plan>(plans: T[]) {
  writeStorage(COMMERCIAL_PLANS_STORAGE_KEY, plans)
}

export function getStoredCommercialSubscriptions<T extends Subscription>(
  fallback: T[]
) {
  const stored = readStorage<T[] | null>(
    COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY,
    null
  )

  if (!stored || stored.length === 0) {
    return fallback
  }

  if (fallback.length > 0 && stored[0].client !== fallback[0].client) {
    return fallback
  }

  return stored
}

export function saveCommercialSubscriptions<T extends Subscription>(
  subscriptions: T[]
) {
  writeStorage(COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY, subscriptions)
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return

  window.localStorage.setItem(key, JSON.stringify(value))
}
