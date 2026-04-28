export type ComandaStatus = "aberta" | "paga" | "parcial" | "cancelada"

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

export type CashMovementType = "entrada" | "saida"

export type CashMovement = {
  id: string
  type: CashMovementType
  label: string
  category: string
  value: number
  payment: string
  time: string
}

export const comandas: Comanda[] = [
  {
    id: "CMD-1024",
    time: "09:00",
    client: "Rafael Lima",
    barber: "Bruno",
    chair: "Cadeira 1",
    status: "paga",
    payment: "Pix",
    items: [
      { name: "Corte social", quantity: 1, unitPrice: 55, category: "servico" },
      { name: "Barba completa", quantity: 1, unitPrice: 40, category: "servico" },
    ],
  },
  {
    id: "CMD-1025",
    time: "10:30",
    client: "Mateus Alves",
    barber: "Caio",
    chair: "Cadeira 2",
    status: "aberta",
    payment: "Aguardando",
    items: [
      { name: "Degrade", quantity: 1, unitPrice: 65, category: "servico" },
      { name: "Pomada modeladora", quantity: 1, unitPrice: 42, category: "produto" },
    ],
  },
  {
    id: "CMD-1026",
    time: "13:00",
    client: "Pedro Santos",
    barber: "Bruno",
    chair: "Cadeira 1",
    status: "parcial",
    payment: "Credito",
    discount: 10,
    items: [
      { name: "Barba", quantity: 1, unitPrice: 38, category: "servico" },
      { name: "Sobrancelha", quantity: 1, unitPrice: 25, category: "servico" },
    ],
    notes: "Cliente pagou entrada e finaliza no fechamento.",
  },
  {
    id: "CMD-1027",
    time: "15:30",
    client: "Lucas Rocha",
    barber: "Diego",
    chair: "Cadeira 3",
    status: "paga",
    payment: "Debito",
    items: [
      { name: "Corte premium", quantity: 1, unitPrice: 110, category: "servico" },
      { name: "Oleo para barba", quantity: 1, unitPrice: 36, category: "produto" },
    ],
  },
  {
    id: "CMD-1028",
    time: "17:00",
    client: "Thiago Martins",
    barber: "Bruno",
    chair: "Cadeira 1",
    status: "aberta",
    payment: "Aguardando",
    items: [
      { name: "Corte + barba", quantity: 1, unitPrice: 95, category: "servico" },
      { name: "Hidratacao de barba", quantity: 1, unitPrice: 30, category: "servico" },
    ],
  },
]

export const cashMovements: CashMovement[] = [
  {
    id: "MOV-001",
    type: "entrada",
    label: "Troco inicial",
    category: "Suprimento",
    value: 150,
    payment: "Dinheiro",
    time: "08:45",
  },
  {
    id: "MOV-002",
    type: "saida",
    label: "Compra descartaveis",
    category: "Despesa operacional",
    value: 68,
    payment: "Pix",
    time: "11:20",
  },
  {
    id: "MOV-003",
    type: "saida",
    label: "Cafe e limpeza",
    category: "Despesa operacional",
    value: 44,
    payment: "Dinheiro",
    time: "12:10",
  },
  {
    id: "MOV-004",
    type: "saida",
    label: "Taxas de pagamento",
    category: "Taxa",
    value: 38,
    payment: "Credito",
    time: "17:40",
  },
]

export function getComandaSubtotal(comanda: Comanda) {
  return comanda.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
}

export function getComandaTotal(comanda: Comanda) {
  return getComandaSubtotal(comanda) - (comanda.discount ?? 0)
}

export function getStatusLabel(status: ComandaStatus) {
  const labels = {
    aberta: "Aberta",
    paga: "Paga",
    parcial: "Parcial",
    cancelada: "Cancelada",
  }

  return labels[status]
}

export function getStatusTone(status: ComandaStatus) {
  const tones = {
    aberta: "amber",
    paga: "green",
    parcial: "blue",
    cancelada: "red",
  } as const

  return tones[status]
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
