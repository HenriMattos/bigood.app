import type { CSSProperties } from "react"

import type { Plan, Subscription } from "@/components/admin/database"

export type ClientPortalMode = "light" | "dark"

export type ClientPortalSettings = {
  tradeName: string
  slug: string
  logoUrl?: string
  iconUrl?: string
  themeId: string
  mode: ClientPortalMode
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

export const CLIENT_PORTAL_SETTINGS_STORAGE_KEY = "clientPortal.settings"
export const CLIENT_PORTAL_PLANS_STORAGE_KEY = "clientPortal.plans"
export const CLIENT_PORTAL_SUBSCRIPTIONS_STORAGE_KEY =
  "clientPortal.subscriptions"
export const CLIENT_PORTAL_SYNC_EVENT = "clientPortal:sync"

export const clientPortalThemes: ClientPortalTheme[] = [
  {
    id: "claro-verde",
    name: "Claro verde",
    description: "Portal claro com verde principal",
    mode: "light",
    gradient: "linear-gradient(135deg, #059447 0%, #37d367 42%, #ffd43d 100%)",
    primary: "#94e66d",
    primaryForeground: "#082814",
    accent: "#ffd43d",
    previewTextClass: "text-[#082814]",
  },
  {
    id: "escuro-prata",
    name: "Escuro prata",
    description: "Preto, branco e prata premium",
    mode: "dark",
    gradient: "linear-gradient(135deg, #030303 0%, #191919 36%, #777b82 68%, #f8fafc 100%)",
    primary: "#d1d5db",
    primaryForeground: "#050505",
    accent: "#f8fafc",
    previewTextClass: "text-white",
  },
]

export function createDefaultClientPortalSettings(company: {
  tradeName: string
  slug: string
  logoUrl?: string
  iconUrl?: string
}): ClientPortalSettings {
  return {
    tradeName: company.tradeName,
    slug: company.slug,
    logoUrl: company.logoUrl,
    iconUrl: company.iconUrl,
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
  const storedSettings = {
    ...fallback,
    ...readStorage<ClientPortalSettings>(
      CLIENT_PORTAL_SETTINGS_STORAGE_KEY,
      fallback
    ),
  }
  const fallbackTheme =
    storedSettings.mode === "dark"
      ? clientPortalThemes.find((theme) => theme.mode === "dark") ??
        clientPortalThemes[0]
      : clientPortalThemes[0]
  const theme =
    clientPortalThemes.find((item) => item.id === storedSettings.themeId) ??
    fallbackTheme

  return {
    ...storedSettings,
    themeId: theme.id,
    mode: theme.mode,
  }
}

export function saveClientPortalSettings(settings: ClientPortalSettings) {
  writeStorage(CLIENT_PORTAL_SETTINGS_STORAGE_KEY, settings)
}

export function getStoredClientPlans<T extends Plan>(fallback: T[]) {
  return readStorage<T[]>(CLIENT_PORTAL_PLANS_STORAGE_KEY, fallback)
}

export function saveClientPlans<T extends Plan>(plans: T[]) {
  writeStorage(CLIENT_PORTAL_PLANS_STORAGE_KEY, plans)
}

export function getStoredClientSubscriptions<T extends Subscription>(
  fallback: T[]
) {
  return readStorage<T[]>(CLIENT_PORTAL_SUBSCRIPTIONS_STORAGE_KEY, fallback)
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
  const background = dark ? "#070707" : "#f8faf7"
  const foreground = dark ? "#f8fafc" : "#102415"
  const card = dark ? "#0f0f10" : "#ffffff"
  const muted = dark ? "#1d1f23" : "#eef3ee"
  const mutedForeground = dark ? "#aeb4bd" : "#5d6d61"
  const border = dark ? "#343840" : "#dde7dd"

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
    "--popover": card,
    "--color-popover": card,
    "--popover-foreground": foreground,
    "--color-popover-foreground": foreground,
    "--muted": muted,
    "--color-muted": muted,
    "--muted-foreground": mutedForeground,
    "--color-muted-foreground": mutedForeground,
    "--accent": muted,
    "--color-accent": muted,
    "--accent-foreground": foreground,
    "--color-accent-foreground": foreground,
    "--border": border,
    "--color-border": border,
    "--input": border,
    "--color-input": border,
    "--client-primary-contrast": dark ? "#f8fafc" : "#4f7f3d",
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
  window.dispatchEvent(new Event(CLIENT_PORTAL_SYNC_EVENT))
}
