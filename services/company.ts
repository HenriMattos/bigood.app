export const COMPANY_LOGO_STORAGE_KEY = "mydashbarber.v1.logoUrl"
export const COMPANY_ICON_STORAGE_KEY = "mydashbarber.v1.iconUrl"
export const COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY =
  "mydashbarber.v1.carouselImage1"
export const COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY =
  "mydashbarber.v1.carouselImage2"
export const COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY =
  "mydashbarber.v1.carouselImage3"
export const COMPANY_PORTAL_BANNER_STORAGE_KEY =
  "mydashbarber.v1.clientPortal.bannerUrl"
export const COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY =
  "mydashbarber.v1.clientPortal.description"
export const COMPANY_PORTAL_ENABLED_STORAGE_KEY =
  "mydashbarber.v1.clientPortal.enabled"
export const COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY =
  "mydashbarber.v1.clientPortal.openingHours"
export const COMPANY_PORTAL_SLOGAN_STORAGE_KEY =
  "mydashbarber.v1.clientPortal.slogan"
export const COMPANY_PORTAL_SLUG_STORAGE_KEY =
  "mydashbarber.v1.clientPortal.slug"
export const COMPANY_PORTAL_SYNC_EVENT = "mydashbarber.clientPortal.sync"

export const COMPANY_PORTAL_SYNC_EVENT_NAME = "mydashbarber.clientPortal.sync"

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function readStringStorage(key: string): string {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem(key) || ""
}

export function notifyClientPortalSync() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(COMPANY_PORTAL_SYNC_EVENT_NAME))
}
