import type {
  Client,
  ServiceCatalogItem,
  Plan,
  Professional,
  Subscription,
  OverdueSubscription,
  Product,
  AgendaEvent,
  Comanda,
  CashMovement,
  BankAccount,
  FinancialCategory,
  FinancialMovement,
  PaymentMethod,
  Analytics,
  Company,
} from "@/types"

const today = new Date()

function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const demoPlans: Plan[] = [
  {
    id: 1,
    name: "Clube Corte",
    benefit: "1 corte por mes com prioridade na agenda.",
    price: 89,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 1,
    churnRisk: "Baixo",
  },
  {
    id: 2,
    name: "Clube Barba e Cabelo",
    benefit: "Corte e barba todo mes, com acabamento incluso.",
    price: 129,
    status: "Destaque",
    recurrence: "Mensal",
    servicesLimit: 2,
    churnRisk: "Baixo",
  },
  {
    id: 3,
    name: "Clube Premium",
    benefit: "Atendimentos recorrentes com beneficios completos.",
    price: 179,
    status: "Ativo",
    recurrence: "Mensal",
    servicesLimit: 4,
    churnRisk: "Medio",
  },
]

const demoServices: ServiceCatalogItem[] = [
  {
    id: 1,
    name: "Corte masculino",
    category: "Cabelo",
    duration: "45min",
    durationMinutes: 45,
    price: 60,
    credits: 1,
    repurchaseDays: 28,
    professionals: "Rafael, Lucas e Diego",
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: true,
    startingFrom: false,
    featured: true,
    order: 1,
  },
  {
    id: 2,
    name: "Barba completa",
    category: "Barba",
    duration: "35min",
    durationMinutes: 35,
    price: 45,
    credits: 1,
    repurchaseDays: 21,
    professionals: "Rafael e Diego",
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: true,
    startingFrom: false,
    featured: true,
    order: 2,
  },
  {
    id: 3,
    name: "Corte + barba",
    category: "Combo",
    duration: "75min",
    durationMinutes: 75,
    price: 95,
    credits: 2,
    repurchaseDays: 28,
    professionals: "Rafael, Lucas e Diego",
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: false,
    startingFrom: false,
    featured: true,
    order: 3,
  },
  {
    id: 4,
    name: "Acabamento",
    category: "Cabelo",
    duration: "25min",
    durationMinutes: 25,
    price: 35,
    credits: 1,
    repurchaseDays: 14,
    professionals: "Lucas e Diego",
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: true,
    startingFrom: true,
    featured: false,
    order: 4,
  },
]

const demoProfessionals: Professional[] = [
  {
    id: 1,
    name: "Rafael Oliveira",
    role: "Barbeiro fundador",
    commission: "50%",
    scheduleStart: "09:00",
    scheduleEnd: "19:00",
    status: "Ativo",
  },
  {
    id: 2,
    name: "Lucas Santos",
    role: "Barbeiro senior",
    commission: "45%",
    scheduleStart: "10:00",
    scheduleEnd: "20:00",
    status: "Ativo",
  },
  {
    id: 3,
    name: "Diego Martins",
    role: "Barbeiro",
    commission: "40%",
    scheduleStart: "09:00",
    scheduleEnd: "18:00",
    status: "Ativo",
  },
]

const clientNames = [
  "Gabriel Silva",
  "Marcos Almeida",
  "Joao Pedro",
  "Felipe Costa",
  "Bruno Lima",
  "Andre Rocha",
  "Thiago Souza",
  "Matheus Alves",
  "Caio Henrique",
  "Victor Hugo",
]

const demoClients: Client[] = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1
  const plan = demoPlans[index % demoPlans.length]
  const service = demoServices[index % 3]

  return {
    id,
    name:
      id === 1
        ? "Henrique Demo"
        : `${clientNames[index % clientNames.length]} ${String(id).padStart(2, "0")}`,
    phone:
      id === 1
        ? "(11) 98888-0101"
        : `(11) 9${String(88000000 + id).slice(0, 8)}`,
    email:
      id === 1
        ? "cliente@barbeariavip.com"
        : `cliente${String(id).padStart(3, "0")}@barbeariavip.com`,
    visits: 4 + (index % 22),
    averageTicket: 78 + (index % 7) * 8,
    status: "recorrente",
    lastVisit: toDateInputValue(addDays(today, -((index % 24) + 1))),
    favoriteService: service.name,
    active: true,
    createdAt: toDateInputValue(addDays(today, -(180 - (index % 120)))),
    planName: plan.name,
  }
})

const demoSubscriptions: Subscription[] = demoClients.map((client, index) => {
  const plan = demoPlans[index % demoPlans.length]

  return {
    id: index + 1,
    clientId: client.id,
    client: client.name,
    phone: client.phone,
    plan: plan.name,
    value: plan.price,
    nextCharge: toDateInputValue(addDays(today, 3 + (index % 27))),
    startedAt: client.createdAt,
    status: "Ativa",
  }
})

export function getCompany(): Company {
  return {
    corporateName: "Barbearia VIP Tecnologia e Estilo LTDA",
    tradeName: "Barbearia VIP",
    cnpj: "12.345.678/0001-90",
    email: "contato@barbeariavip.com",
    timezone: "America/Sao_Paulo",
    phone: "(11) 4002-8922",
    slug: "barbearia-vip",
    primaryColor: { r: 145, g: 230, b: 104 },
    logoUrl: "/brand/bigood-portal-icon.png?v=3",
    logoAlt: "Bigood Logo",
    iconUrl: "/brand/bigood-portal-icon.png?v=3",
    chairs: ["Cadeira 1", "Cadeira 2", "Cadeira 3"],
    professionalRoles: ["Barbeiro fundador", "Barbeiro senior", "Barbeiro"],
    serviceCategories: ["Cabelo", "Barba", "Combo"],
    address: {
      street: "Rua Augusta",
      number: "1240",
      neighborhood: "Consolacao",
      city: "Sao Paulo",
      state: "SP",
      zip: "01304-001",
      mapsUrl: "https://maps.google.com/?q=Rua+Augusta+1240",
    },
    social: {
      instagram: "@barbeariavip",
      whatsapp: "(11) 98888-0100",
      facebook: "barbeariavip",
    },
  }
}

export function getServices(): ServiceCatalogItem[] {
  return demoServices
}

export function getPlans(): Plan[] {
  return demoPlans
}

export function getProfessionals(): Professional[] {
  return demoProfessionals
}

export function getClients(): Client[] {
  return demoClients
}

export function getSubscriptions(): Subscription[] {
  return demoSubscriptions
}

export function getAgendaEvents(): AgendaEvent[] {
  return [
    {
      id: 1,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "09:00",
      end: "09:45",
      title: "Henrique Demo",
      detail: "Corte masculino",
      type: "appointment",
    },
    {
      id: 2,
      barber: "Lucas Santos",
      date: toDateInputValue(today),
      start: "10:00",
      end: "11:15",
      title: "Gabriel Silva",
      detail: "Corte + barba",
      type: "appointment",
    },
    {
      id: 3,
      barber: "Diego Martins",
      date: toDateInputValue(today),
      start: "11:30",
      end: "12:05",
      title: "Marcos Almeida",
      detail: "Barba completa",
      type: "appointment",
    },
    {
      id: 4,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "13:30",
      end: "14:15",
      title: "Joao Pedro",
      detail: "Corte masculino",
      type: "appointment",
    },
  ]
}

export function getComandas(): Comanda[] {
  return [
    {
      id: "CMD-1001",
      time: "09:50",
      client: "Henrique Demo",
      barber: "Rafael Oliveira",
      chair: "Cadeira 1",
      status: "paga",
      payment: "Pix",
      items: [
        {
          name: "Corte masculino",
          quantity: 1,
          unitPrice: 60,
          category: "servico",
        },
      ],
    },
    {
      id: "CMD-1002",
      time: "11:20",
      client: "Gabriel Silva",
      barber: "Lucas Santos",
      chair: "Cadeira 2",
      status: "paga",
      payment: "Cartao de credito",
      items: [
        {
          name: "Corte + barba",
          quantity: 1,
          unitPrice: 95,
          category: "servico",
        },
      ],
    },
    {
      id: "CMD-1003",
      time: "12:10",
      client: "Marcos Almeida",
      barber: "Diego Martins",
      chair: "Cadeira 3",
      status: "aberta",
      payment: "Pendente",
      items: [
        {
          name: "Barba completa",
          quantity: 1,
          unitPrice: 45,
          category: "servico",
        },
      ],
    },
  ]
}

export function getPaymentMethods(): PaymentMethod[] {
  return [
    {
      id: 1,
      name: "Pix",
      description: "Recebimento instantaneo",
      status: "Ativo",
      fee: 0,
      settlement: "Na hora",
      amount: 18640,
      transactions: 218,
    },
    {
      id: 2,
      name: "Cartao de credito",
      description: "Venda presencial e assinatura",
      status: "Ativo",
      fee: 2.99,
      settlement: "D+1",
      amount: 14280,
      transactions: 132,
    },
    {
      id: 3,
      name: "Dinheiro",
      description: "Pagamento no balcao",
      status: "Ativo",
      fee: 0,
      settlement: "Na hora",
      amount: 3680,
      transactions: 46,
    },
  ]
}

export function getAnalytics(): Analytics {
  const monthlyRecurringRevenue = demoSubscriptions.reduce(
    (sum, subscription) => sum + subscription.value,
    0
  )
  const monthlyServiceRevenue = 24850
  const monthlyProductRevenue = 3620
  const monthlyGrossRevenue =
    monthlyRecurringRevenue + monthlyServiceRevenue + monthlyProductRevenue
  const monthlyExpenses = 17350

  return {
    activeClients: 100,
    newClientsThisMonth: 12,
    recurringClients: 100,
    clientsWithoutPlan: 0,
    activeSubscriptions: 100,
    servicesCompletedThisMonth: 286,
    averageTicket: 96,
    monthlyServiceRevenue,
    monthlyRecurringRevenue,
    monthlyProductRevenue,
    monthlyGrossRevenue,
    monthlyExpenses,
    monthlyNetRevenue: monthlyGrossRevenue - monthlyExpenses,
    paymentFeesEstimated: 742,
    overdueAmount: 0,
    revenueWeek: [
      {
        day: "Seg",
        weekday: "Segunda",
        gross: 4620,
        net: 3880,
        previous: 4100,
        appointments: 28,
      },
      {
        day: "Ter",
        weekday: "Terca",
        gross: 5180,
        net: 4360,
        previous: 4680,
        appointments: 31,
      },
      {
        day: "Qua",
        weekday: "Quarta",
        gross: 5760,
        net: 4890,
        previous: 5020,
        appointments: 34,
      },
      {
        day: "Qui",
        weekday: "Quinta",
        gross: 6240,
        net: 5290,
        previous: 5600,
        appointments: 37,
      },
      {
        day: "Sex",
        weekday: "Sexta",
        gross: 7480,
        net: 6410,
        previous: 6900,
        appointments: 44,
      },
      {
        day: "Sab",
        weekday: "Sabado",
        gross: 8920,
        net: 7710,
        previous: 8010,
        appointments: 52,
      },
    ],
    revenuePeriod: { label: "Maio 2026", comparison: "+18% vs. abril" },
    peakHours: [
      { time: "10:00", appointments: 36, revenue: 3280, occupancy: 82 },
      { time: "14:00", appointments: 42, revenue: 3940, occupancy: 88 },
      { time: "18:00", appointments: 51, revenue: 4760, occupancy: 94 },
    ],
  }
}

export const adminService = {
  company: getCompany(),
  services: getServices(),
  plans: getPlans(),
  clients: getClients(),
  subscriptions: getSubscriptions(),
  overdueSubscriptions: [] as OverdueSubscription[],
  professionals: getProfessionals(),
  products: [
    { id: 1, name: "Pomada modeladora", category: "Finalizacao", price: 49 },
    { id: 2, name: "Oleo para barba", category: "Barba", price: 59 },
  ] as Product[],
  agendaEvents: getAgendaEvents(),
  comandas: getComandas(),
  cashMovements: [
    {
      id: "MOV-1",
      type: "entrada",
      label: "Assinaturas do dia",
      category: "Planos",
      value: 980,
      payment: "Pix",
      time: "09:00",
    },
    {
      id: "MOV-2",
      type: "entrada",
      label: "Comandas pagas",
      category: "Servicos",
      value: 155,
      payment: "Cartao",
      time: "11:30",
    },
    {
      id: "MOV-3",
      type: "saida",
      label: "Reposicao de produtos",
      category: "Estoque",
      value: 320,
      payment: "Pix",
      time: "15:10",
    },
  ] as CashMovement[],
  bankAccounts: [
    {
      id: 1,
      name: "Conta principal",
      agency: "0001",
      account: "12345-6",
      type: "PJ",
      balance: 32840,
      status: "Em uso",
    },
  ] as BankAccount[],
  financialCategories: [
    {
      id: 1,
      name: "Assinaturas",
      description: "Receita recorrente dos planos",
      type: "Receita",
      monthlyAmount: 11650,
      trend: 18,
    },
    {
      id: 2,
      name: "Servicos avulsos",
      description: "Comandas e atendimentos",
      type: "Receita",
      monthlyAmount: 24850,
      trend: 12,
    },
    {
      id: 3,
      name: "Equipe",
      description: "Comissoes e repasses",
      type: "Despesa",
      monthlyAmount: 11200,
      trend: 6,
    },
  ] as FinancialCategory[],
  financialMovements: [
    {
      id: 1,
      date: toDateInputValue(today),
      description: "Receita de assinaturas",
      category: "Assinaturas",
      account: "Conta principal",
      amount: 980,
      type: "Receita",
    },
    {
      id: 2,
      date: toDateInputValue(today),
      description: "Comissoes da equipe",
      category: "Equipe",
      account: "Conta principal",
      amount: 420,
      type: "Despesa",
    },
  ] as FinancialMovement[],
  paymentMethods: getPaymentMethods(),
  analytics: getAnalytics(),
}
