export type { Client, ClientStatus } from "@/types"

import { adminService } from "@/services/admin"
import type { Client } from "@/types"

export const clients: Client[] = adminService.clients

export const loyalClients = clients
  .filter((client) => client.active && client.visits >= 10)
  .sort((a, b) => b.visits - a.visits)
  .slice(0, 6)

export const repurchaseClients = clients
  .filter((client) => client.active)
  .slice(0, 12)
  .map((client) => {
    const service = adminService.services.find(
      (item) => item.name === client.favoriteService
    )
    const interval = service?.repurchaseDays ?? 30

    return {
      client: client.name,
      phone: client.phone,
      lastPurchase: client.favoriteService,
      lastDate: client.lastVisit,
      recommended: client.favoriteService,
      dueDate: getDueDate(client.lastVisit, interval),
      reason: `${interval} dias desde o ultimo atendimento ou ciclo de recompra do servico.`,
    }
  })

export function getClientStatusLabel(status: import("@/types").ClientStatus) {
  const labels: Record<import("@/types").ClientStatus, string> = {
    ativo: "Ativo",
    novo: "Novo",
    recorrente: "Recorrente",
    "sem-plano": "Sem plano",
  }
  return labels[status]
}

export function getClientStatusTone(
  status: import("@/types").ClientStatus
): "amber" | "green" | "blue" | "red" | "neutral" {
  const tones = {
    ativo: "green" as const,
    novo: "blue" as const,
    recorrente: "amber" as const,
    "sem-plano": "neutral" as const,
  }
  return tones[status]
}

function getDueDate(dateStr: string, days: number) {
  let date: Date
  if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-").map(Number)
    date = new Date(year, month - 1, day)
  } else {
    const [day, month, year] = dateStr.split("/").map(Number)
    date = new Date(year, month - 1, day)
  }
  if (isNaN(date.getTime())) return "Data invalida"
  date.setDate(date.getDate() + days)
  return new Intl.DateTimeFormat("pt-BR").format(date)
}
