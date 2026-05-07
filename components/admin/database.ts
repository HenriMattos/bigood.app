import { BIGOOD_PORTAL_ICON, BIGOOD_PORTAL_LOGO } from "@/lib/brand-assets"


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
  corporateName: "Bigood Tecnologia LTDA",
  tradeName: "Bigood",
  cnpj: "12.345.678/0001-90",
  email: "contato@bigood.com.br",
  timezone: "America/Sao_Paulo",
  phone: "(11) 98765-4321",
  slug: "bigood",
  primaryColor: { r: 145, g: 230, b: 104 },
  logoUrl: BIGOOD_PORTAL_LOGO,
  logoAlt: "Bigood Logo",
  iconUrl: BIGOOD_PORTAL_ICON,
  chairs: ["Cadeira 01"],
  professionalRoles: ["Barbeiro", "Proprietario"],
  serviceCategories: ["Cabelo", "Barba", "Combo"],
  address: {
    street: "Av. Paulista",
    number: "1000",
    neighborhood: "Bela Vista",
    city: "Sao Paulo",
    state: "SP",
    zip: "01310-100",
    mapsUrl: "https://maps.google.com",
  },
  social: {
    instagram: "bigood.app",
    whatsapp: "11987654321",
    facebook: "bigood.app",
  },
}

export type RevenueDay = {
  day: string
  weekday: string
  gross: number
  net: number
  previous: number
  appointments: number
}

export type PeakHour = {
  time: string
  appointments: number
  revenue: number
  occupancy: number
}

const services: ServiceCatalogItem[] = [
  {
    id: 1,
    name: "Corte Simetria",
    category: "Cabelo",
    duration: "45 min",
    durationMinutes: 45,
    price: 60,
    credits: 1,
    repurchaseDays: 20,
    professionals: "Paulo Jean jr",
    status: "Ativo",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    hidden: false,
    fitIn: true,
    startingFrom: false,
    featured: true,
    order: 1,
  },
  {
    id: 2,
    name: "Barba Terapia",
    category: "Barba",
    duration: "30 min",
    durationMinutes: 30,
    price: 45,
    credits: 1,
    repurchaseDays: 15,
    professionals: "Paulo Jean jr",
    status: "Ativo",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    hidden: false,
    fitIn: true,
    startingFrom: false,
    featured: false,
    order: 2,
  },
]

const plans: Plan[] = [
  {
    id: 1,
    name: "Essencial",
    benefit: "2 cortes por mes",
    price: 80,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 2,
    churnRisk: "Baixo",
  },
  {
    id: 2,
    name: "Vip Simetria",
    benefit: "Corte e Barba Ilimitados",
    price: 120,
    status: "Destaque",
    recurrence: "Mensal",
    servicesLimit: 8,
    churnRisk: "Baixo",
  },
]

const professionals: Professional[] = [
  {
    id: 1,
    name: "Paulo Jean jr",
    role: "Proprietario / Barbeiro",
    commission: "100%",
    scheduleStart: "09:00",
    scheduleEnd: "19:00",
    status: "Ativo",
  },
]

// Gerando 45 assinantes
const firstNames = [
  "Gabriel",
  "Lucas",
  "Mateus",
  "Felipe",
  "Thiago",
  "Ricardo",
  "Anderson",
  "Bruno",
  "Caio",
  "Daniel",
  "Eduardo",
  "Fabio",
  "Gustavo",
  "Henrique",
  "Igor",
  "Joao",
  "Kevin",
  "Leonardo",
  "Marcos",
  "Nathan",
  "Otavio",
  "Pedro",
  "Rafael",
  "Samuel",
  "Vitor",
  "Yuri",
  "Willian",
  "Zeca",
  "Alex",
  "Beto",
  "Cristiano",
  "Diego",
  "Erick",
  "Fernando",
  "Gilberto",
  "Hugo",
  "Italo",
  "Jorge",
  "Luiz",
  "Marcelo",
  "Nilton",
  "Osmar",
  "Paulo",
  "Quirino",
  "Renato",
]
const lastNames = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Rodrigues",
  "Ferreira",
  "Alves",
  "Pereira",
  "Lima",
  "Gomes",
  "Costa",
  "Ribeiro",
  "Martins",
  "Carvalho",
  "Almeida",
  "Lopes",
  "Soares",
  "Fernandes",
  "Vieira",
  "Barbosa",
  "Rocha",
  "Dias",
  "Nascimento",
  "Andrade",
  "Moreira",
  "Nunes",
  "Marques",
  "Machado",
  "Mendes",
  "Freitas",
  "Cardoso",
  "Ramos",
  "Santana",
  "Teixeira",
  "Moura",
  "Cavalcante",
  "Dias",
  "Castro",
  "Borges",
  "Campos",
]

const clients: Client[] = firstNames.slice(0, 45).map((firstName, i) => ({
  id: i + 1,
  name: `${firstName} ${lastNames[i % lastNames.length]}`,
  phone: `(11) 9${Math.floor(10000000 + Math.random() * 90000000)}`,
  email: `${firstName.toLowerCase()}@email.com`,
  visits: 12 + i,
  averageTicket: i % 2 === 0 ? 80 : 120,
  status: "recorrente",
  lastVisit: toDateInputValue(
    addDays(new Date(), -Math.floor(Math.random() * 15))
  ),
  favoriteService: i % 3 === 0 ? "Barba Terapia" : "Corte Simetria",
  active: true,
  createdAt: "2023-05-01",
  planName: i % 2 === 0 ? "Essencial" : "Vip Simetria",
}))

const subscriptions: Subscription[] = clients.map((client, i) => ({
  id: i + 1,
  clientId: client.id,
  client: client.name,
  phone: client.phone,
  plan: client.planName!,
  value: client.averageTicket,
  nextCharge: toDateInputValue(
    addDays(new Date(), Math.floor(Math.random() * 20))
  ),
  startedAt: "2023-06-01",
  status: "Ativa",
}))

const todayInput = toDateInputValue(new Date())

const agendaEvents: AgendaEvent[] = [
  {
    id: 1,
    barber: "Paulo Jean jr",
    date: todayInput,
    start: "09:00",
    end: "09:45",
    title: "Gabriel Silva",
    detail: "Corte Simetria",
    type: "appointment",
  },
  {
    id: 2,
    barber: "Paulo Jean jr",
    date: todayInput,
    start: "10:00",
    end: "10:30",
    title: "Lucas Santos",
    detail: "Barba Terapia",
    type: "appointment",
  },
  {
    id: 3,
    barber: "Paulo Jean jr",
    date: todayInput,
    start: "11:00",
    end: "11:45",
    title: "Mateus Oliveira",
    detail: "Corte Simetria",
    type: "appointment",
  },
]

const comandas: Comanda[] = [
  {
    id: "CMD-001",
    time: "09:45",
    client: "Gabriel Silva",
    barber: "Paulo Jean jr",
    chair: "Cadeira 01",
    status: "paga",
    payment: "Pix",
    items: [
      {
        name: "Corte Simetria",
        quantity: 1,
        unitPrice: 60,
        category: "servico",
      },
    ],
  },
]

const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Dinheiro",
    description: "Pagamento em especie",
    status: "Ativo",
    fee: 0,
    settlement: "Imediato",
    amount: 150,
    transactions: 3,
  },
  {
    id: 2,
    name: "Pix",
    description: "Transferencia instantanea",
    status: "Ativo",
    fee: 0,
    settlement: "Imediato",
    amount: 850,
    transactions: 12,
  },
  {
    id: 3,
    name: "Cartao de credito",
    description: "Maquininha Stone",
    status: "Ativo",
    fee: 3.5,
    settlement: "D+1",
    amount: 1200,
    transactions: 15,
  },
]

const revenueWeek: RevenueDay[] = [
  {
    day: "01/05",
    weekday: "Seg",
    gross: 120,
    net: 115,
    previous: 110,
    appointments: 2,
  },
  {
    day: "02/05",
    weekday: "Ter",
    gross: 180,
    net: 175,
    previous: 150,
    appointments: 3,
  },
  {
    day: "03/05",
    weekday: "Qua",
    gross: 150,
    net: 145,
    previous: 160,
    appointments: 3,
  },
  {
    day: "04/05",
    weekday: "Qui",
    gross: 200,
    net: 190,
    previous: 180,
    appointments: 4,
  },
  {
    day: "05/05",
    weekday: "Sex",
    gross: 250,
    net: 240,
    previous: 230,
    appointments: 5,
  },
  {
    day: "06/05",
    weekday: "Sab",
    gross: 350,
    net: 335,
    previous: 320,
    appointments: 7,
  },
  {
    day: "07/05",
    weekday: "Dom",
    gross: 0,
    net: 0,
    previous: 0,
    appointments: 0,
  },
]

const peakHours: PeakHour[] = [
  { time: "09:00", appointments: 4, revenue: 240, occupancy: 80 },
  { time: "10:00", appointments: 3, revenue: 180, occupancy: 65 },
  { time: "11:00", appointments: 5, revenue: 300, occupancy: 95 },
  { time: "14:00", appointments: 2, revenue: 120, occupancy: 55 },
  { time: "15:00", appointments: 4, revenue: 240, occupancy: 75 },
  { time: "16:00", appointments: 5, revenue: 300, occupancy: 100 },
  { time: "17:00", appointments: 4, revenue: 240, occupancy: 85 },
  { time: "18:00", appointments: 3, revenue: 180, occupancy: 65 },
]

export const database = {
  company,
  services,
  plans,
  clients,
  subscriptions,
  overdueSubscriptions: [] as OverdueSubscription[],
  professionals,
  products: [] as Product[],
  agendaEvents,
  comandas,
  cashMovements: [] as CashMovement[],
  bankAccounts: [] as BankAccount[],
  financialCategories: [] as FinancialCategory[],
  financialMovements: [] as FinancialMovement[],
  paymentMethods,
  analytics: {
    activeClients: 85,
    newClientsThisMonth: 8,
    recurringClients: 45,
    clientsWithoutPlan: 40,
    activeSubscriptions: 45,
    servicesCompletedThisMonth: 65,
    averageTicket: 95,
    monthlyServiceRevenue: 1500,
    monthlyRecurringRevenue: 4300,
    monthlyProductRevenue: 200,
    monthlyGrossRevenue: 6000,
    monthlyExpenses: 2800,
    monthlyNetRevenue: 3200,
    paymentFeesEstimated: 120,
    overdueAmount: 80,
    revenueWeek,
    revenuePeriod: {
      label: "Esta semana",
      comparison: "Semana passada",
    },
    peakHours,
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
