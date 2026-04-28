import { StatusBadge } from "@/components/admin/status-badge"

export type ClientStatus = "ativo" | "novo" | "recorrente" | "sem-plano"

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
}

export const clients: Client[] = [
  {
    id: 1,
    name: "Rafael Lima",
    phone: "(11) 98888-1020",
    email: "rafael@email.com",
    visits: 12,
    averageTicket: 86,
    status: "ativo",
    lastVisit: "27/04/2026",
    favoriteService: "Corte + barba",
  },
  {
    id: 2,
    name: "Mateus Alves",
    phone: "(11) 97777-3344",
    email: "mateus@email.com",
    visits: 4,
    averageTicket: 64,
    status: "novo",
    lastVisit: "24/04/2026",
    favoriteService: "Degrade",
  },
  {
    id: 3,
    name: "Pedro Santos",
    phone: "(11) 96666-7788",
    email: "pedro@email.com",
    visits: 19,
    averageTicket: 92,
    status: "recorrente",
    lastVisit: "25/04/2026",
    favoriteService: "Barba",
  },
  {
    id: 4,
    name: "Lucas Rocha",
    phone: "(11) 95555-9012",
    email: "lucas@email.com",
    visits: 2,
    averageTicket: 110,
    status: "sem-plano",
    lastVisit: "08/04/2026",
    favoriteService: "Corte premium",
  },
  {
    id: 5,
    name: "Thiago Martins",
    phone: "(11) 94444-4512",
    email: "thiago@email.com",
    visits: 16,
    averageTicket: 95,
    status: "recorrente",
    lastVisit: "28/04/2026",
    favoriteService: "Corte + barba",
  },
]

export const loyalClients = clients
  .filter((client) => client.visits >= 10)
  .sort((a, b) => b.visits - a.visits)

export const clientRows = [
  [
    "Rafael Lima",
    "(11) 98888-1020",
    "12 visitas",
    "R$ 86",
    <StatusBadge key="active" tone="green">
      Ativo
    </StatusBadge>,
  ],
  [
    "Mateus Alves",
    "(11) 97777-3344",
    "4 visitas",
    "R$ 64",
    <StatusBadge key="new" tone="blue">
      Novo
    </StatusBadge>,
  ],
  [
    "Pedro Santos",
    "(11) 96666-7788",
    "19 visitas",
    "R$ 92",
    <StatusBadge key="vip" tone="amber">
      Recorrente
    </StatusBadge>,
  ],
  [
    "Lucas Rocha",
    "(11) 95555-9012",
    "2 visitas",
    "R$ 110",
    <StatusBadge key="risk" tone="neutral">
      Sem plano
    </StatusBadge>,
  ],
]

export function getClientStatusLabel(status: ClientStatus) {
  const labels = {
    ativo: "Ativo",
    novo: "Novo",
    recorrente: "Recorrente",
    "sem-plano": "Sem plano",
  }

  return labels[status]
}

export function getClientStatusTone(status: ClientStatus) {
  const tones = {
    ativo: "green",
    novo: "blue",
    recorrente: "amber",
    "sem-plano": "neutral",
  } as const

  return tones[status]
}

export const repurchaseClients = [
  {
    client: "Rafael Lima",
    phone: "(11) 98888-1020",
    lastPurchase: "Selagem capilar",
    lastDate: "18/03/2026",
    recommended: "Refazer selagem",
    dueDate: "02/05/2026",
    reason: "45 dias desde o ultimo procedimento",
  },
  {
    client: "Pedro Santos",
    phone: "(11) 96666-7788",
    lastPurchase: "Oleo para barba",
    lastDate: "28/03/2026",
    recommended: "Repor oleo para barba",
    dueDate: "28/04/2026",
    reason: "Estimativa de recompra mensal",
  },
  {
    client: "Lucas Rocha",
    phone: "(11) 95555-9012",
    lastPurchase: "Corte premium",
    lastDate: "08/04/2026",
    recommended: "Agendar manutencao do corte",
    dueDate: "30/04/2026",
    reason: "22 dias desde o ultimo corte",
  },
  {
    client: "Mateus Alves",
    phone: "(11) 97777-3344",
    lastPurchase: "Pomada modeladora",
    lastDate: "10/04/2026",
    recommended: "Oferecer pomada modeladora",
    dueDate: "10/05/2026",
    reason: "Produto com ciclo medio de 30 dias",
  },
]
