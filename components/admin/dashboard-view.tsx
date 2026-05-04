"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Calendar03Icon,
  ChartBarLineIcon,
  ChartIncreaseIcon,
  Clock01Icon,
  CrownIcon,
  MoneyReceiveCircleIcon,
  UserMultipleIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database, toDateInputValue, toDisplayDate } from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import { OnboardingGuide } from "@/components/admin/onboarding-guide"
import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type DashboardMode = "operacional" | "estrategica"
type GoalKind = "currency" | "number"
type Goal = {
  id: string
  label: string
  current: number
  target: number
  kind: GoalKind
}

const today = new Date()
const todayInput = toDateInputValue(today)
const todayDisplay = toDisplayDate(today)

const todayAppointments = database.agendaEvents.filter(
  (event) => event.date === todayInput && event.type === "appointment"
)
const todayRevenue = database.comandas
  .filter((comanda) => comanda.status === "paga")
  .reduce((sum, comanda) => sum + getComandaTotal(comanda), 0)
const averageTicket = database.clients.length > 0 
  ? Math.round(
      database.clients.reduce((sum, client) => sum + client.averageTicket, 0) /
        database.clients.length
    )
  : 0
const operationalMetrics = [
  {
    title: "Faturamento hoje",
    value: formatCurrency(todayRevenue),
    change: "Comandas pagas no caixa",
    icon: MoneyReceiveCircleIcon,
    tone: "green" as const,
  },
  {
    title: "Agendamentos",
    value: String(todayAppointments.length),
    change: `Agenda de ${todayDisplay}`,
    icon: Calendar03Icon,
    tone: "blue" as const,
  },
  {
    title: "Clientes ativos",
    value: String(database.analytics.activeClients),
    change: `${database.analytics.newClientsThisMonth} novos neste mes`,
    icon: UserMultipleIcon,
    tone: "amber" as const,
  },
  {
    title: "Ticket medio",
    value: formatCurrency(averageTicket),
    change: "Media da base ativa",
    icon: ChartIncreaseIcon,
    tone: "green" as const,
  },
]

const appointmentRows = todayAppointments.slice(0, 4).map((event, index) => [
  event.start,
  event.title,
  event.detail,
  event.barber,
  <StatusBadge
    key={event.id}
    tone={index === 0 ? "green" : index === 1 ? "amber" : "blue"}
  >
    {index === 0 ? "Confirmado" : index === 1 ? "Aguardando" : "Agendado"}
  </StatusBadge>,
])

const revenue = database.analytics.revenueWeek
const revenuePeriod = database.analytics.revenuePeriod
const paymentTones = [
  "bg-primary",
  "bg-sky-500",
  "bg-amber-500",
  "bg-zinc-400",
  "bg-emerald-500",
]

const dashboardGoalsStorageKey = "admin.dashboard.goals"

const initialGoals: Goal[] = [
  {
    id: "revenue",
    label: "Meta de faturamento",
    current: database.analytics.monthlyGrossRevenue,
    target: 0,
    kind: "currency",
  },
  {
    id: "new-clients",
    label: "Novos clientes",
    current: database.analytics.newClientsThisMonth,
    target: 0,
    kind: "number",
  },
  {
    id: "subscriptions",
    label: "Assinaturas",
    current: database.analytics.activeSubscriptions,
    target: 0,
    kind: "number",
  },
]

const peakHours = database.analytics.peakHours

export function DashboardView() {
  const [mode, setMode] = useState<DashboardMode>("operacional")
  const [goals, setGoals] = useState<Goal[]>(readSavedGoals)

  const isOperational = mode === "operacional"
  const revenueGoal =
    goals.find((goal) => goal.id === "revenue") ?? initialGoals[0]
  const subscriptionsGoal =
    goals.find((goal) => goal.id === "subscriptions") ?? initialGoals[2]
  const revenueProgress = calculateGoalProgress(revenueGoal)
  const retentionRate = Math.round(
    (database.analytics.recurringClients / database.analytics.activeClients) *
      100
  )
  const marginRate = Math.round(
    ((database.analytics.monthlyGrossRevenue -
      database.analytics.monthlyExpenses) /
      database.analytics.monthlyGrossRevenue) *
      100
  )
  const strategicMetrics = [
    {
      title: "Receita mensal",
      value: formatCurrency(revenueGoal.current),
      change: `Meta do mes em ${revenueProgress}%`,
      icon: ChartIncreaseIcon,
      tone: "green" as const,
    },
    {
      title: "Assinantes",
      value: String(subscriptionsGoal.current),
      change: `${calculateGoalProgress(subscriptionsGoal)}% da meta mensal`,
      icon: CrownIcon,
      tone: "blue" as const,
    },
    {
      title: "Retencao",
      value: `${retentionRate}%`,
      change: "Clientes com plano ativo",
      icon: UserMultipleIcon,
      tone: "amber" as const,
    },
    {
      title: "Margem estimada",
      value: `${marginRate}%`,
      change: "Receita liquida menos despesas",
      icon: Wallet02Icon,
      tone: "green" as const,
    },
  ]
  const metrics = isOperational ? operationalMetrics : strategicMetrics

  const title = useMemo(
    () => (isOperational ? "Operacional do dia" : "Estrategia e crescimento"),
    [isOperational]
  )

  return (
    <>
      <OnboardingGuide />
      <section className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-3 shadow-sm sm:gap-4 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              Dashboard
            </p>
            <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
          </div>

          <div className="grid w-full grid-cols-2 rounded-full border bg-muted p-1 text-xs font-medium sm:w-auto sm:text-sm">
            <button
              type="button"
              aria-pressed={isOperational}
              onClick={() => setMode("operacional")}
              className={cn(
                "rounded-full px-3 py-2 transition-colors",
                isOperational
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Operacional
            </button>
            <button
              type="button"
              aria-pressed={!isOperational}
              onClick={() => setMode("estrategica")}
              className={cn(
                "rounded-full px-3 py-2 transition-colors",
                !isOperational
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Estrategica
            </button>
          </div>
        </div>
      </section>

      <div className="admin-metric-grid" data-columns="4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {isOperational ? (
        <OperationalDashboard />
      ) : (
        <StrategicDashboard goals={goals} onGoalsChange={setGoals} />
      )}
    </>
  )
}

function OperationalDashboard() {
  return (
    <div className="admin-split-grid">
      <SectionCard
        title="Agenda de hoje"
        description="Proximos atendimentos e status de chegada"
        action={
          <Button size="sm" asChild>
            <Link href="/agenda">Ver agenda</Link>
          </Button>
        }
      >
        {appointmentRows.length === 0 ? (
          <EmptyState
            icon={Calendar03Icon}
            title="Agenda vazia para hoje"
            description="Não há atendimentos agendados para este período. Que tal registrar um novo?"
            actionLabel="Novo agendamento"
            href="/agenda"
          />
        ) : (
          <SimpleTable
            columns={["Horario", "Cliente", "Servico", "Barbeiro", "Status"]}
            rows={appointmentRows}
          />
        )}
      </SectionCard>

      <SectionCard title="Receita" description={revenuePeriod.label}>
        <WeeklyRevenueChart />
      </SectionCard>
    </div>
  )
}

function StrategicDashboard({
  goals,
  onGoalsChange,
}: {
  goals: Goal[]
  onGoalsChange: (goals: Goal[]) => void
}) {
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [draftGoals, setDraftGoals] = useState<Goal[]>(goals)

  function updateDraftGoal(goalId: string, target: number) {
    setDraftGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              target,
            }
          : goal
      )
    )
  }

  function saveGoals(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextGoals = draftGoals.map((goal) => ({
      ...goal,
      target: Math.max(1, Math.round(goal.target)),
    }))

    onGoalsChange(nextGoals)
    window.localStorage.setItem(
      dashboardGoalsStorageKey,
      JSON.stringify(nextGoals)
    )
    setIsReviewOpen(false)
  }

  function openGoalsReview() {
    setDraftGoals(goals)
    setIsReviewOpen(true)
  }

  return (
    <div className="admin-split-grid">
      <SectionCard
        title="Metas do mes"
        description="Acompanhamento dos objetivos principais"
        action={
          <Button size="sm" onClick={openGoalsReview}>
            Revisar metas
          </Button>
        }
      >
        <div className="space-y-5">
          {goals.map((goal) => (
            <div key={goal.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{goal.label}</span>
                <span className="text-muted-foreground">
                  {formatGoalValue(goal.current, goal.kind)} /{" "}
                  {formatGoalValue(goal.target, goal.kind)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${Math.min(calculateGoalProgress(goal), 100)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {calculateGoalProgress(goal)}% concluido
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={saveGoals}>
            <DialogHeader>
              <DialogTitle>Revisar metas</DialogTitle>
              <DialogDescription>
                Ajuste os objetivos do mes. O realizado atual permanece vindo do
                painel.
              </DialogDescription>
            </DialogHeader>

            <DialogBody className="space-y-4">
              {draftGoals.map((goal) => (
                <div key={goal.id} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={`goal-${goal.id}`}>{goal.label}</Label>
                    <span className="text-xs text-muted-foreground">
                      Realizado: {formatGoalValue(goal.current, goal.kind)}
                    </span>
                  </div>
                  <Input
                    id={`goal-${goal.id}`}
                    min={1}
                    inputMode="numeric"
                    type="number"
                    value={goal.target}
                    onChange={(event) =>
                      updateDraftGoal(goal.id, Number(event.target.value))
                    }
                  />
                </div>
              ))}
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReviewOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar metas</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <SectionCard title="Horarios de pico" description="Ultimos 30 dias">
        <PeakHoursChart />
      </SectionCard>
    </div>
  )
}

function WeeklyRevenueChart() {
  if (revenue.length === 0) {
    return (
      <EmptyState
        icon={ChartBarLineIcon}
        title="Sem dados de receita"
        description="Ainda não há registros financeiros suficientes para gerar o gráfico semanal."
        className="min-h-[200px]"
      />
    )
  }

  const totalGross = revenue.reduce((sum, item) => sum + item.gross, 0)
  const totalNet = revenue.reduce((sum, item) => sum + item.net, 0)
  const totalPrevious = revenue.reduce((sum, item) => sum + item.previous, 0)
  const totalAppointments = revenue.reduce(
    (sum, item) => sum + item.appointments,
    0
  )
  const maxValue = Math.max(
    ...revenue.map((item) => Math.max(item.gross, item.previous))
  )
  const weeklyDelta =
    totalPrevious > 0
      ? Math.round(((totalGross - totalPrevious) / totalPrevious) * 100)
      : 0
  const weeklyPaymentMix = buildWeeklyPaymentMix(totalGross)
  const totalPayments = weeklyPaymentMix.reduce(
    (sum, item) => sum + item.value,
    0
  )
  const weeklyFees = estimatePaymentFees(weeklyPaymentMix)
  const weeklyExpenses = 0 // Deve vir de consulta filtrada por data no back-end
  const weeklyMargin =
    totalGross > 0
      ? Math.round(((totalGross - weeklyExpenses) / totalGross) * 100)
      : 0

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/25 px-3 py-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">{revenuePeriod.label}</p>
          <p className="text-xs text-muted-foreground">
            vs. {revenuePeriod.comparison}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FinanceMiniCard label="Bruta" value={formatCurrency(totalGross)} />
        <FinanceMiniCard label="Liquida" value={formatCurrency(totalNet)} />
        <FinanceMiniCard
          label="Anterior"
          value={formatCurrency(totalPrevious)}
        />
        <FinanceMiniCard
          label="Variacao"
          value={`${weeklyDelta > 0 ? "+" : ""}${weeklyDelta}%`}
          positive={weeklyDelta >= 0}
        />
      </div>

      <div className="rounded-md border bg-muted/25 p-3">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Por dia
            </p>
            <p className="text-sm text-muted-foreground">
              Realizado x anterior
            </p>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-primary" />
              Realizado
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              Periodo ant.
            </span>
          </div>
        </div>

        <div className="flex h-56 items-end gap-2 sm:h-64 sm:gap-3">
          {revenue.map((item) => {
            const grossHeight = getChartHeight(item.gross, maxValue)
            const previousHeight = getChartHeight(item.previous, maxValue)
            const delta = formatRevenueDelta(item.gross, item.previous)

            return (
              <div
                key={item.day}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div className="relative flex h-40 w-full items-end rounded-md bg-background shadow-inner sm:h-48">
                  <span
                    className="absolute right-1 bottom-0 left-1 rounded-md bg-muted-foreground/20"
                    style={{ height: `${previousHeight}%` }}
                  />
                  <div
                    className="relative z-10 w-full rounded-md bg-primary transition-all"
                    style={{ height: `${grossHeight}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-semibold">
                    {item.weekday}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {item.day}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {formatCompactCurrency(item.gross)}
                  </span>
                  <span
                    className={cn(
                      "block text-[11px] font-medium",
                      delta.className
                    )}
                  >
                    {delta.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="rounded-md border p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Formas de pagamento</p>
              <p className="text-xs text-muted-foreground">
                Distribuicao da receita bruta semanal
              </p>
            </div>
            <span className="text-sm font-semibold">
              {formatCurrency(totalPayments)}
            </span>
          </div>

          <div className="flex h-3 overflow-hidden rounded-full bg-muted">
            {weeklyPaymentMix.map((item) => (
              <span
                key={item.label}
                className={item.tone}
                style={{
                  width: `${totalPayments > 0 ? (item.value / totalPayments) * 100 : 0}%`,
                }}
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {weeklyPaymentMix.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2 py-1.5 text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <span className={cn("size-2 rounded-full", item.tone)} />
                  {item.label}
                </span>
                <span className="font-semibold">
                  {formatCompactCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
          <FinanceMiniCard
            label="Atendimentos"
            value={String(totalAppointments)}
          />
          <FinanceMiniCard
            label="Ticket medio"
            value={formatCurrency(averageTicket)}
          />
          <FinanceMiniCard
            label="Taxas estimadas"
            value={formatCurrency(weeklyFees)}
            positive={false}
          />
          <FinanceMiniCard
            label="Margem operacional"
            value={`${weeklyMargin}%`}
          />
        </div>
      </div>
    </div>
  )
}

function PeakHoursChart() {
  if (peakHours.length === 0) {
    return (
      <EmptyState
        icon={Clock01Icon}
        title="Sem horários de pico"
        description="Agende os primeiros serviços para descobrir quais são os horários mais movimentados."
        className="min-h-[200px]"
      />
    )
  }

  const totalAppointments = peakHours.reduce(
    (sum, item) => sum + item.appointments,
    0
  )
  const totalRevenue = peakHours.reduce((sum, item) => sum + item.revenue, 0)
  const busiest = peakHours.reduce(
    (best, item) => (item.appointments > best.appointments ? item : best),
    peakHours[0]
  )
  const maxAppointments =
    peakHours.length > 0
      ? Math.max(...peakHours.map((item) => item.appointments))
      : 0
  const afternoonAppointments = peakHours
    .filter((item) => Number(item.time.slice(0, 2)) >= 14)
    .reduce((sum, item) => sum + item.appointments, 0)
  const afternoonShare = Math.round(
    (afternoonAppointments / totalAppointments) * 100
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FinanceMiniCard
          label="Atendimentos"
          value={String(totalAppointments)}
        />
        <FinanceMiniCard label="Horario lider" value={busiest.time} />
        <FinanceMiniCard
          label="Receita associada"
          value={formatCurrency(totalRevenue)}
        />
        <FinanceMiniCard label="Apos 14h" value={`${afternoonShare}%`} />
      </div>

      <div className="rounded-md border bg-muted/25 p-3">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Ultimos 30 dias
            </p>
            <p className="text-sm text-muted-foreground">
              Agendamentos por horario
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Pico: {busiest.time} - {busiest.appointments} ag.
          </div>
        </div>

        <div className="space-y-2">
          {peakHours.map((item) => {
            const width = (item.appointments / maxAppointments) * 100
            const isPeak = item.time === busiest.time

            return (
              <div
                key={item.time}
                className="grid grid-cols-[3.25rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-sm"
              >
                <span className="font-medium">{item.time}</span>
                <div className="h-8 rounded-md bg-background p-1">
                  <div
                    className={cn(
                      "flex h-full items-center justify-end rounded-sm px-2 text-[11px] font-semibold",
                      isPeak
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/70 text-primary-foreground"
                    )}
                    style={{ width: `${width}%` }}
                  >
                    {item.occupancy}%
                  </div>
                </div>
                <span className="text-right text-xs text-muted-foreground">
                  {item.appointments} ag.
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {peakHours
          .slice()
          .sort((a, b) => b.appointments - a.appointments)
          .slice(0, 3)
          .map((item, index) => (
            <div
              key={item.time}
              className="rounded-md border bg-background p-3"
            >
              <p className="text-xs font-medium text-muted-foreground">
                #{index + 1} pico
              </p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <strong className="text-xl">{item.time}</strong>
                <span className="text-sm font-semibold">
                  {item.appointments} ag.
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCurrency(item.revenue)} em receita vinculada
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

function buildWeeklyPaymentMix(totalGross: number) {
  return database.paymentMethods.map((method, index) => {
    return {
      label: method.name,
      value: 0, // No período atual (hoje/semana), deve ser calculado do caixa real
      fee: method.fee,
      tone: paymentTones[index % paymentTones.length],
    }
  })
}

function estimatePaymentFees(
  paymentMix: ReturnType<typeof buildWeeklyPaymentMix>
) {
  return Math.round(
    paymentMix.reduce((sum, item) => sum + item.value * (item.fee / 100), 0)
  )
}

function getChartHeight(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) {
    return 0
  }

  return Math.max((value / maxValue) * 100, 6)
}

function formatRevenueDelta(gross: number, previous: number) {
  if (previous <= 0) {
    return gross > 0
      ? { label: "Novo", className: "text-primary" }
      : { label: "Fechado", className: "text-muted-foreground" }
  }

  const delta = Math.round(((gross - previous) / previous) * 100)

  return {
    label: `${delta > 0 ? "+" : ""}${delta}%`,
    className: delta >= 0 ? "text-primary" : "text-destructive",
  }
}

function FinanceMiniCard({
  label,
  value,
  positive = true,
}: {
  label: string
  value: string
  positive?: boolean
}) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-semibold tracking-normal",
          positive ? "text-foreground" : "text-destructive"
        )}
      >
        {value}
      </p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function getComandaTotal(comanda: (typeof database.comandas)[number]) {
  return (
    comanda.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    ) - (comanda.discount ?? 0)
  )
}

function readSavedGoals() {
  if (typeof window === "undefined") {
    return initialGoals
  }

  const savedGoals = window.localStorage.getItem(dashboardGoalsStorageKey)

  if (!savedGoals) {
    return initialGoals
  }

  try {
    const parsedGoals = JSON.parse(savedGoals) as Partial<Goal>[]

    return initialGoals.map((goal) => {
      const savedGoal = parsedGoals.find((item) => item.id === goal.id)

      return {
        ...goal,
        target:
          typeof savedGoal?.target === "number" && savedGoal.target > 0
            ? savedGoal.target
            : goal.target,
      }
    })
  } catch {
    window.localStorage.removeItem(dashboardGoalsStorageKey)
    return initialGoals
  }
}

function formatGoalValue(value: number, kind: GoalKind) {
  return kind === "currency" ? formatCurrency(value) : String(value)
}

function calculateGoalProgress(goal: Goal) {
  if (goal.target <= 0) {
    return 0
  }

  return Math.round((goal.current / goal.target) * 100)
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}
