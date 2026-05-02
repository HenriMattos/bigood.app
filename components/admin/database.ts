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

const baseDate = new Date(2026, 3, 29)

const companyLogoUrl = "https://images.unsplash.com/photo-1621605815841-aa88c82b0ad2?q=80&w=200&auto=format&fit=crop"

const company = {
  corporateName: "Empresa demonstrativa",
  tradeName: "Mydash Barber",
  cnpj: "00.000.000/0000-00",
  email: "contato@example.test",
  timezone: "America/Sao_Paulo",
  phone: "00000000000",
  slug: "empresa",
  primaryColor: { r: 145, g: 230, b: 104 },
  logoUrl: companyLogoUrl,
  logoAlt: "Logo da empresa",
  iconUrl: companyLogoUrl,
  carouselImage1: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop",
  carouselImage2: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop",
  carouselImage3: "https://images.unsplash.com/photo-1621605815841-aa88c82b0ad2?q=80&w=1000&auto=format&fit=crop",
  introTitle1: "Experiência Premium",
  introSubtitle1: "Transforme seu visual com os melhores profissionais da região.",
  introTitle2: "Estilo & Conforto",
  introSubtitle2: "Um ambiente exclusivo pensado para o seu bem-estar.",
  introTitle3: "Agendamento Simples",
  introSubtitle3: "Marque seu horário em segundos, de onde estiver.",
}

const professionalNames = ["Profissional 1", "Profissional 2", "Atendimento"]

const services: ServiceCatalogItem[] = [
  service(
    52409,
    "Barba",
    "Barba",
    30,
    45,
    1,
    15,
    professionalNames[0],
    true,
    1
  ),
  service(52408, "Corte", "Cabelo", 35, 55, 1, 21, "Todos", true, 2),
  service(
    53102,
    "Degrade",
    "Cabelo",
    45,
    65,
    1,
    21,
    professionalNames[1],
    true,
    3
  ),
  service(53104, "Corte + barba", "Combo", 60, 95, 2, 30, "Todos", true, 4),
  service(
    67662,
    "Corte e Barba Visagismo",
    "Combo",
    75,
    150,
    3,
    30,
    professionalNames[0],
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
    professionalNames[0],
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
    professionalNames[0],
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
    professionalNames[0],
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
    name: "Plano Essencial",
    benefit: "1 atendimento mensal com prioridade de agenda",
    price: 99.9,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 1,
    churnRisk: "Baixo",
  },
  {
    id: 2,
    name: "Plano Barba",
    benefit: "4 atendimentos de barba por mes",
    price: 129.9,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 4,
    churnRisk: "Medio",
  },
  {
    id: 3,
    name: "Plano Completo",
    benefit: "Corte, barba e beneficios recorrentes",
    price: 249.9,
    status: "Destaque",
    recurrence: "Mensal",
    servicesLimit: 6,
    churnRisk: "Baixo",
  },
  {
    id: 4,
    name: "Plano Integral",
    benefit: "Atendimentos completos e servicos especializados",
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
    name: professionalNames[0],
    role: "Profissional",
    commission: "40%",
    scheduleStart: "2026-04-29",
    scheduleEnd: "2026-05-29",
    status: "Ativo",
  },
  {
    id: 2,
    name: professionalNames[1],
    role: "Profissional",
    commission: "40%",
    scheduleStart: "2026-04-29",
    scheduleEnd: "2026-05-29",
    status: "Ativo",
  },
  {
    id: 3,
    name: professionalNames[2],
    role: "Atendimento",
    commission: "Fixo",
    scheduleStart: "2026-04-29",
    scheduleEnd: "2026-05-29",
    status: "Ativo",
  },
]

const products: Product[] = [
  { id: 1, name: "Produto finalizador", category: "Finalizadores", price: 42 },
  { id: 2, name: "Produto para barba", category: "Barba", price: 36 },
  { id: 3, name: "Produto para cabelo", category: "Cabelo", price: 58 },
  { id: 4, name: "Produto pos-atendimento", category: "Barba", price: 34 },
]

const agendaEvents: AgendaEvent[] = [
  appointment(1, professionalNames[0], "09:00", "09:45", clients[0], "Corte"),
  appointment(2, professionalNames[0], "10:00", "11:00", clients[1], "Degrade"),
  appointment(
    3,
    professionalNames[1],
    "09:30",
    "10:45",
    clients[2],
    "Corte + barba"
  ),
  appointment(
    4,
    professionalNames[1],
    "11:00",
    "11:45",
    clients[3],
    "Quiropraxia"
  ),
  {
    id: 5,
    barber: professionalNames[0],
    date: "2026-04-29",
    start: "12:00",
    end: "13:00",
    title: "Intervalo",
    detail: "Agenda bloqueada",
    type: "break",
  },
  appointment(
    6,
    professionalNames[1],
    "14:00",
    "15:00",
    clients[4],
    "Corte Visagismo"
  ),
  appointment(
    7,
    professionalNames[0],
    "15:30",
    "16:30",
    clients[5],
    "Corte + barba"
  ),
  appointment(8, professionalNames[1], "17:00", "18:00", clients[6], "Selagem"),
]

const comandas: Comanda[] = [
  {
    id: "CMD-2041",
    time: "09:00",
    client: clients[0].name,
    barber: professionalNames[0],
    chair: "Cadeira 1",
    status: "paga",
    payment: "Pix",
    items: [
      item("Corte", 1, 55, "servico"),
      item("Produto finalizador", 1, 42, "produto"),
    ],
  },
  {
    id: "CMD-2042",
    time: "10:00",
    client: clients[1].name,
    barber: professionalNames[0],
    chair: "Cadeira 1",
    status: "aberta",
    payment: "Aguardando",
    items: [item("Degrade", 1, 65, "servico")],
  },
  {
    id: "CMD-2043",
    time: "09:30",
    client: clients[2].name,
    barber: professionalNames[1],
    chair: "Cadeira 2",
    status: "paga",
    payment: "Cartao de credito",
    items: [item("Corte + barba", 1, 95, "servico")],
  },
  {
    id: "CMD-2044",
    time: "11:00",
    client: clients[3].name,
    barber: professionalNames[1],
    chair: "Sala de atendimento",
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
    barber: professionalNames[0],
    chair: "Cadeira 1",
    status: "paga",
    payment: "Cartao de debito",
    items: [
      item("Corte + barba", 1, 95, "servico"),
      item("Produto para barba", 1, 36, "produto"),
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

const servicesCompletedThisMonth = clients.reduce(
  (sum, client, index) => sum + getMonthlyVisits(client, index),
  0
)
const averageTicket = Math.round(
  clients.reduce((sum, client) => sum + client.averageTicket, 0) /
    clients.length
)
const monthlyServiceRevenue = clients.reduce(
  (sum, client, index) =>
    sum + client.averageTicket * getMonthlyVisits(client, index),
  0
)
const monthlyRecurringRevenue = subscriptions
  .filter((subscription) => subscription.status !== "Pausada")
  .reduce((sum, subscription) => sum + subscription.value, 0)
const monthlyProductRevenue = Math.round(
  products.reduce((sum, product) => sum + product.price, 0) * 18
)
const monthlyGrossRevenue =
  monthlyServiceRevenue + monthlyRecurringRevenue + monthlyProductRevenue
const paymentMethods = buildPaymentMethods(
  monthlyGrossRevenue,
  monthlyRecurringRevenue
)
const paymentFeesEstimated = Math.round(
  paymentMethods.reduce(
    (sum, method) => sum + method.amount * (method.fee / 100),
    0
  )
)
const payrollExpense = Math.round(monthlyServiceRevenue * 0.48)
const fixedOperationalExpense = 11000
const stockExpense = Math.round(monthlyProductRevenue * 0.6)
const monthlyExpenses =
  payrollExpense + fixedOperationalExpense + stockExpense + paymentFeesEstimated

const bankAccounts: BankAccount[] = [
  {
    id: 1,
    name: "Conta operacional",
    agency: "0000-1",
    account: "00000-1",
    type: "Conta corrente",
    balance: Math.round(monthlyGrossRevenue * 0.62),
    status: "Ativa",
  },
  {
    id: 2,
    name: "Conta de reservas",
    agency: "0000-2",
    account: "00000-2",
    type: "Conta corrente",
    balance: Math.round(monthlyGrossRevenue * 0.28),
    status: "Ativa",
  },
  {
    id: 3,
    name: "Cartao corporativo",
    agency: "0001",
    account: "****-0000",
    type: "Cartao de credito",
    balance: -Math.round(monthlyExpenses * 0.08),
    status: "Em uso",
  },
]

const financialCategories: FinancialCategory[] = [
  category(
    1,
    "Receitas de Servicos",
    "Atendimentos avulsos e pacotes",
    "Receita",
    monthlyServiceRevenue,
    0
  ),
  category(
    2,
    "Receitas de Assinaturas",
    "Planos recorrentes ativos",
    "Receita",
    monthlyRecurringRevenue,
    0
  ),
  category(
    3,
    "Receitas de Produtos",
    "Produtos de cuidado e finalizacao",
    "Receita",
    monthlyProductRevenue,
    0
  ),
  category(
    4,
    "Folha e Comissoes",
    "Pagamentos da equipe e comissoes",
    "Despesa",
    payrollExpense,
    0
  ),
  category(
    5,
    "Custos fixos",
    "Aluguel, energia, agua, internet e servicos essenciais",
    "Despesa",
    fixedOperationalExpense,
    0
  ),
  category(
    6,
    "Estoque e Insumos",
    "Reposicao de produtos e materiais",
    "Despesa",
    stockExpense,
    0
  ),
  category(
    7,
    "Taxas de pagamento",
    "Taxas variaveis dos meios de pagamento",
    "Despesa",
    paymentFeesEstimated,
    0
  ),
]

const financialMovements: FinancialMovement[] = [
  {
    id: 1,
    date: "29/04/2026",
    description: `Recebimento - ${clients[0].name}`,
    category: "Receitas de Servicos",
    account: "Conta operacional",
    amount: getComandaTotal(comandas[0]),
    type: "Receita",
  },
  {
    id: 2,
    date: "29/04/2026",
    description: "Assinaturas liquidadas - lote diario",
    category: "Receitas de Assinaturas",
    account: "Conta operacional",
    amount: Math.round(monthlyRecurringRevenue / 30),
    type: "Receita",
  },
  {
    id: 3,
    date: "29/04/2026",
    description: "Reposicao de descartaveis",
    category: "Estoque e Insumos",
    account: "Pix",
    amount: cashMovements[1].value,
    type: "Despesa",
  },
  {
    id: 4,
    date: "28/04/2026",
    description: "Custo fixo operacional",
    category: "Custos fixos",
    account: "Conta operacional",
    amount: Math.round(fixedOperationalExpense / 6),
    type: "Despesa",
  },
]

const revenueWeek = buildRevenueWeek(
  monthlyGrossRevenue,
  servicesCompletedThisMonth,
  paymentFeesEstimated / monthlyGrossRevenue
)
const peakHours = buildPeakHours(servicesCompletedThisMonth, averageTicket)

export const database = {
  company,
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
    servicesCompletedThisMonth,
    averageTicket,
    monthlyServiceRevenue,
    monthlyRecurringRevenue,
    monthlyProductRevenue,
    monthlyGrossRevenue,
    monthlyExpenses,
    monthlyNetRevenue: monthlyGrossRevenue - paymentFeesEstimated,
    paymentFeesEstimated,
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
    createdAt: "2025-07-10 10:00",
    updatedAt: "2026-04-29 09:00",
    hidden: false,
    fitIn: durationMinutes <= 45,
    startingFrom,
    featured,
    order,
  }
}

function buildClients(): Client[] {
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
      name: `Cliente ${String(index + 1).padStart(3, "0")}`,
      phone: `(00) 90000-${String(index + 1).padStart(4, "0")}`,
      email: `cliente${String(index + 1).padStart(3, "0")}@example.test`,
      visits,
      averageTicket: serviceRef.price + 18 + ((index * 5) % 38),
      status,
      lastVisit: toDisplayDate(addDays(baseDate, -((index * 3) % 54))),
      favoriteService: serviceRef.name,
      active: true,
      createdAt: toDateInputValue(addDays(baseDate, -((index * 11) % 95))),
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
  barber: string,
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

function buildPaymentMethods(
  grossRevenue: number,
  recurringRevenue: number
): PaymentMethod[] {
  const serviceAndProductRevenue = Math.max(grossRevenue - recurringRevenue, 0)
  const pixAmount = Math.round(serviceAndProductRevenue * 0.42)
  const creditAmount = Math.round(serviceAndProductRevenue * 0.28)
  const debitAmount = Math.round(serviceAndProductRevenue * 0.18)
  const cashAmount =
    serviceAndProductRevenue - pixAmount - creditAmount - debitAmount

  return [
    method(
      1,
      "Pix",
      "Chave Pix demonstrativa",
      0.49,
      "Imediato",
      pixAmount,
      118
    ),
    method(
      2,
      "Cartao de credito",
      "Meio de pagamento por adquirente",
      3.49,
      "30 dias",
      creditAmount,
      74
    ),
    method(
      3,
      "Cartao de debito",
      "Meio de pagamento por adquirente",
      1.69,
      "1 dia util",
      debitAmount,
      51
    ),
    method(
      4,
      "Dinheiro",
      "Pagamento presencial no caixa",
      0,
      "Imediato",
      cashAmount,
      36
    ),
    method(
      5,
      "Cobranca online",
      "Links de assinatura e cobranca",
      3.49,
      "2 dias uteis",
      recurringRevenue,
      subscriptions.length
    ),
  ]
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

function buildRevenueWeek(
  monthlyRevenue: number,
  monthlyServices: number,
  effectiveFeeRate: number
) {
  const weeklyTarget = Math.round(monthlyRevenue / 4.33)
  const weeklyServices = Math.round(monthlyServices / 4.33)
  const weights = [0.14, 0.17, 0.22, 0, 0.13, 0.16, 0.18]
  const serviceWeights = [0.15, 0.18, 0.24, 0, 0.12, 0.15, 0.16]
  const previousMultipliers = [0.98, 1.08, 0.94, 0, 1.02, 0.91, 1.05]
  const days = [
    ["23/04", "Qui"],
    ["24/04", "Sex"],
    ["25/04", "Sab"],
    ["26/04", "Dom"],
    ["27/04", "Seg"],
    ["28/04", "Ter"],
    ["29/04", "Qua"],
  ] as const

  return days.map(([day, weekday], index) => {
    const gross = Math.round(weeklyTarget * weights[index])
    const net = Math.round(gross * (1 - effectiveFeeRate))
    const previous = Math.round(gross * previousMultipliers[index])
    const appointments = Math.round(weeklyServices * serviceWeights[index])

    return { day, weekday, gross, net, previous, appointments }
  })
}

function buildPeakHours(monthlyServices: number, ticket: number) {
  const distribution = [
    ["09:00", 0.08],
    ["10:00", 0.12],
    ["11:00", 0.11],
    ["12:00", 0.04],
    ["13:00", 0.06],
    ["14:00", 0.1],
    ["15:00", 0.15],
    ["16:00", 0.17],
    ["17:00", 0.13],
    ["18:00", 0.04],
  ] as const
  const maxAppointments = Math.max(
    ...distribution.map(([, ratio]) => Math.round(monthlyServices * ratio))
  )

  return distribution.map(([time, ratio]) => {
    const appointments = Math.round(monthlyServices * ratio)

    return {
      time,
      appointments,
      revenue: appointments * ticket,
      occupancy: Math.round((appointments / maxAppointments) * 92),
    }
  })
}

function getMonthlyVisits(client: Client, index: number) {
  if (client.status === "recorrente") return 2 + (index % 2)
  if (client.status === "novo") return 1
  return 1 + (index % 2)
}

function getComandaTotal(comanda: Comanda) {
  return (
    comanda.items.reduce(
      (sum, currentItem) => sum + currentItem.quantity * currentItem.unitPrice,
      0
    ) - (comanda.discount ?? 0)
  )
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date)
}

function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}
