import { database, type Client, type ClientStatus } from "./database"

export type { Client, ClientStatus }

export const clients: Client[] = database.clients

export const loyalClients = clients
  .filter((client) => client.active && client.visits >= 10)
  .sort((a, b) => b.visits - a.visits)
  .slice(0, 6)

export const repurchaseClients = clients
  .filter((client) => client.active)
  .slice(0, 12)
  .map((client) => {
    const service = database.services.find(
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

function getDueDate(displayDate: string, days: number) {
  const [day, month, year] = displayDate.split("/").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)

  return new Intl.DateTimeFormat("pt-BR").format(date)
}
