"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

import { database, type AgendaEvent, type Plan, type Subscription } from "@/components/admin/database"
import { COMPANY_LOGO_STORAGE_KEY } from "@/components/company/company-assets"
import {
  CLIENT_PORTAL_SYNC_EVENT,
  createDefaultClientPortalSettings,
  getClientPortalCssVariables,
  getStoredClientPlans,
  getStoredClientPortalSettings,
  getStoredClientSubscriptions,
  type ClientPortalSettings,
} from "@/components/company/client-portal-config"

import { getCompanyDisplayName } from "./booking-logic"
import {
  agendaEventsForCustomer,
  getDefaultPortalProfile,
  getActiveServices,
  portalCompany,
  portalCustomer,
  readPortalProfile,
  readPortalSession,
  type PortalProfile,
  writePortalSession,
  writePortalProfile,
  type PortalSessionSnapshot,
} from "./portal-data"

type PortalContextValue = {
  mounted: boolean
  portalSettings: ClientPortalSettings
  plans: Plan[]
  subscriptions: Subscription[]
  portalStyle: CSSProperties
  logoUrl?: string
  companyDisplayName: string
  clientProfile?: PortalProfile
  subscription?: Subscription
  currentPlan?: Plan
  activeServices: ReturnType<typeof getActiveServices>
  session: PortalSessionSnapshot
  addBooking: (event: AgendaEvent) => void
  updateSession: (fn: (prev: PortalSessionSnapshot) => PortalSessionSnapshot) => void
  updateClientProfile: (next: PortalProfile) => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

const defaultPortalSettings = createDefaultClientPortalSettings(portalCompany)

function readLogoUrl(fallback?: string) {
  if (typeof window === "undefined") return fallback
  return window.localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) || fallback
}

export function ClientPortalProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [portalSettings, setPortalSettings] = useState(defaultPortalSettings)
  const [plans, setPlans] = useState<Plan[]>(database.plans)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    database.subscriptions
  )
  const [session, setSessionState] = useState<PortalSessionSnapshot>({
    extraAppointments: [],
    canceledIds: [],
    rescheduled: {},
  })
  const [clientProfile, setClientProfile] = useState<PortalProfile | undefined>(
    getDefaultPortalProfile()
  )

  const portalStyle = useMemo(
    () => getClientPortalCssVariables(portalSettings) as CSSProperties,
    [portalSettings]
  )

  const subscription = useMemo(
    () =>
      portalCustomer
        ? subscriptions.find(
            (item) =>
              item.clientId === portalCustomer.id &&
              item.status !== "Pausada" &&
              item.status !== "Em atraso"
          )
        : undefined,
    [subscriptions]
  )

  const currentPlan = useMemo(
    () => plans.find((item) => item.name === subscription?.plan),
    [plans, subscription?.plan]
  )

  const activeServices = useMemo(() => getActiveServices(), [])

  const companyDisplayName = getCompanyDisplayName(portalSettings.tradeName)
  const defaultLogo = portalCompany.logoUrl?.trim()
  const logoUrl = mounted
    ? readLogoUrl(portalSettings.logoUrl || defaultLogo)
    : portalSettings.logoUrl || defaultLogo

  function syncFromAdmin() {
    setPortalSettings(getStoredClientPortalSettings(defaultPortalSettings))
    setPlans(getStoredClientPlans(database.plans))
    setSubscriptions(getStoredClientSubscriptions(database.subscriptions))
  }

  useEffect(() => {
    window.requestAnimationFrame(() => setMounted(true))
    queueMicrotask(() => {
      setSessionState(readPortalSession())
      setClientProfile(readPortalProfile())
      syncFromAdmin()
    })
    window.addEventListener("storage", syncFromAdmin)
    window.addEventListener(CLIENT_PORTAL_SYNC_EVENT, syncFromAdmin)
    return () => {
      window.removeEventListener("storage", syncFromAdmin)
      window.removeEventListener(CLIENT_PORTAL_SYNC_EVENT, syncFromAdmin)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const previousValues = new Map<string, string>()
    const previousColorScheme = root.style.colorScheme
    const hadDarkClass = root.classList.contains("dark")

    Object.entries(portalStyle).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (key.startsWith("--")) {
        previousValues.set(key, root.style.getPropertyValue(key))
        root.style.setProperty(key, String(value))
        return
      }

      if (key === "colorScheme") {
        root.style.colorScheme = String(value)
      }
    })

    root.classList.toggle("dark", portalSettings.mode === "dark")

    return () => {
      previousValues.forEach((value, key) => {
        if (value) root.style.setProperty(key, value)
        else root.style.removeProperty(key)
      })
      root.style.colorScheme = previousColorScheme
      root.classList.toggle("dark", hadDarkClass)
    }
  }, [portalSettings.mode, portalStyle])

  const updateSession = useCallback(
    (fn: (prev: PortalSessionSnapshot) => PortalSessionSnapshot) => {
      setSessionState((prev) => {
        const next = fn(prev)
        writePortalSession(next)
        return next
      })
    },
    []
  )

  const addBooking = useCallback((event: AgendaEvent) => {
    updateSession((prev) => ({
      ...prev,
      extraAppointments: [event, ...prev.extraAppointments],
    }))
  }, [updateSession])

  const updateClientProfile = useCallback((next: PortalProfile) => {
    setClientProfile(next)
    writePortalProfile(next)
  }, [])

  const value = useMemo(
    () =>
      ({
        mounted,
        portalSettings,
        plans,
        subscriptions,
        portalStyle,
        logoUrl,
        companyDisplayName,
        clientProfile,
        subscription,
        currentPlan,
        activeServices,
        session,
        addBooking,
        updateSession,
        updateClientProfile,
      }) satisfies PortalContextValue,
    [
      mounted,
      portalSettings,
      plans,
      subscriptions,
      portalStyle,
      logoUrl,
      companyDisplayName,
      clientProfile,
      subscription,
      currentPlan,
      activeServices,
      session,
      addBooking,
      updateSession,
      updateClientProfile,
    ]
  )

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  )
}

export function useClientPortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) {
    throw new Error("useClientPortal must be used within ClientPortalProvider")
  }
  return ctx
}

export function useMergedAppointments(): AgendaEvent[] {
  const { session } = useClientPortal()
  const customerName = portalCustomer?.name

  return useMemo(() => {
    const base = agendaEventsForCustomer(customerName)
    const combined = [...session.extraAppointments, ...base]

    return combined.map((appointment) => {
      const patch = session.rescheduled[String(appointment.id)]
      return patch ? { ...appointment, ...patch } : appointment
    })
  }, [session.extraAppointments, session.rescheduled, customerName])
}
