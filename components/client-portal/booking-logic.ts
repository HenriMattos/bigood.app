import type {
  AgendaEvent,
  Plan,
  ServiceCatalogItem,
} from "@/components/admin/database"

export type BookingStep = "service" | "extras" | "professional" | "datetime" | "confirm"

export type BookingServiceLine = {
  service: ServiceCatalogItem
  kind: "plan" | "extra" | "regular"
  finalPrice: number
  discountPercent: number
}

export const BOOKING_STEPS: { id: BookingStep; label: string }[] = [
  { id: "service", label: "Serviço" },
  { id: "extras", label: "Extras" },
  { id: "professional", label: "Profissional" },
  { id: "datetime", label: "Data e hora" },
  { id: "confirm", label: "Confirmar" },
]

export function getBookingFlow(hasSubscription: boolean) {
  return hasSubscription
    ? BOOKING_STEPS
    : BOOKING_STEPS.filter((step) => step.id !== "extras")
}

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

export function getCompanyDisplayName(value: string) {
  const normalized = value.trim()
  return !normalized || normalized === "Empresa sem nome definido"
    ? "Empresa"
    : normalized
}

export function getEndTime(start: string, durationMinutes: number) {
  const [h, m] = start.split(":").map(Number)
  const d = new Date()
  d.setHours(h, m + durationMinutes, 0, 0)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export function getMinutesBetween(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number)
  const [endHour, endMinute] = end.split(":").map(Number)
  return endHour * 60 + endMinute - (startHour * 60 + startMinute)
}

export function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}

export function formatShortDate(v: string) {
  const [y, m, d] = v.split("-").map(Number)
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(y, m - 1, d)
  )
}

export function formatLongDate(v: string) {
  const [y, m, d] = v.split("-").map(Number)
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(y, m - 1, d))
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value)
}

export function getPlanServiceIds(
  services: ServiceCatalogItem[],
  planName?: string
) {
  const normalizedPlan = normalizeText(planName ?? "")

  if (!normalizedPlan) return []

  if (normalizedPlan.includes("integral")) {
    return services.map((service) => service.id)
  }

  if (normalizedPlan.includes("completo")) {
    return services
      .filter((service) =>
        ["barba", "cabelo", "combo"].some((category) =>
          normalizeText(service.category).includes(category)
        )
      )
      .map((service) => service.id)
  }

  if (normalizedPlan.includes("barba")) {
    return services
      .filter((service) =>
        normalizeText(`${service.name} ${service.category}`).includes("barba")
      )
      .map((service) => service.id)
  }

  return services
    .filter((service) => {
      const searchable = normalizeText(`${service.name} ${service.category}`)
      return (
        service.credits <= 1 &&
        service.price <= 65 &&
        (searchable.includes("barba") || searchable.includes("cabelo"))
      )
    })
    .map((service) => service.id)
}

export function getBookingServiceLine(
  service: ServiceCatalogItem,
  planServiceIds: number[],
  hasSubscription: boolean,
  remainingPlanCredits = Number.POSITIVE_INFINITY
): BookingServiceLine {
  if (
    hasSubscription &&
    planServiceIds.includes(service.id) &&
    remainingPlanCredits >= service.credits
  ) {
    return {
      service,
      kind: "plan",
      finalPrice: 0,
      discountPercent: 100,
    }
  }

  if (hasSubscription) {
    return {
      service,
      kind: "extra",
      finalPrice: roundCurrency(service.price * 0.8),
      discountPercent: 20,
    }
  }

  return {
    service,
    kind: "regular",
    finalPrice: service.price,
    discountPercent: 0,
  }
}

export function getAppointmentService(
  appointment: AgendaEvent,
  activeServices: ServiceCatalogItem[]
) {
  return activeServices.find((item) =>
    normalizeText(appointment.detail).includes(normalizeText(item.name))
  )
}

export function getAppointmentDuration(
  appointment: AgendaEvent,
  activeServices: ServiceCatalogItem[]
) {
  const service = getAppointmentService(appointment, activeServices)
  return service?.durationMinutes ?? getMinutesBetween(appointment.start, appointment.end)
}

export function getAppointmentCreatedAt(appointment: AgendaEvent) {
  return appointment.id > 1_000_000_000_000 ? new Date(appointment.id) : null
}

export function getCancelDeadline(appointment: AgendaEvent) {
  const createdAt = getAppointmentCreatedAt(appointment)
  return createdAt ? new Date(createdAt.getTime() + 60 * 60 * 1000) : null
}

export function isAppointmentCancelable(appointment: AgendaEvent) {
  const deadline = getCancelDeadline(appointment)
  return Boolean(deadline && Date.now() <= deadline.getTime())
}

export function getUsedPlanCredits(
  planServiceIds: number[],
  activeServices: ServiceCatalogItem[],
  customerName: string | undefined,
  agendaEvents: AgendaEvent[],
  extraAppointments: AgendaEvent[]
) {
  const appointments = agendaEvents.filter(
    (event) => event.title === customerName && event.type === "appointment"
  )
  const allAppointments = [...extraAppointments, ...appointments]

  return allAppointments.reduce((total, appointment) => {
    const normalizedDetail = normalizeText(appointment.detail)
    const matchedServices = activeServices.filter(
      (service) =>
        planServiceIds.includes(service.id) &&
        normalizedDetail.includes(normalizeText(service.name))
    )

    return (
      total +
      matchedServices.reduce((sum, service) => sum + service.credits, 0)
    )
  }, 0)
}

export function getCanContinueBooking({
  step,
  selectedServiceIds,
  professionalId,
  time,
  hasSubscription,
  planServiceIds,
  usedPlanCredits,
  servicesLimit,
  activeServices,
}: {
  step: BookingStep
  selectedServiceIds: number[]
  professionalId?: number
  time: string
  hasSubscription: boolean
  planServiceIds: number[]
  usedPlanCredits: number
  servicesLimit: number
  activeServices: ServiceCatalogItem[]
}) {
  if (step === "extras") return true
  if (step === "professional") return Boolean(professionalId)
  if (step === "datetime") return Boolean(time)
  if (step === "confirm") return true

  if (!hasSubscription) return selectedServiceIds.length > 0

  const remainingCredits = Math.max(servicesLimit - usedPlanCredits, 0)
  const planServiceCount = activeServices.filter(
    (service) =>
      planServiceIds.includes(service.id) && service.credits <= remainingCredits
  ).length

  if (remainingCredits <= 0 || planServiceCount === 0) return true

  return selectedServiceIds.some((id) => planServiceIds.includes(id))
}

export function getPlanBenefits(plan?: Plan) {
  const baseBenefits = [
    plan?.benefit ?? "Benefícios exclusivos ativos",
    `${plan?.servicesLimit ?? 1} atendimento(s) incluído(s) no mês`,
    "20% de desconto em serviços extras",
    "Prioridade nos melhores horários",
  ]

  return Array.from(new Set(baseBenefits))
}

export function getInitialBookingService(
  services: ServiceCatalogItem[],
  plan?: Plan
) {
  if (plan) return undefined
  return services[0]
}

export function formatSubscriptionDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value)
}

export function addMonths(value: Date, months: number) {
  const nextDate = new Date(value)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}
