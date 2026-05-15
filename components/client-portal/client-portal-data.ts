export type {
  AppointmentStatus,
  ClientPortalPaymentMethod,
  BarberCompany,
  ClientPortalService,
  ClientPortalProfessional,
  ClientPortalPlan,
  ClientPortalAppointment,
  ClientProfile,
  ClientSubscription,
  ClientPortalState,
  ClientPortalData,
} from "@/types"

import { adminService } from "@/services/admin"
import { readStringStorage } from "@/services/company"
import {
  COMPANY_LOGO_STORAGE_KEY,
  COMPANY_PORTAL_BANNER_STORAGE_KEY,
  COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY,
  COMPANY_PORTAL_ENABLED_STORAGE_KEY,
  COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY,
  COMPANY_PORTAL_SLOGAN_STORAGE_KEY,
  COMPANY_PORTAL_SLUG_STORAGE_KEY,
} from "@/services/company"
import { getStoredCommercialPlans } from "@/components/company/commercial-storage"
import type {
  ClientPortalService,
  ClientPortalProfessional,
  ClientPortalPlan,
  ClientPortalData,
  ClientPortalState,
  Plan,
} from "@/types"

const DEFAULT_CLIENT_PORTAL_BANNER_URL =
  "https://images.pexels.com/photos/7518738/pexels-photo-7518738.jpeg"
const DEMO_BARBERSHOP_SLUG = "barbearia-vip"

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

export function getClientPortalData(slug: string): ClientPortalData {
  const companySlug =
    readStringStorage(COMPANY_PORTAL_SLUG_STORAGE_KEY) ||
    adminService.company.slug ||
    "bigood"
  const portalEnabled =
    readStringStorage(COMPANY_PORTAL_ENABLED_STORAGE_KEY) !== "false"

  if (slug !== companySlug || !portalEnabled) {
    return { company: null, services: [], professionals: [], plans: [] }
  }

  return {
    company: {
      id: "company_1",
      slug: companySlug,
      name: adminService.company.tradeName || "Bigood",
      slogan:
        readStringStorage(COMPANY_PORTAL_SLOGAN_STORAGE_KEY) ||
        "Cabelo, barba e cuidado no seu tempo.",
      description:
        readStringStorage(COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY) ||
        "Experiencia premium para agendar, acompanhar planos e cuidar do visual sem mensagens soltas.",
      logoUrl:
        readStringStorage(COMPANY_LOGO_STORAGE_KEY) ||
        adminService.company.logoUrl,
      bannerUrl:
        readStringStorage(COMPANY_PORTAL_BANNER_STORAGE_KEY) ||
        DEFAULT_CLIENT_PORTAL_BANNER_URL,
      address: [
        adminService.company.address.street,
        adminService.company.address.number,
        adminService.company.address.neighborhood,
        adminService.company.address.city,
        adminService.company.address.state,
      ]
        .filter(Boolean)
        .join(", "),
      phone: adminService.company.phone,
      whatsapp: adminService.company.social.whatsapp,
      instagram: adminService.company.social.instagram,
      openingHours:
        readStringStorage(COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY) ||
        "Seg a Sab, 09:00 as 19:00",
    },
    services: adminService.services
      .filter((service) => service.status === "Ativo" && !service.hidden)
      .sort((first, second) => first.order - second.order)
      .map(
        (service): ClientPortalService => ({
          id: String(service.id),
          name: service.name,
          description: `${service.category} com ${service.professionals}`,
          durationMinutes: service.durationMinutes,
          price: service.price,
          isAvailable: true,
        })
      ),
    professionals: adminService.professionals
      .filter((professional) => professional.status === "Ativo")
      .map(
        (professional): ClientPortalProfessional => ({
          id: String(professional.id),
          name: professional.name,
          role: professional.role,
        })
      ),
    plans: getStoredCommercialPlans(adminService.plans).map(mapPlan),
  }
}

export function readClientPortalState(
  slug: string,
  data: ClientPortalData
): ClientPortalState {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(getClientPortalStorageKey(slug))
      if (raw) {
        const parsed = JSON.parse(raw) as ClientPortalState
        const isEmptyDemoState =
          slug === DEMO_BARBERSHOP_SLUG &&
          !parsed.profile.email &&
          parsed.appointments.length === 0 &&
          !parsed.subscription

        return isEmptyDemoState
          ? getDefaultClientPortalState(slug, data)
          : parsed
      }
    } catch {
      return getDefaultClientPortalState(slug, data)
    }
  }

  return getDefaultClientPortalState(slug, data)
}

export function saveClientPortalState(slug: string, state: ClientPortalState) {
  if (typeof window === "undefined") return
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

function getDefaultClientPortalState(
  slug?: string,
  data?: ClientPortalData
): ClientPortalState {
  if (slug === DEMO_BARBERSHOP_SLUG) {
    const plan =
      data?.plans.find((item) => item.name.includes("Barba")) ?? data?.plans[0]
    const service =
      data?.services.find((item) => item.name.includes("Corte")) ??
      data?.services[0]
    const professional = data?.professionals[0]

    return {
      profile: {
        id: "client_demo_001",
        name: "Henrique Demo",
        phone: "(11) 98888-0101",
        email: "cliente@barbeariavip.com",
        birthDate: "1994-08-12",
        cpf: "123.456.789-00",
        gender: "Masculino",
        contactPreferences: { whatsapp: true, email: true, sms: false },
      },
      appointments:
        service && professional
          ? [
              {
                id: "appointment_demo_001",
                status: "confirmed",
                serviceId: service.id,
                serviceName: service.name,
                professionalId: professional.id,
                professionalName: professional.name,
                date: toDateInputValue(addDays(new Date(), 2)),
                time: "10:00",
                price: service.price,
                address: data?.company?.address,
                notes: "Proximo horario do cliente demo.",
              },
            ]
          : [],
      subscription: plan
        ? {
            planId: plan.id,
            planName: plan.name,
            status: "active",
            startedAt: "2026-01-15",
            renewsAt: getNextRenewalDate(),
            price: plan.price,
            paymentMethod: "card",
            benefits: plan.benefits,
          }
        : null,
    }
  }

  return {
    profile: {
      id: "",
      name: "",
      phone: "",
      email: "",
      birthDate: "",
      cpf: "",
      gender: "",
      contactPreferences: { whatsapp: false, email: false, sms: false },
    },
    appointments: [],
    subscription: null,
  }
}
