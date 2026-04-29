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
  barber: "Paulo Junior" | "Paulo Jean" | "Bruno Castro"
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

const baseDate = new Date(2026, 3, 29)

const services: ServiceCatalogItem[] = [
  service(52409, "Barba", "Barba", 30, 45, 1, 15, "Paulo Jean", true, 1),
  service(52408, "Corte", "Cabelo", 35, 55, 1, 21, "Todos", true, 2),
  service(53102, "Degrade", "Cabelo", 45, 65, 1, 21, "Paulo Junior", true, 3),
  service(53104, "Corte + barba", "Combo", 60, 95, 2, 30, "Todos", true, 4),
  service(
    67662,
    "Corte e Barba Visagismo",
    "Combo",
    75,
    150,
    3,
    30,
    "Paulo Jean",
    true,
    5,
    true
  ),
  service(
    66212,
    "Corte Visagismo",
    "Cabelo",
    60,
    110,
    2,
    30,
    "Paulo Jean",
    true,
    6,
    true
  ),
  service(
    52446,
    "Depilacao Nariz (cera)",
    "Depilacao",
    15,
    25,
    1,
    30,
    "Todos",
    false,
    7
  ),
  service(52412, "Hidratacao", "Tratamentos", 30, 50, 1, 30, "Todos", false, 8),
  service(
    52520,
    "Quiropraxia",
    "Tratamentos",
    45,
    120,
    2,
    15,
    "Paulo Jean",
    false,
    9
  ),
  service(
    52415,
    "Selagem",
    "Tratamentos",
    90,
    180,
    3,
    45,
    "Paulo Jean",
    false,
    10,
    true
  ),
  service(
    52411,
    "Sobrancelha",
    "Sobrancelha",
    15,
    25,
    1,
    21,
    "Todos",
    false,
    11
  ),
]

const plans: Plan[] = [
  {
    id: 1,
    name: "Simetria Essencial",
    benefit: "1 corte mensal com prioridade de agenda",
    price: 99.9,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 1,
    churnRisk: "Baixo",
  },
  {
    id: 2,
    name: "Barba Club",
    benefit: "4 barbas por mes e manutencao expressa",
    price: 129.9,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 4,
    churnRisk: "Medio",
  },
  {
    id: 3,
    name: "Simetria Club+",
    benefit: "Corte, barba e beneficios VIP",
    price: 249.9,
    status: "Destaque",
    recurrence: "Mensal",
    servicesLimit: 6,
    churnRisk: "Baixo",
  },
  {
    id: 4,
    name: "Quiro + Visual",
    benefit: "Cuidados visuais e quiropraxia no mesmo plano",
    price: 349.9,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 8,
    churnRisk: "Baixo",
  },
]

const clients = buildClients()
const subscriptions = buildSubscriptions(clients)
const overdueSubscriptions = buildOverdueSubscriptions(subscriptions)

const professionals: Professional[] = [
  {
    id: 1,
    name: "Paulo Junior",
    role: "Barbeiro",
    commission: "40%",
    scheduleStart: "2026-04-29",
    scheduleEnd: "2026-05-29",
    status: "Ativo",
  },
  {
    id: 2,
    name: "Paulo Jean",
    role: "Barbeiro e quiropraxista",
    commission: "45%",
    scheduleStart: "2026-04-29",
    scheduleEnd: "2026-05-29",
    status: "Ativo",
  },
  {
    id: 3,
    name: "Bruno Castro",
    role: "Atendente",
    commission: "Fixo",
    scheduleStart: "2026-04-29",
    scheduleEnd: "2026-05-29",
    status: "Ativo",
  },
]

const products: Product[] = [
  { id: 1, name: "Pomada modeladora", category: "Finalizadores", price: 42 },
  { id: 2, name: "Oleo para barba", category: "Barba", price: 36 },
  { id: 3, name: "Shampoo antiqueda", category: "Cabelo", price: 58 },
  { id: 4, name: "Balm pos-barba", category: "Barba", price: 34 },
]

const agendaEvents: AgendaEvent[] = [
  appointment(1, "Paulo Junior", "09:00", "09:45", clients[0], "Corte"),
  appointment(2, "Paulo Junior", "10:00", "11:00", clients[1], "Degrade"),
  appointment(3, "Paulo Jean", "09:30", "10:45", clients[2], "Corte + barba"),
  appointment(4, "Paulo Jean", "11:00", "11:45", clients[3], "Quiropraxia"),
  {
    id: 5,
    barber: "Paulo Junior",
    date: "2026-04-29",
    start: "12:00",
    end: "13:00",
    title: "Intervalo",
    detail: "Agenda bloqueada",
    type: "break",
  },
  appointment(6, "Paulo Jean", "14:00", "15:00", clients[4], "Corte Visagismo"),
  appointment(7, "Paulo Junior", "15:30", "16:30", clients[5], "Corte + barba"),
  appointment(8, "Paulo Jean", "17:00", "18:00", clients[6], "Selagem"),
]

const comandas: Comanda[] = [
  {
    id: "CMD-2041",
    time: "09:00",
    client: clients[0].name,
    barber: "Paulo Junior",
    chair: "Cadeira 1",
    status: "paga",
    payment: "Pix",
    items: [
      item("Corte", 1, 55, "servico"),
      item("Pomada modeladora", 1, 42, "produto"),
    ],
  },
  {
    id: "CMD-2042",
    time: "10:00",
    client: clients[1].name,
    barber: "Paulo Junior",
    chair: "Cadeira 1",
    status: "aberta",
    payment: "Aguardando",
    items: [item("Degrade", 1, 65, "servico")],
  },
  {
    id: "CMD-2043",
    time: "09:30",
    client: clients[2].name,
    barber: "Paulo Jean",
    chair: "Cadeira 2",
    status: "paga",
    payment: "Cartao de credito",
    items: [item("Corte + barba", 1, 95, "servico")],
  },
  {
    id: "CMD-2044",
    time: "11:00",
    client: clients[3].name,
    barber: "Paulo Jean",
    chair: "Sala Dpote",
    status: "parcial",
    payment: "Pix",
    discount: 20,
    items: [item("Quiropraxia", 1, 120, "servico")],
    notes: "Pagamento parcial registrado no caixa.",
  },
  {
    id: "CMD-2045",
    time: "15:30",
    client: clients[5].name,
    barber: "Paulo Junior",
    chair: "Cadeira 1",
    status: "paga",
    payment: "Cartao de debito",
    items: [
      item("Corte + barba", 1, 95, "servico"),
      item("Oleo para barba", 1, 36, "produto"),
    ],
  },
]

const cashMovements: CashMovement[] = [
  {
    id: "MOV-001",
    type: "entrada",
    label: "Troco inicial",
    category: "Suprimento",
    value: 200,
    payment: "Dinheiro",
    time: "08:45",
  },
  {
    id: "MOV-002",
    type: "saida",
    label: "Reposicao de descartaveis",
    category: "Despesa operacional",
    value: 86,
    payment: "Pix",
    time: "11:20",
  },
  {
    id: "MOV-003",
    type: "saida",
    label: "Taxas de pagamento",
    category: "Taxa",
    value: 38,
    payment: "Cartao de credito",
    time: "17:40",
  },
]

const monthlyRecurringRevenue = subscriptions
  .filter((subscription) => subscription.status !== "Pausada")
  .reduce((sum, subscription) => sum + subscription.value, 0)
const serviceRevenue = clients.reduce(
  (sum, client) => sum + client.averageTicket * Math.min(client.visits, 5),
  0
)
const monthlyGrossRevenue = Math.round(
  serviceRevenue * 0.36 + monthlyRecurringRevenue
)
const monthlyExpenses = Math.round(monthlyGrossRevenue * 0.57)

const bankAccounts: BankAccount[] = [
  {
    id: 1,
    name: "Conta Corrente - Bradesco",
    agency: "1234-5",
    account: "98765-0",
    type: "Conta corrente",
    balance: 28420,
    status: "Ativa",
  },
  {
    id: 2,
    name: "Conta PJ - Itau",
    agency: "6789-0",
    account: "22334-9",
    type: "Conta corrente",
    balance: 18750.5,
    status: "Ativa",
  },
  {
    id: 3,
    name: "Cartao Corporativo",
    agency: "0001",
    account: "****-1234",
    type: "Cartao de credito",
    balance: -2250,
    status: "Em uso",
  },
]

const financialCategories: FinancialCategory[] = [
  category(
    1,
    "Receitas de Servicos",
    "Atendimentos avulsos e pacotes",
    "Receita",
    monthlyGrossRevenue - monthlyRecurringRevenue,
    9
  ),
  category(
    2,
    "Receitas de Assinaturas",
    "Planos recorrentes ativos",
    "Receita",
    monthlyRecurringRevenue,
    14
  ),
  category(
    3,
    "Receitas de Produtos",
    "Produtos de cuidado e finalizacao",
    "Receita",
    4260,
    5
  ),
  category(
    4,
    "Folha e Comissoes",
    "Pagamentos da equipe e comissoes",
    "Despesa",
    14900,
    2
  ),
  category(
    5,
    "Aluguel e Utilidades",
    "Aluguel, energia, agua e internet",
    "Despesa",
    5200,
    1
  ),
  category(
    6,
    "Estoque e Insumos",
    "Reposicao de produtos e materiais",
    "Despesa",
    3800,
    -4
  ),
]

const financialMovements: FinancialMovement[] = [
  {
    id: 1,
    date: "29/04/2026",
    description: `Recebimento - ${clients[0].name}`,
    category: "Receitas de Servicos",
    account: "Conta Corrente - Bradesco",
    amount: 97,
    type: "Receita",
  },
  {
    id: 2,
    date: "29/04/2026",
    description: "Assinaturas liquidadas - lote diario",
    category: "Receitas de Assinaturas",
    account: "Conta Corrente - Bradesco",
    amount: 1849.2,
    type: "Receita",
  },
  {
    id: 3,
    date: "29/04/2026",
    description: "Reposicao de descartaveis",
    category: "Estoque e Insumos",
    account: "Pix",
    amount: 86,
    type: "Despesa",
  },
  {
    id: 4,
    date: "28/04/2026",
    description: "Conta de energia",
    category: "Aluguel e Utilidades",
    account: "Conta PJ - Itau",
    amount: 540,
    type: "Despesa",
  },
]

const paymentMethods: PaymentMethod[] = [
  method(
    1,
    "Pix",
    "Chave PJ: 55.540.659/0001-22",
    0.49,
    "Imediato",
    18420,
    118
  ),
  method(
    2,
    "Cartao de credito",
    "Visa, Mastercard e Elo",
    3.49,
    "30 dias",
    13980,
    74
  ),
  method(
    3,
    "Cartao de debito",
    "Visa, Mastercard e Elo",
    1.69,
    "1 dia util",
    8520,
    51
  ),
  method(
    4,
    "Dinheiro",
    "Pagamento presencial no caixa",
    0,
    "Imediato",
    4560,
    36
  ),
  method(
    5,
    "Cobranca online",
    "Links de assinatura e cobranca",
    3.49,
    "2 dias uteis",
    monthlyRecurringRevenue,
    subscriptions.length
  ),
]

const revenueWeek = [
  { day: "23/04", weekday: "Qui", gross: 1810, net: 1539, previous: 1490 },
  { day: "24/04", weekday: "Sex", gross: 1980, net: 1683, previous: 1720 },
  { day: "25/04", weekday: "Sab", gross: 2540, net: 2159, previous: 1870 },
  { day: "26/04", weekday: "Dom", gross: 760, net: 646, previous: 680 },
  { day: "27/04", weekday: "Seg", gross: 1680, net: 1428, previous: 1100 },
  { day: "28/04", weekday: "Ter", gross: 2140, net: 1819, previous: 1420 },
  { day: "29/04", weekday: "Qua", gross: 2320, net: 1972, previous: 1560 },
]

const peakHours = [
  { time: "09:00", appointments: 42, revenue: 2980, occupancy: 68 },
  { time: "10:00", appointments: 58, revenue: 4310, occupancy: 81 },
  { time: "11:00", appointments: 51, revenue: 3890, occupancy: 76 },
  { time: "12:00", appointments: 18, revenue: 1210, occupancy: 32 },
  { time: "13:00", appointments: 29, revenue: 2040, occupancy: 48 },
  { time: "14:00", appointments: 46, revenue: 3420, occupancy: 71 },
  { time: "15:00", appointments: 64, revenue: 4920, occupancy: 88 },
  { time: "16:00", appointments: 72, revenue: 5580, occupancy: 94 },
  { time: "17:00", appointments: 69, revenue: 5290, occupancy: 91 },
  { time: "18:00", appointments: 37, revenue: 2760, occupancy: 62 },
]

export const database = {
  company: {
    corporateName: "Paulo Jean Barros Ferreira Junior",
    tradeName: "Studio Simetria",
    cnpj: "55.540.659/0001-22",
    email: "paulojeanbarbeiro@gmail.com",
    timezone: "America/Manaus",
    phone: "5592994592664",
    slug: "studiosimetria",
    primaryColor: { r: 150, g: 229, b: 110 },
  },
  services,
  plans,
  clients,
  subscriptions,
  overdueSubscriptions,
  professionals,
  products,
  agendaEvents,
  comandas,
  cashMovements,
  bankAccounts,
  financialCategories,
  financialMovements,
  paymentMethods,
  analytics: {
    activeClients: clients.filter((client) => client.active).length,
    newClientsThisMonth: clients.filter((client) =>
      client.createdAt.startsWith("2026-04")
    ).length,
    recurringClients: clients.filter((client) => client.status === "recorrente")
      .length,
    clientsWithoutPlan: clients.filter(
      (client) => client.status === "sem-plano"
    ).length,
    activeSubscriptions: subscriptions.filter(
      (subscription) => subscription.status === "Ativa"
    ).length,
    monthlyRecurringRevenue,
    monthlyGrossRevenue,
    monthlyExpenses,
    monthlyNetRevenue: Math.round(monthlyGrossRevenue * 0.888),
    overdueAmount: overdueSubscriptions.reduce(
      (sum, item) => sum + item.value,
      0
    ),
    revenueWeek,
    revenuePeriod: {
      label: "23/04/2026 a 29/04/2026",
      comparison: "16/04/2026 a 22/04/2026",
    },
    peakHours,
  },
}

function service(
  id: number,
  name: string,
  category: string,
  durationMinutes: number,
  price: number,
  credits: number,
  repurchaseDays: number,
  professionals: string,
  featured: boolean,
  order: number,
  startingFrom = false
): ServiceCatalogItem {
  return {
    id,
    name,
    category,
    duration: `${durationMinutes} min`,
    durationMinutes,
    price,
    credits,
    repurchaseDays,
    professionals,
    status: "Ativo",
    createdAt: "10/07/2025 10:00",
    updatedAt: "29/04/2026 09:00",
    hidden: false,
    fitIn: durationMinutes <= 45,
    startingFrom,
    featured,
    order,
  }
}

function buildClients(): Client[] {
  const firstNames = [
    "Rafael",
    "Mateus",
    "Pedro",
    "Lucas",
    "Thiago",
    "Gabriel",
    "Felipe",
    "Joao",
    "Carlos",
    "Bruno",
    "Marcos",
    "Daniel",
    "Gustavo",
    "Leonardo",
    "Vinicius",
    "Eduardo",
    "Andre",
    "Rodrigo",
    "Henrique",
    "Caio",
  ]
  const lastNames = [
    "Lima",
    "Alves",
    "Santos",
    "Rocha",
    "Martins",
    "Souza",
    "Barbosa",
    "Ferreira",
    "Mendes",
    "Castro",
    "Oliveira",
    "Nunes",
    "Pereira",
    "Gomes",
    "Ribeiro",
    "Carvalho",
    "Moreira",
    "Teixeira",
    "Araujo",
    "Costa",
  ]

  return Array.from({ length: 100 }, (_, index) => {
    const plan = index < 72 ? plans[index % plans.length] : undefined
    const serviceRef = services[(index * 3) % services.length]
    const visits = 4 + ((index * 7) % 34)
    const status: ClientStatus = plan
      ? "recorrente"
      : visits <= 6
        ? "novo"
        : index % 4 === 0
          ? "sem-plano"
          : "ativo"

    return {
      id: 1001 + index,
      name: `${firstNames[index % firstNames.length]} ${
        lastNames[
          (index * 7 + Math.floor(index / firstNames.length)) % lastNames.length
        ]
      }`,
      phone: `(92) 9${String(94000000 + index * 1371).slice(0, 8)}`,
      email: `cliente${String(index + 1).padStart(3, "0")}@studiosimetria.com.br`,
      visits,
      averageTicket: serviceRef.price + 18 + ((index * 5) % 38),
      status,
      lastVisit: toDisplayDate(addDays(baseDate, -((index * 3) % 54))),
      favoriteService: serviceRef.name,
      active: true,
      createdAt: toDisplayDate(addDays(baseDate, -((index * 11) % 95))),
      planName: plan?.name,
    }
  })
}

function buildSubscriptions(sourceClients: Client[]): Subscription[] {
  return sourceClients.slice(0, 72).map((client, index) => {
    const plan = plans[index % plans.length]
    const status: SubscriptionStatus =
      index % 19 === 0
        ? "Em atraso"
        : index % 17 === 0
          ? "Pausada"
          : index % 7 === 0
            ? "Renovacao proxima"
            : "Ativa"

    return {
      id: 5001 + index,
      clientId: client.id,
      client: client.name,
      phone: client.phone,
      plan: plan.name,
      value: plan.price,
      nextCharge: toDisplayDate(addDays(baseDate, 1 + ((index * 2) % 28))),
      startedAt: toDisplayDate(addDays(baseDate, -(30 + index * 3))),
      status,
    }
  })
}

function buildOverdueSubscriptions(
  sourceSubscriptions: Subscription[]
): OverdueSubscription[] {
  return sourceSubscriptions
    .filter((subscription) => subscription.status === "Em atraso")
    .map((subscription, index) => ({
      id: subscription.id,
      client: subscription.client,
      plan: subscription.plan,
      value: subscription.value,
      delay: `${5 + index * 4} dias`,
      status: index % 2 === 0 ? "Em atraso" : "Critico",
      phone: subscription.phone,
    }))
}

function appointment(
  id: number,
  barber: AgendaEvent["barber"],
  start: string,
  end: string,
  client: Client,
  detail: string
): AgendaEvent {
  return {
    id,
    barber,
    date: "2026-04-29",
    start,
    end,
    title: client.name,
    detail,
    type: "appointment",
  }
}

function item(
  name: string,
  quantity: number,
  unitPrice: number,
  category: ComandaItem["category"]
): ComandaItem {
  return { name, quantity, unitPrice, category }
}

function category(
  id: number,
  name: string,
  description: string,
  type: FinancialType,
  monthlyAmount: number,
  trend: number
): FinancialCategory {
  return { id, name, description, type, monthlyAmount, trend }
}

function method(
  id: number,
  name: string,
  description: string,
  fee: number,
  settlement: string,
  amount: number,
  transactions: number
): PaymentMethod {
  return {
    id,
    name,
    description,
    status: "Ativo",
    fee,
    settlement,
    amount,
    transactions,
  }
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date)
}
