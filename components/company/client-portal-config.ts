import type { CSSProperties } from "react"

import type { Plan, Subscription } from "@/components/admin/database"

export type ClientPortalMode = "light" | "dark"

export type ClientPortalSettings = {
  tradeName: string
  slug: string
  logoUrl?: string
  iconUrl?: string
  carouselImage1?: string
  carouselImage2?: string
  carouselImage3?: string
  introTitle1?: string
  introSubtitle1?: string
  introTitle2?: string
  introSubtitle2?: string
  introTitle3?: string
  introSubtitle3?: string
  themeId: string
  mode: ClientPortalMode
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zip: string
    mapsUrl: string
  }
  social?: {
    instagram: string
    whatsapp: string
    facebook: string
  }
}

export type ClientPortalTheme = {
  id: string
  name: string
  description: string
  mode: ClientPortalMode
  gradient: string
  primary: string
  primaryForeground: string
  accent: string
  previewTextClass: string
}

export const CLIENT_PORTAL_SETTINGS_STORAGE_KEY = "mydashbarber.v1.settings"
export const CLIENT_PORTAL_PLANS_STORAGE_KEY = "mydashbarber.v1.plans"
export const CLIENT_PORTAL_SUBSCRIPTIONS_STORAGE_KEY =
  "mydashbarber.v1.subscriptions"
export const CLIENT_PORTAL_SYNC_EVENT = "mydashbarber.v1.sync"

export const clientPortalThemes: ClientPortalTheme[] = [
  {
    id: "claro-premium",
    name: "Claro Premium",
    description: "Design limpo, moderno e sofisticado",
    mode: "light",
    gradient: "linear-gradient(135deg, oklch(0.857 0.1698 134.5554 / 0.1) 0%, oklch(0.9842 0.0034 247.8575) 42%, oklch(0.857 0.1698 134.5554 / 0.05) 100%)",
    primary: "oklch(0.857 0.1698 134.5554)",
    primaryForeground: "oklch(0.2869 0.0839 135.0504)",
    accent: "oklch(0.9683 0.0069 247.8956)",
    previewTextClass: "text-[#064e3b]",
  },
  {
    id: "escuro-premium",
    name: "Escuro Premium",
    description: "Elegância absoluta em tons de cinza e preto",
    mode: "dark",
    gradient: "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    primary: "oklch(0.857 0.1698 134.5554)",
    primaryForeground: "oklch(0.2869 0.0839 135.0504)",
    accent: "#f8fafc",
    previewTextClass: "text-white",
  },
]

export function createDefaultClientPortalSettings(company: {
  tradeName: string
  slug: string
  logoUrl?: string
  iconUrl?: string
  introTitle1?: string
  introSubtitle1?: string
  introTitle2?: string
  introSubtitle2?: string
  introTitle3?: string
  introSubtitle3?: string
  carouselImage1?: string
  carouselImage2?: string
  carouselImage3?: string
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zip: string
    mapsUrl: string
  }
  social?: {
    instagram: string
    whatsapp: string
    facebook: string
  }
}): ClientPortalSettings {
  return {
    tradeName: company.tradeName,
    slug: company.slug,
    logoUrl: company.logoUrl,
    iconUrl: company.iconUrl,
    introTitle1: company.introTitle1,
    introSubtitle1: company.introSubtitle1,
    introTitle2: company.introTitle2,
    introSubtitle2: company.introSubtitle2,
    introTitle3: company.introTitle3,
    introSubtitle3: company.introSubtitle3,
    carouselImage1: company.carouselImage1,
    carouselImage2: company.carouselImage2,
    carouselImage3: company.carouselImage3,
    address: company.address,
    social: company.social,
    themeId: clientPortalThemes[0].id,
    mode: clientPortalThemes[0].mode,
  }
}

export function getClientPortalTheme(themeId?: string) {
  return (
    clientPortalThemes.find((theme) => theme.id === themeId) ??
    clientPortalThemes[0]
  )
}

export function getStoredClientPortalSettings(
  fallback: ClientPortalSettings
): ClientPortalSettings {
  const stored = readStorage<ClientPortalSettings | null>(
    CLIENT_PORTAL_SETTINGS_STORAGE_KEY,
    null
  )

  // Se os dados salvos forem de outra empresa (nome diferente), ignoramos para usar o banco de dados atual
  if (stored && stored.tradeName !== fallback.tradeName) {
    return fallback
  }

  const settings = {
    ...fallback,
    ...(stored || {}),
  }

  const fallbackTheme =
    settings.mode === "dark"
      ? clientPortalThemes.find((theme) => theme.mode === "dark") ??
        clientPortalThemes[0]
      : clientPortalThemes[0]
  const theme =
    clientPortalThemes.find((item) => item.id === settings.themeId) ??
    fallbackTheme

  return {
    ...settings,
    themeId: theme.id,
    mode: theme.mode,
  }
}

export function saveClientPortalSettings(settings: ClientPortalSettings) {
  writeStorage(CLIENT_PORTAL_SETTINGS_STORAGE_KEY, settings)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CLIENT_PORTAL_SYNC_EVENT))
  }
}

export function getStoredClientPlans<T extends Plan>(fallback: T[]) {
  const stored = readStorage<T[] | null>(CLIENT_PORTAL_PLANS_STORAGE_KEY, null)

  if (!stored || stored.length === 0) {
    return fallback
  }

  // Se o primeiro plano salvo for diferente do banco atual, ignoramos
  if (fallback.length > 0 && stored[0].name !== fallback[0].name) {
    return fallback
  }

  return stored
}

export function saveClientPlans<T extends Plan>(plans: T[]) {
  writeStorage(CLIENT_PORTAL_PLANS_STORAGE_KEY, plans)
}

export function getStoredClientSubscriptions<T extends Subscription>(
  fallback: T[]
) {
  const stored = readStorage<T[] | null>(
    CLIENT_PORTAL_SUBSCRIPTIONS_STORAGE_KEY,
    null
  )

  if (!stored || stored.length === 0) {
    return fallback
  }

  // Se o primeiro assinante for diferente, ignoramos
  if (fallback.length > 0 && stored[0].client !== fallback[0].client) {
    return fallback
  }

  return stored
}

export function saveClientSubscriptions<T extends Subscription>(
  subscriptions: T[]
) {
  writeStorage(CLIENT_PORTAL_SUBSCRIPTIONS_STORAGE_KEY, subscriptions)
}

export function getClientPortalCssVariables(
  settings: ClientPortalSettings
): CSSProperties {
  const theme = getClientPortalTheme(settings.themeId)
  const dark = theme.mode === "dark"
  
  // Cores baseadas no globals.css do admin
  const background = dark ? "oklch(0.1980 0.0300 264.6600)" : "oklch(0.9842 0.0034 247.8575)"
  const foreground = dark ? "oklch(0.9842 0.0034 247.8575)" : "oklch(0.235 0.055 145)"
  const card = dark ? "oklch(0.2520 0.0340 261.2000)" : "oklch(1 0 0)"
  const popover = dark ? "oklch(0.2380 0.0340 262.5000)" : "oklch(1 0 0)"
  const secondary = dark ? "oklch(0.3340 0.0300 260.2000)" : "oklch(0.9683 0.0069 247.8956)"
  const muted = dark ? "oklch(0.2960 0.0280 260.2000)" : "oklch(0.9683 0.0069 247.8956)"
  const mutedForeground = dark ? "oklch(0.7107 0.0351 256.7878)" : "oklch(0.47 0.035 150)"
  const border = dark ? "oklch(0.3920 0.0220 259.9000)" : "oklch(0.9288 0.0126 255.5078)"

  return {
    "--primary": theme.primary,
    "--color-primary": theme.primary,
    "--ring": theme.primary,
    "--color-ring": theme.primary,
    "--chart-1": theme.primary,
    "--sidebar-primary": theme.primary,
    "--primary-foreground": theme.primaryForeground,
    "--color-primary-foreground": theme.primaryForeground,
    "--client-plan-gradient": theme.gradient,
    "--background": background,
    "--color-background": background,
    "--foreground": foreground,
    "--color-foreground": foreground,
    "--card": card,
    "--color-card": card,
    "--card-foreground": foreground,
    "--color-card-foreground": foreground,
    "--popover": popover,
    "--color-popover": popover,
    "--popover-foreground": foreground,
    "--color-popover-foreground": foreground,
    "--secondary": secondary,
    "--color-secondary": secondary,
    "--secondary-foreground": foreground,
    "--color-secondary-foreground": foreground,
    "--muted": muted,
    "--color-muted": muted,
    "--muted-foreground": mutedForeground,
    "--color-muted-foreground": mutedForeground,
    "--accent": secondary,
    "--color-accent": secondary,
    "--accent-foreground": foreground,
    "--color-accent-foreground": foreground,
    "--border": border,
    "--color-border": border,
    "--input": border,
    "--color-input": border,
    "--client-primary-contrast": dark ? "#ffffff" : "oklch(0.2869 0.0839 135.0504)",
    "--radius": "0.75rem",
    colorScheme: dark ? "dark" : "light",
  } as CSSProperties
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
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new CustomEvent(CLIENT_PORTAL_SYNC_EVENT))
  })
}
