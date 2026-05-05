"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Scissor01Icon,
  UserMultipleIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { AgendaEvent } from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
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
import { cn } from "@/lib/utils"

import {
  formatCurrency,
  formatDateTime,
  formatLongDate,
  formatShortDate,
  getAppointmentDuration,
  getCancelDeadline,
  getEndTime,
  getAppointmentService,
  isAppointmentCancelable,
} from "./booking-logic"
import { BookingDateTimePicker } from "./booking-date-time-picker"
import {
  getDateOptions,
  TIME_SLOTS,
  type AppointmentReschedule,
} from "./portal-data"
import { useClientPortal, useMergedAppointments } from "./portal-provider"
import { SectionTitle } from "./section-title"

export function PortalAppointmentsView() {
  const { activeServices, updateSession, session, clientProfile } = useClientPortal()
  const merged = useMergedAppointments()
  const [details, setDetails] = useState<AgendaEvent | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<AgendaEvent | null>(
    null
  )
  const [cancelTarget, setCancelTarget] = useState<AgendaEvent | null>(null)
  const [rescheduleDateId, setRescheduleDateId] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("10:00")

  const dateOptions = useMemo(() => getDateOptions(), [])

  const appointments = useMemo(() => {
    return merged.filter((a) => !session.canceledIds.includes(a.id))
  }, [merged, session.canceledIds])

  const activeCount = appointments.length

  function openReschedule(a: AgendaEvent) {
    setRescheduleTarget(a)
    setRescheduleDateId(a.date)
    setRescheduleTime(a.start)
  }

  function confirmReschedule() {
    if (!rescheduleTarget) return
    const duration = getAppointmentDuration(rescheduleTarget, activeServices)
    const patch: AppointmentReschedule = {
      date: rescheduleDateId,
      start: rescheduleTime,
      end: getEndTime(rescheduleTime, duration),
    }
    updateSession((prev) => ({
      ...prev,
      rescheduled: {
        ...prev.rescheduled,
        [String(rescheduleTarget.id)]: patch,
      },
    }))
    setRescheduleTarget(null)
  }

  function confirmCancel() {
    if (!cancelTarget || !isAppointmentCancelable(cancelTarget)) return
    updateSession((prev) => ({
      ...prev,
      canceledIds: [...prev.canceledIds, cancelTarget.id],
    }))
    setCancelTarget(null)
    setDetails((current) =>
      current?.id === cancelTarget.id ? null : current
    )
  }

  const nextSlot =
    appointments[0] &&
    `${formatShortDate(appointments[0].date)} | ${appointments[0].start}`

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:max-w-2xl sm:py-10">
      <SectionTitle
        eyebrow="Agenda"
        title="Meus horarios"
        description="Seus agendamentos."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <MetricCard
          icon={Calendar03Icon}
          label="Proximo"
          value={nextSlot ?? "Sem reserva"}
        />
        <MetricCard
          icon={CheckmarkCircle01Icon}
          label="Ativos"
          value={`${activeCount}`}
        />
        <MetricCard
          icon={Clock01Icon}
          label="Cliente"
          value={clientProfile?.name?.split(" ")[0] ?? "-"}
        />
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          icon={Calendar03Icon}
          title="Nenhum agendamento"
          description="Marque um horario para ver aqui."
          className="client-card"
          actionLabel="Agendar"
          href="/cliente/agendar"
        />
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="client-card overflow-hidden p-0 shadow-sm"
            >
              <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {formatLongDate(appointment.date)}
                </p>
                <p className="mt-1 text-lg font-semibold">{appointment.detail}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.start} - {appointment.end} | {appointment.barber}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 px-4 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => openReschedule(appointment)}
                >
                  Remarcar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 text-destructive hover:text-destructive"
                  disabled={!isAppointmentCancelable(appointment)}
                  onClick={() => setCancelTarget(appointment)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-9 gap-1 sm:ml-auto"
                  onClick={() => setDetails(appointment)}
                >
                  Detalhes
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex justify-center">
        <Button className="green-shine" asChild>
          <Link href="/cliente/agendar">Novo agendamento</Link>
        </Button>
      </div>

      <AppointmentDetailsDialog
        appointment={details}
        activeServices={activeServices}
        onClose={() => setDetails(null)}
      />

      <Dialog
        open={Boolean(rescheduleTarget)}
        onOpenChange={(open) => {
          if (!open) setRescheduleTarget(null)
        }}
      >
        <DialogContent className="client-dialog">
          <DialogHeader>
            <DialogTitle>Remarcar</DialogTitle>
            <DialogDescription>Escolha data e horario.</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <BookingDateTimePicker
              dates={dateOptions.map((date) => ({
                id: date.id,
                weekday: date.weekday,
                day: date.day,
                label: date.label,
              }))}
              times={TIME_SLOTS.map((slot) => ({
                time: slot.time,
                disabled: !slot.available,
              }))}
              selectedDateId={rescheduleDateId}
              selectedTime={rescheduleTime}
              onDateChange={setRescheduleDateId}
              onTimeChange={setRescheduleTime}
            />
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRescheduleTarget(null)}>
              Voltar
            </Button>
            <Button type="button" onClick={confirmReschedule}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null)
        }}
      >
        <DialogContent className="client-dialog">
          <DialogHeader>
            <DialogTitle>Cancelar agendamento</DialogTitle>
            <DialogDescription>
              Cancelamento liberado ate 1 hora apos criar o agendamento (regra
              de demonstracao).
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {cancelTarget ? <CancelBody appointment={cancelTarget} /> : null}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={
                !cancelTarget || !isAppointmentCancelable(cancelTarget)
              }
              onClick={confirmCancel}
            >
              Cancelar reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: typeof Calendar03Icon
  label: string
  value: string
}) {
  return (
    <div className="client-card flex items-center gap-3 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <HugeiconsIcon icon={icon} size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}

function AppointmentDetailsDialog({
  appointment,
  activeServices,
  onClose,
}: {
  appointment: AgendaEvent | null
  activeServices: ReturnType<
    typeof import("./portal-data").getActiveServices
  >
  onClose: () => void
}) {
  const service = appointment
    ? getAppointmentService(appointment, activeServices)
    : undefined
  const duration = appointment
    ? service?.durationMinutes ??
      getAppointmentDuration(appointment, activeServices)
    : 0
  const deadline = appointment ? getCancelDeadline(appointment) : null

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="client-dialog">
        <DialogHeader>
          <DialogTitle>Detalhes</DialogTitle>
          <DialogDescription>Sua reserva (dados de demonstracao).</DialogDescription>
        </DialogHeader>
        {appointment ? (
          <DialogBody className="grid gap-3 sm:grid-cols-2">
            <DetailRow
              icon={Calendar03Icon}
              label="Data"
              value={formatLongDate(appointment.date)}
            />
            <DetailRow
              icon={Clock01Icon}
              label="Horario"
              value={`${appointment.start} - ${appointment.end}`}
            />
            <DetailRow
              icon={Scissor01Icon}
              label="Servico"
              value={appointment.detail}
            />
            <DetailRow
              icon={Clock01Icon}
              label="Duracao"
              value={`${duration} min`}
            />
            <DetailRow
              icon={UserMultipleIcon}
              label="Profissional"
              value={appointment.barber}
            />
            <DetailRow
              icon={Wallet02Icon}
              label="Valor"
              value={service ? formatCurrency(service.price) : "-"}
            />
            <DetailRow
              icon={CheckmarkCircle01Icon}
              label="Cancelar ate"
              value={
                deadline ? formatDateTime(deadline) : "Indisponivel"
              }
            />
          </DialogBody>
        ) : null}
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: typeof Calendar03Icon
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
      <HugeiconsIcon icon={icon} size={18} className="mt-0.5 shrink-0 text-primary" />
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function CancelBody({ appointment }: { appointment: AgendaEvent }) {
  const canCancel = isAppointmentCancelable(appointment)
  const deadline = getCancelDeadline(appointment)

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-xl border p-4",
          canCancel ? "border-amber-500/30 bg-amber-500/10" : "border-border"
        )}
      >
        <p className="text-sm font-medium">{appointment.detail}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatLongDate(appointment.date)} | {appointment.start}
        </p>
        <p className="mt-2 text-xs">
          {canCancel
            ? `Voce pode cancelar ate ${deadline ? formatDateTime(deadline) : ""}.`
            : "O prazo para cancelamento ja expirou."}
        </p>
      </div>
    </div>
  )
}

