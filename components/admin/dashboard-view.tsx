"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Calendar03Icon,
  ChartIncreaseIcon,
  CrownIcon,
  MoneyReceiveCircleIcon,
  UserMultipleIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DashboardMode = "operacional" | "estrategica"

const operationalMetrics = [
  {
    title: "Faturamento hoje",
    value: "R$ 1.840",
    change: "+18% em relacao a ontem",
    icon: MoneyReceiveCircleIcon,
    tone: "green" as const,
  },
  {
    title: "Agendamentos",
    value: "26",
    change: "9 ainda aguardando confirmacao",
    icon: Calendar03Icon,
    tone: "blue" as const,
  },
  {
    title: "Clientes ativos",
    value: "482",
    change: "32 novos neste mes",
    icon: UserMultipleIcon,
    tone: "amber" as const,
  },
  {
    title: "Ticket medio",
    value: "R$ 71",
    change: "+R$ 6 nos ultimos 7 dias",
    icon: ChartIncreaseIcon,
    tone: "green" as const,
  },
]

const strategicMetrics = [
  {
    title: "Receita mensal",
    value: "R$ 36.740",
    change: "Meta do mes em 72%",
    icon: ChartIncreaseIcon,
    tone: "green" as const,
  },
  {
    title: "Assinantes",
    value: "154",
    change: "+18 novos no mes",
    icon: CrownIcon,
    tone: "blue" as const,
  },
  {
    title: "Retencao",
    value: "86%",
    change: "+4 p.p. nos ultimos 30 dias",
    icon: UserMultipleIcon,
    tone: "amber" as const,
  },
  {
    title: "Margem estimada",
    value: "38,6%",
    change: "+2,1 p.p. vs mes anterior",
    icon: Wallet02Icon,
    tone: "green" as const,
  },
]

const appointments = [
  [
    "09:00",
    "Rafael Lima",
    "Corte + barba",
    "Bruno",
    <StatusBadge key="confirmed" tone="green">
      Confirmado
    </StatusBadge>,
  ],
  [
    "10:30",
    "Mateus Alves",
    "Degrade",
    "Caio",
    <StatusBadge key="waiting" tone="amber">
      Aguardando
    </StatusBadge>,
  ],
  [
    "13:00",
    "Pedro Santos",
    "Barba",
    "Bruno",
    <StatusBadge key="paid" tone="blue">
      Pago online
    </StatusBadge>,
  ],
  [
    "15:30",
    "Lucas Rocha",
    "Corte premium",
    "Diego",
    <StatusBadge key="late" tone="red">
      Atrasado
    </StatusBadge>,
  ],
]

const revenue = [
  { day: "22/04", weekday: "Qua", gross: 1120, net: 952, previous: 980 },
  { day: "23/04", weekday: "Qui", gross: 1810, net: 1539, previous: 1490 },
  { day: "24/04", weekday: "Sex", gross: 1980, net: 1683, previous: 1720 },
  { day: "25/04", weekday: "Sab", gross: 2140, net: 1819, previous: 1870 },
  { day: "26/04", weekday: "Dom", gross: 760, net: 646, previous: 680 },
  { day: "27/04", weekday: "Seg", gross: 1280, net: 1088, previous: 1100 },
  { day: "28/04", weekday: "Ter", gross: 1640, net: 1394, previous: 1420 },
]

const revenuePeriod = {
  label: "22/04/2026 a 28/04/2026",
  comparison: "15/04/2026 a 21/04/2026",
}

const paymentMix = [
  { label: "Pix", value: 4520, tone: "bg-primary" },
  { label: "Credito", value: 3180, tone: "bg-sky-500" },
  { label: "Debito", value: 1850, tone: "bg-amber-500" },
  { label: "Dinheiro", value: 1180, tone: "bg-zinc-400" },
]

const financeSummary = {
  services: 132,
  fees: 1610,
  averageTicket: 81,
  margin: 85,
}

const goals = [
  { label: "Meta de faturamento", current: "R$ 36.740", target: "R$ 51.000", progress: 72 },
  { label: "Novos clientes", current: "32", target: "45", progress: 71 },
  { label: "Assinaturas", current: "154", target: "180", progress: 86 },
]

const peakHours = [
  { time: "09:00", appointments: 42, revenue: 2980, occupancy: 68 },
  { time: "10:00", appointments: 58, revenue: 4310, occupancy: 81 },
  { time: "11:00", appointments: 51, revenue: 3890, occupancy: 76 },
  { time: "12:00", appointments: 18, revenue: 1210, occupancy: 32 },
  { time: "13:00", appointments: 29, revenue: 2040, occupancy: 48 },
  { time: "14:00", appointments: 46, revenue: 3420, occupancy: 71 },
  { time: "15:00", appointments: 64, revenue: 4920, occupancy: 88 },
  { time: "16:00", appointments: 72, revenue: 5580, occupancy: 94 },
  { time: "17:00", appointments: 69, revenue: 5290, occupancy: 91 },
  { time: "18:00", appointments: 37, revenue: 2760, occupancy: 62 },
]

export function DashboardView() {
  const [mode, setMode] = useState<DashboardMode>("operacional")

  const isOperational = mode === "operacional"
  const metrics = isOperational ? operationalMetrics : strategicMetrics

  const title = useMemo(
    () =>
      isOperational
        ? "Operacional do dia"
        : "Estrategia e crescimento",
    [isOperational]
  )

  return (
    <>
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

      {isOperational ? <OperationalDashboard /> : <StrategicDashboard />}
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
        <SimpleTable
          columns={["Horario", "Cliente", "Servico", "Barbeiro", "Status"]}
          rows={appointments}
        />
      </SectionCard>

      <SectionCard
        title="Receita"
        description="22/04 a 28/04"
      >
        <WeeklyRevenueChart />
      </SectionCard>
    </div>
  )
}

function StrategicDashboard() {
  return (
    <div className="admin-split-grid">
      <SectionCard
        title="Metas do mes"
        description="Acompanhamento dos objetivos principais"
        action={<Button size="sm">Revisar metas</Button>}
      >
        <div className="space-y-5">
          {goals.map((goal) => (
            <div key={goal.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{goal.label}</span>
                <span className="text-muted-foreground">
                  {goal.current} / {goal.target}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Horarios de pico"
        description="Ultimos 30 dias"
      >
        <PeakHoursChart />
      </SectionCard>
    </div>
  )
}

function WeeklyRevenueChart() {
  const totalGross = revenue.reduce((sum, item) => sum + item.gross, 0)
  const totalNet = revenue.reduce((sum, item) => sum + item.net, 0)
  const totalPrevious = revenue.reduce((sum, item) => sum + item.previous, 0)
  const maxValue = Math.max(...revenue.map((item) => Math.max(item.gross, item.previous)))
  const weeklyDelta = Math.round(((totalGross - totalPrevious) / totalPrevious) * 100)
  const totalPayments = paymentMix.reduce((sum, item) => sum + item.value, 0)

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
        <FinanceMiniCard label="Anterior" value={formatCurrency(totalPrevious)} />
        <FinanceMiniCard
          label="Variacao"
          value={`${weeklyDelta > 0 ? "+" : ""}${weeklyDelta}%`}
          positive={weeklyDelta >= 0}
        />
      </div>

      <div className="rounded-md border bg-muted/25 p-3">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
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
            const grossHeight = Math.max((item.gross / maxValue) * 100, 8)
            const previousHeight = Math.max((item.previous / maxValue) * 100, 8)
            const delta = Math.round(((item.gross - item.previous) / item.previous) * 100)

            return (
              <div
                key={item.day}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div className="relative flex h-40 w-full items-end rounded-md bg-background shadow-inner sm:h-48">
                  <span
                    className="absolute bottom-0 left-1 right-1 rounded-md bg-muted-foreground/20"
                    style={{ height: `${previousHeight}%` }}
                  />
                  <div
                    className="relative z-10 w-full rounded-md bg-primary transition-all"
                    style={{ height: `${grossHeight}%` }}
                  />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-semibold">{item.weekday}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {item.day}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {formatCompactCurrency(item.gross)}
                  </span>
                  <span
                    className={cn(
                      "block text-[11px] font-medium",
                      delta >= 0 ? "text-primary" : "text-destructive"
                    )}
                  >
                    {delta >= 0 ? "+" : ""}
                    {delta}%
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
                Distribuicao da receita bruta
              </p>
            </div>
            <span className="text-sm font-semibold">
              {formatCurrency(totalPayments)}
            </span>
          </div>

          <div className="flex h-3 overflow-hidden rounded-full bg-muted">
            {paymentMix.map((item) => (
              <span
                key={item.label}
                className={item.tone}
                style={{ width: `${(item.value / totalPayments) * 100}%` }}
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {paymentMix.map((item) => (
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
            value={String(financeSummary.services)}
          />
          <FinanceMiniCard
            label="Ticket medio"
            value={formatCurrency(financeSummary.averageTicket)}
          />
          <FinanceMiniCard
            label="Taxas estimadas"
            value={formatCurrency(financeSummary.fees)}
            positive={false}
          />
          <FinanceMiniCard
            label="Margem liquida"
            value={`${financeSummary.margin}%`}
          />
        </div>
      </div>
    </div>
  )
}

function PeakHoursChart() {
  const totalAppointments = peakHours.reduce(
    (sum, item) => sum + item.appointments,
    0
  )
  const totalRevenue = peakHours.reduce((sum, item) => sum + item.revenue, 0)
  const busiest = peakHours.reduce((best, item) =>
    item.appointments > best.appointments ? item : best
  )
  const maxAppointments = Math.max(...peakHours.map((item) => item.appointments))
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
            <p className="text-xs font-medium uppercase text-muted-foreground">
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
            <div key={item.time} className="rounded-md border bg-background p-3">
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

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}
