export type {
  CashMovement,
  CashMovementType,
  Comanda,
  ComandaItem,
  ComandaStatus,
} from "@/types"

import { adminService } from "@/services/admin"

export const comandas = adminService.comandas
export const cashMovements = adminService.cashMovements

export function getComandaSubtotal(comanda: import("@/types").Comanda) {
  return comanda.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
}

export function getComandaTotal(comanda: import("@/types").Comanda) {
  return getComandaSubtotal(comanda) - (comanda.discount ?? 0)
}

export function getStatusLabel(status: import("@/types").ComandaStatus) {
  const labels: Record<import("@/types").ComandaStatus, string> = {
    aberta: "Aberta",
    paga: "Paga",
    parcial: "Parcial",
    cancelada: "Cancelada",
  }
  return labels[status]
}

export function getStatusTone(
  status: import("@/types").ComandaStatus
): "amber" | "green" | "blue" | "red" {
  const tones = {
    aberta: "amber" as const,
    paga: "green" as const,
    parcial: "blue" as const,
    cancelada: "red" as const,
  }
  return tones[status]
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
