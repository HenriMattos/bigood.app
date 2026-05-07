import { database, type Plan } from "@/components/admin/database"
import {
  COMPANY_LOGO_STORAGE_KEY,
  COMPANY_PORTAL_BANNER_STORAGE_KEY,
  COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY,
  COMPANY_PORTAL_ENABLED_STORAGE_KEY,
  COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY,
  COMPANY_PORTAL_SLOGAN_STORAGE_KEY,
  COMPANY_PORTAL_SLUG_STORAGE_KEY,
} from "@/components/company/company-assets"
import { getStoredCommercialPlans } from "@/components/company/commercial-storage"

const DEFAULT_CLIENT_PORTAL_BANNER_URL =
  "https://images.pexels.com/photos/7518738/pexels-photo-7518738.jpeg"

export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"

export type PaymentMethod = "card" | "pix" | "boleto" | "barbershop"

export type BarberCompany = {
  id: string
  slug: string
  name: string
  slogan: string
  description: string
  logoUrl?: string
  bannerUrl?: string
  address?: string
  phone?: string
  whatsapp?: string
  instagram?: string
  openingHours?: string
}

export type ClientPortalService = {
  id: string
  name: string
  description?: string
  durationMinutes: number
  price: number
  isAvailable: boolean
}

export type ClientPortalProfessional = {
  id: string
  name: string
  role: string
}

export type ClientPortalPlan = {
  id: string
  name: string
  description: string
  price: number
  billingCycle: "monthly" | "annual" | "custom"
  benefits: string[]
  isRecommended?: boolean
}

export type ClientPortalAppointment = {
  id: string
  status: AppointmentStatus
  serviceId: string
  serviceName: string
  professionalId: string
  professionalName: string
  date: string
  time: string
  price: number
  address?: string
  notes?: string
}

export type ClientProfile = {
  id: string
  name: string
  phone: string
  email: string
  birthDate?: string
  cpf?: string
  gender?: string
  avatarUrl?: string
  contactPreferences: {
    whatsapp: boolean
    email: boolean
    sms: boolean
  }
}

export type ClientSubscription = {
  planId: string
  planName: string
  status: "active" | "pending" | "cancelled"
  startedAt: string
  renewsAt: string
  price: number
  paymentMethod: PaymentMethod
  benefits: string[]
}

export type ClientPortalState = {
  profile: ClientProfile
  appointments: ClientPortalAppointment[]
  subscription: ClientSubscription | null
}

export type ClientPortalData = {
  company: BarberCompany | null
  services: ClientPortalService[]
  professionals: ClientPortalProfessional[]
  plans: ClientPortalPlan[]
}

export function getClientPortalData(slug: string): ClientPortalData {
  const companySlug =
    readStringStorage(COMPANY_PORTAL_SLUG_STORAGE_KEY) ||
    database.company.slug ||
    "bigood"
  const portalEnabled =
    readStringStorage(COMPANY_PORTAL_ENABLED_STORAGE_KEY) !== "false"

  if (slug !== companySlug || !portalEnabled) {
    return {
      company: null,
      services: [],
      professionals: [],
      plans: [],
    }
  }

  return {
    company: {
      id: "company_1",
      slug: companySlug,
      name: database.company.tradeName || "Bigood",
      slogan:
        readStringStorage(COMPANY_PORTAL_SLOGAN_STORAGE_KEY) ||
        "Cabelo, barba e cuidado no seu tempo.",
      description:
        readStringStorage(COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY) ||
        "Experiencia premium para agendar, acompanhar planos e cuidar do visual sem mensagens soltas.",
      logoUrl:
        readStringStorage(COMPANY_LOGO_STORAGE_KEY) || database.company.logoUrl,
      bannerUrl:
        readStringStorage(COMPANY_PORTAL_BANNER_STORAGE_KEY) ||
        DEFAULT_CLIENT_PORTAL_BANNER_URL,
      address: [
        database.company.address.street,
        database.company.address.number,
        database.company.address.neighborhood,
        database.company.address.city,
        database.company.address.state,
      ]
        .filter(Boolean)
        .join(", "),
      phone: database.company.phone,
      whatsapp: database.company.social.whatsapp,
      instagram: database.company.social.instagram,
      openingHours:
        readStringStorage(COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY) ||
        "Seg a Sab, 09:00 as 19:00",
    },
    services: database.services
      .filter((service) => service.status === "Ativo" && !service.hidden)
      .sort((first, second) => first.order - second.order)
      .map((service) => ({
        id: String(service.id),
        name: service.name,
        description: `${service.category} com ${service.professionals}`,
        durationMinutes: service.durationMinutes,
        price: service.price,
        isAvailable: true,
      })),
    professionals: database.professionals
      .filter((professional) => professional.status === "Ativo")
      .map((professional) => ({
        id: String(professional.id),
        name: professional.name,
        role: professional.role,
      })),
    plans: getStoredCommercialPlans(database.plans).map(mapPlan),
  }
}

export function readClientPortalState(
  slug: string,
  data: ClientPortalData
): ClientPortalState {
  const fallback = getDefaultClientPortalState(data)

  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(getClientPortalStorageKey(slug))
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function saveClientPortalState(slug: string, state: ClientPortalState) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    getClientPortalStorageKey(slug),
    JSON.stringify(state)
  )
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    weekday: "short",
  }).format(date)
}

export function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function getNextRenewalDate() {
  return toDateInputValue(addDays(new Date(), 30))
}

function getClientPortalStorageKey(slug: string) {
  return `bigood.clientPortal.${slug}.state`
}

function readStringStorage(key: string) {
  if (typeof window === "undefined") {
    return ""
  }

  return window.localStorage.getItem(key) || ""
}

function mapPlan(plan: Plan): ClientPortalPlan {
  const benefits = [
    plan.benefit,
    `${plan.servicesLimit} atendimento(s) por ciclo`,
    "Prioridade em horarios",
  ]

  return {
    id: String(plan.id),
    name: plan.name,
    description:
      plan.status === "Destaque"
        ? "Plano recomendado para manter cabelo e barba sempre alinhados."
        : "Plano para manter sua rotina de cuidados em dia.",
    price: plan.price,
    billingCycle: plan.recurrence.toLowerCase().includes("anual")
      ? "annual"
      : "monthly",
    benefits,
    isRecommended: plan.status === "Destaque",
  }
}

function getDefaultClientPortalState(
  data: ClientPortalData
): ClientPortalState {
  const service = data.services[0]
  const professional = data.professionals[0]
  const appointmentDate = toDateInputValue(addDays(new Date(), 5))

  return {
    profile: {
      id: "client_1",
      name: "Gabriel Silva",
      phone: "(11) 98765-4321",
      email: "gabriel@email.com",
      birthDate: "1994-05-12",
      cpf: "",
      gender: "",
      contactPreferences: {
        whatsapp: true,
        email: true,
        sms: false,
      },
    },
    appointments:
      service && professional
        ? [
            {
              id: "appointment_demo",
              status: "confirmed",
              serviceId: service.id,
              serviceName: service.name,
              professionalId: professional.id,
              professionalName: professional.name,
              date: appointmentDate,
              time: "15:30",
              price: service.price,
              address: data.company?.address,
              notes: "Chegue 5 minutos antes do horario.",
            },
          ]
        : [],
    subscription: null,
  }
}
