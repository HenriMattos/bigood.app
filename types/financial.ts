import type { PaymentMethod as AdminPaymentMethod } from "./admin"

export type FinancialType = "Receita" | "Despesa"

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
  status: "Ativa" | "Em uso" | "Inativa"
}

export type FinancialCategory = {
  id: number
  name: string
  description: string
  type: FinancialType
  monthlyAmount: number
  trend: number
}

export type FinancialPaymentMethod = AdminPaymentMethod

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

export type Analytics = {
  activeClients: number
  newClientsThisMonth: number
  recurringClients: number
  clientsWithoutPlan: number
  activeSubscriptions: number
  servicesCompletedThisMonth: number
  averageTicket: number
  monthlyServiceRevenue: number
  monthlyRecurringRevenue: number
  monthlyProductRevenue: number
  monthlyGrossRevenue: number
  monthlyExpenses: number
  monthlyNetRevenue: number
  paymentFeesEstimated: number
  overdueAmount: number
  revenueWeek: RevenueDay[]
  revenuePeriod: {
    label: string
    comparison: string
  }
  peakHours: PeakHour[]
}
