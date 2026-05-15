export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"

export type ClientPortalPaymentMethod = "card" | "pix" | "boleto" | "barbershop"

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
  paymentMethod: ClientPortalPaymentMethod
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
