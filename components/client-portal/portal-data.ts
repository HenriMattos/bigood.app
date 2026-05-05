import {
  database,
  addDays,
  toDateInputValue,
  type AgendaEvent,
  type ServiceCatalogItem,
} from "@/components/admin/database"

export const portalCompany = database.company
export const portalCustomer = database.clients[0]

const PROFILE_STORAGE_KEY = "mydashbarber.portal.profile.v1"
const AUTH_STORAGE_KEY = "mydashbarber.portal.auth.v1"

export function getActiveServices(): ServiceCatalogItem[] {
  return database.services
    .filter((service) => service.status === "Ativo" && !service.hidden)
    .sort((a, b) => a.order - b.order)
}

export function getActiveProfessionals() {
  return database.professionals.filter((p) => p.status === "Ativo")
}

export type DateOption = {
  id: string
  day: string
  weekday: string
  label: string
}

const WEEKDAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

export function getDateOptions(count = 7, from = new Date()): DateOption[] {
  return Array.from({ length: count }, (_, i) => {
    const d = addDays(from, i)
    const id = toDateInputValue(d)
    const dayNum = String(d.getDate()).padStart(2, "0")
    const weekday = WEEKDAY_SHORT[d.getDay()] ?? ""
    let label: string
    if (i === 0) label = "Hoje"
    else if (i === 1) label = "Amanhã"
    else label = weekday

    return {
      id,
      day: dayNum,
      weekday,
      label,
    }
  })
}

export type TimeSlot = { time: string; available: boolean }

export const TIME_SLOTS: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: false },
]

export function agendaEventsForCustomer(name: string | undefined): AgendaEvent[] {
  if (!name) return []
  return database.agendaEvents.filter(
    (event) => event.title === name && event.type === "appointment"
  )
}

export type AppointmentReschedule = {
  date: string
  start: string
  end: string
}

export type PortalProfile = {
  id: number
  name: string
  phone: string
  email: string
}

const SESSION_KEY = "mydashbarber.portal.session.v2"

export type PortalSessionSnapshot = {
  extraAppointments: AgendaEvent[]
  canceledIds: number[]
  rescheduled: Record<string, AppointmentReschedule>
}

export function getDefaultPortalProfile(): PortalProfile | undefined {
  if (!portalCustomer) return undefined
  return {
    id: portalCustomer.id,
    name: portalCustomer.name,
    phone: portalCustomer.phone,
    email: portalCustomer.email,
  }
}

export function readPortalProfile(): PortalProfile | undefined {
  const fallback = getDefaultPortalProfile()
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<PortalProfile>
    if (!parsed || typeof parsed !== "object") return fallback

    return {
      id: fallback?.id ?? 0,
      name: String(parsed.name ?? fallback?.name ?? ""),
      phone: String(parsed.phone ?? fallback?.phone ?? ""),
      email: String(parsed.email ?? fallback?.email ?? ""),
    }
  } catch {
    return fallback
  }
}

export function writePortalProfile(profile: PortalProfile) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

export function isPortalClientAuthenticated() {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "1"
}

export function setPortalClientAuthenticated(authed: boolean) {
  if (typeof window === "undefined") return
  if (authed) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "1")
    return
  }
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function readPortalSession(): PortalSessionSnapshot {
  if (typeof window === "undefined") {
    return { extraAppointments: [], canceledIds: [], rescheduled: {} }
  }
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (!raw)
      return { extraAppointments: [], canceledIds: [], rescheduled: {} }
    const parsed = JSON.parse(raw) as PortalSessionSnapshot
    return {
      extraAppointments: Array.isArray(parsed.extraAppointments)
        ? parsed.extraAppointments
        : [],
      canceledIds: Array.isArray(parsed.canceledIds) ? parsed.canceledIds : [],
      rescheduled:
        parsed.rescheduled && typeof parsed.rescheduled === "object"
          ? parsed.rescheduled
          : {},
    }
  } catch {
    return { extraAppointments: [], canceledIds: [], rescheduled: {} }
  }
}

export function writePortalSession(snapshot: PortalSessionSnapshot) {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot))
}
