export type ClientStatus = "ativo" | "novo" | "recorrente" | "sem-plano"
export type ServiceStatus = "Ativo" | "Inativo"
export type PlanStatus = "Ativo" | "Destaque" | "Rascunho" | "Inativo"
export type SubscriptionStatus =
  | "Ativa"
  | "Renovacao proxima"
  | "Pausada"
  | "Em atraso"
export type ProfessionalStatus = "Ativo" | "Ferias" | "Inativo"
export type FinancialType = "Receita" | "Despesa"
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

export type FinancialMovement = {
  id: number
  date: string
  description: string
  category: string
  account: string
  amount: number
  type: FinancialType
}

export type BankAccount = {
  id: number
  name: string
  agency: string
  account: string
  type: string
  balance: number
  status: AccountStatus
}

export type FinancialCategory = {
  id: number
  name: string
  description: string
  type: FinancialType
  monthlyAmount: number
  trend: number
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

const company = {
  corporateName: "",
  tradeName: "",
  cnpj: "",
  email: "",
  timezone: "America/Sao_Paulo",
  phone: "",
  slug: "",
  primaryColor: { r: 145, g: 230, b: 104 },
  logoUrl: "",
  logoAlt: "",
  iconUrl: "",
  carouselImage1: "",
  carouselImage2: "",
  carouselImage3: "",
  introTitle1: "",
  introSubtitle1: "",
  introTitle2: "",
  introSubtitle2: "",
  introTitle3: "",
  introSubtitle3: "",
  chairs: [] as string[],
  professionalRoles: [] as string[],
  serviceCategories: [] as string[],
}

type RevenueDay = {
  day: string
  weekday: string
  gross: number
  net: number
  previous: number
  appointments: number
}

type PeakHour = {
  time: string
  appointments: number
  revenue: number
  occupancy: number
}

export const database = {
  company,
  services: [] as ServiceCatalogItem[],
  plans: [] as Plan[],
  clients: [] as Client[],
  subscriptions: [] as Subscription[],
  overdueSubscriptions: [] as OverdueSubscription[],
  professionals: [] as Professional[],
  products: [] as Product[],
  agendaEvents: [] as AgendaEvent[],
  comandas: [] as Comanda[],
  cashMovements: [] as CashMovement[],
  bankAccounts: [] as BankAccount[],
  financialCategories: [] as FinancialCategory[],
  financialMovements: [] as FinancialMovement[],
  paymentMethods: [] as PaymentMethod[],
  analytics: {
    activeClients: 0,
    newClientsThisMonth: 0,
    recurringClients: 0,
    clientsWithoutPlan: 0,
    activeSubscriptions: 0,
    servicesCompletedThisMonth: 0,
    averageTicket: 0,
    monthlyServiceRevenue: 0,
    monthlyRecurringRevenue: 0,
    monthlyProductRevenue: 0,
    monthlyGrossRevenue: 0,
    monthlyExpenses: 0,
    monthlyNetRevenue: 0,
    paymentFeesEstimated: 0,
    overdueAmount: 0,
    revenueWeek: [] as RevenueDay[],
    revenuePeriod: {
      label: "",
      comparison: "",
    },
    peakHours: [] as PeakHour[],
  },
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date)
}

export function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}