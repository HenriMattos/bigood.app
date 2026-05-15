import { readStorage, writeStorage } from "@/services/company"
import type { Plan, Subscription } from "@/types"

const COMMERCIAL_PLANS_STORAGE_KEY = "mydashbarber.v1.commercial.plans"
const COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY =
  "mydashbarber.v1.commercial.subscriptions"

export function getStoredCommercialPlans<T extends Plan>(fallback: T[]) {
  const stored = readStorage<T[] | null>(COMMERCIAL_PLANS_STORAGE_KEY, null)
  if (!stored || stored.length === 0) return fallback
  if (fallback.length > 0 && stored[0].name !== fallback[0].name) return fallback
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
  if (!stored || stored.length === 0) return fallback
  if (fallback.length > 0 && stored[0].client !== fallback[0].client)
    return fallback
  return stored
}

export function saveCommercialSubscriptions<T extends Subscription>(
  subscriptions: T[]
) {
  writeStorage(COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY, subscriptions)
}
