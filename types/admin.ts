export type ClientStatus = "ativo" | "novo" | "recorrente" | "sem-plano"
export type ServiceStatus = "Ativo" | "Inativo"
export type PlanStatus = "Ativo" | "Destaque" | "Rascunho" | "Inativo"
export type SubscriptionStatus =
  | "Ativa"
  | "Renovacao proxima"
  | "Pausada"
  | "Em atraso"
export type ProfessionalStatus = "Ativo" | "Ferias" | "Inativo"
export type AccountStatus = "Ativa" | "Em uso" | "Inativa"
export type PaymentStatus = "Ativo" | "Inativo"
export type ComandaStatus = "aberta" | "paga" | "parcial" | "cancelada"
export type CashMovementType = "entrada" | "saida"

export type Client = {
  id: number
  name: string
  phone: string
  email: string
  visits: number
  averageTicket: number
  status: ClientStatus
  lastVisit: string
  favoriteService: string
  active: boolean
  createdAt: string
  planName?: string
}

export type ServiceCatalogItem = {
  id: number
  name: string
  category: string
  duration: string
  durationMinutes: number
  price: number
  credits: number
  repurchaseDays: number
  professionals: string
  status: ServiceStatus
  createdAt: string
  updatedAt: string
  hidden: boolean
  fitIn: boolean
  startingFrom: boolean
  featured: boolean
  order: number
}

export type Plan = {
  id: number
  name: string
  benefit: string
  price: number
  status: PlanStatus
  recurrence: string
  servicesLimit: number
  churnRisk: "Baixo" | "Medio" | "Alto"
}

export type Subscription = {
  id: number
  clientId: number
  client: string
  phone: string
  plan: string
  value: number
  nextCharge: string
  startedAt: string
  status: SubscriptionStatus
}

export type OverdueSubscription = {
  id: number
  client: string
  plan: string
  value: number
  delay: string
  status: "Em atraso" | "Critico" | "Cobranca enviada"
  phone: string
}

export type Professional = {
  id: number
  name: string
  role: string
  commission: string
  scheduleStart: string
  scheduleEnd: string
  status: ProfessionalStatus
}

export type Product = {
  id: number
  name: string
  category: string
  price: number
}

export type AgendaEvent = {
  id: number
  barber: string
  date: string
  start: string
  end: string
  title: string
  detail: string
  type: "appointment" | "blocked" | "break" | "unavailable"
}

export type ComandaItem = {
  name: string
  quantity: number
  unitPrice: number
  category: "servico" | "produto"
}

export type Comanda = {
  id: string
  time: string
  client: string
  barber: string
  chair: string
  status: ComandaStatus
  payment: string
  items: ComandaItem[]
  discount?: number
  notes?: string
}

export type CashMovement = {
  id: string
  type: CashMovementType
  label: string
  category: string
  value: number
  payment: string
  time: string
}

export type PaymentMethod = {
  id: number
  name: string
  description: string
  status: PaymentStatus
  fee: number
  settlement: string
  amount: number
  transactions: number
}
