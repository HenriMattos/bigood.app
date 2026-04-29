import {
  database,
  type CashMovement,
  type CashMovementType,
  type Comanda,
  type ComandaItem,
  type ComandaStatus,
} from "./database"

export type {
  CashMovement,
  CashMovementType,
  Comanda,
  ComandaItem,
  ComandaStatus,
}

export const comandas: Comanda[] = database.comandas
export const cashMovements: CashMovement[] = database.cashMovements

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
