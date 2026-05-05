"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Scissor01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  database,
  type AgendaEvent,
  type ServiceCatalogItem,
} from "@/components/admin/database"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  type BookingServiceLine,
  type BookingStep,
  formatCurrency,
  formatShortDate,
  getBookingFlow,
  getBookingServiceLine,
  getCanContinueBooking,
  getEndTime,
  getInitialBookingService,
  getPlanServiceIds,
  getUsedPlanCredits,
} from "./booking-logic"
import {
  getActiveProfessionals,
  getDateOptions,
  portalCustomer,
  TIME_SLOTS,
  type DateOption,
} from "./portal-data"
import { BookingDateTimePicker } from "./booking-date-time-picker"
import { useClientPortal } from "./portal-provider"

export function PortalBookingView() {
  const router = useRouter()
  const {
    subscription,
    currentPlan,
    activeServices,
    session,
    addBooking,
    clientProfile,
  } = useClientPortal()

  const professionals = useMemo(() => getActiveProfessionals(), [])
  const dateOptions = useMemo(() => getDateOptions(), [])
  const hasSubscription = Boolean(subscription)
  const bookingFlow = useMemo(
    () => getBookingFlow(hasSubscription),
    [hasSubscription]
  )

  const [bookingStep, setBookingStep] = useState<BookingStep>("service")
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(() => {
    const initial = getInitialBookingService(activeServices, currentPlan)
    return initial ? [initial.id] : []
  })
  const [professionalId, setProfessionalId] = useState(
    professionals[0]?.id ?? 0
  )
  const [dateId, setDateId] = useState(dateOptions[0]?.id ?? "")
  const [time, setTime] = useState("10:00")

  const planServiceIds = useMemo(
    () => getPlanServiceIds(activeServices, currentPlan?.name),
    [activeServices, currentPlan?.name]
  )

  const usedPlanCredits = useMemo(
    () =>
      getUsedPlanCredits(
        planServiceIds,
        activeServices,
        portalCustomer?.name,
        database.agendaEvents,
        session.extraAppointments
      ),
    [planServiceIds, activeServices, session.extraAppointments]
  )

  const remainingPlanCredits = Math.max(
    (currentPlan?.servicesLimit ?? 0) - usedPlanCredits,
    0
  )

  const includedServices = useMemo(
    () =>
      hasSubscription
        ? activeServices.filter(
            (service) =>
              planServiceIds.includes(service.id) &&
              service.credits <= remainingPlanCredits
          )
        : [],
    [hasSubscription, activeServices, planServiceIds, remainingPlanCredits]
  )

  const extraServices = useMemo(
    () =>
      hasSubscription
        ? activeServices.filter(
            (service) =>
              !planServiceIds.includes(service.id) ||
              service.credits > remainingPlanCredits
          )
        : activeServices,
    [hasSubscription, activeServices, planServiceIds, remainingPlanCredits]
  )

  const selectedServices = useMemo(
    () =>
      selectedServiceIds
        .map((id) => activeServices.find((s) => s.id === id))
        .filter(Boolean),
    [selectedServiceIds, activeServices]
  )

  const selectedProfessional = useMemo(
    () => professionals.find((p) => p.id === professionalId),
    [professionalId, professionals]
  )

  const selectedDate = useMemo(
    () => dateOptions.find((d) => d.id === dateId) ?? dateOptions[0],
    [dateId, dateOptions]
  )

  const selectedServiceLines = useMemo(() => {
    const lines: BookingServiceLine[] = []
    let remaining = remainingPlanCredits

    for (const service of selectedServices) {
      if (!service) continue
      const line = getBookingServiceLine(
        service,
        planServiceIds,
        hasSubscription,
        remaining
      )
      lines.push(line)
      if (line.kind === "plan") {
        remaining -= service.credits
      }
    }

    return lines
  }, [selectedServices, planServiceIds, hasSubscription, remainingPlanCredits])

  const bookingTotal = useMemo(
    () =>
      selectedServiceLines.reduce((total, item) => total + item.finalPrice, 0),
    [selectedServiceLines]
  )

  const canContinue = useMemo(
    () =>
      getCanContinueBooking({
        step: bookingStep,
        selectedServiceIds,
        professionalId,
        time,
        hasSubscription,
        planServiceIds,
        usedPlanCredits,
        servicesLimit: currentPlan?.servicesLimit ?? 0,
        activeServices,
      }),
    [
      bookingStep,
      selectedServiceIds,
      professionalId,
      time,
      hasSubscription,
      planServiceIds,
      usedPlanCredits,
      currentPlan?.servicesLimit,
      activeServices,
    ]
  )

  function toggleService(id: number) {
    setSelectedServiceIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  function goBack() {
    const idx = bookingFlow.findIndex((step) => step.id === bookingStep)
    if (idx <= 0) {
      router.push("/cliente")
      return
    }
    setBookingStep(bookingFlow[idx - 1].id)
  }

  function goNext() {
    const idx = bookingFlow.findIndex((step) => step.id === bookingStep)
    if (bookingFlow[idx + 1]) {
      setBookingStep(bookingFlow[idx + 1].id)
    }
  }

  function confirmBooking() {
    const duration = selectedServices.reduce(
      (total, service) => total + (service?.durationMinutes ?? 0),
      0
    )

    const event: AgendaEvent = {
      id: Date.now(),
      barber: selectedProfessional?.name ?? "Profissional",
      date: dateId,
      start: time,
      end: getEndTime(time, duration || 30),
      title: clientProfile?.name || portalCustomer?.name || "",
      detail:
        selectedServices.map((s) => s?.name).filter(Boolean).join(" + ") ||
        "Atendimento",
      type: "appointment",
    }

    addBooking(event)
    router.push("/cliente/agendamentos")
  }

  const stepIndex = bookingFlow.findIndex((s) => s.id === bookingStep)
  const stepMeta = bookingFlow[stepIndex]

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg overflow-x-hidden px-4 pb-10 pt-6 sm:max-w-2xl sm:pt-8">
      <header className="mb-4 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Agendar
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Novo horario</h1>
        {stepMeta ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Etapa {stepIndex + 1}/{bookingFlow.length} · {stepMeta.label}
          </p>
        ) : null}
      </header>

      <div
        className="mb-4 flex gap-1.5"
        role="progressbar"
        aria-valuenow={stepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={bookingFlow.length}
        aria-label="Progresso do agendamento"
      >
        {bookingFlow.map((step, i) => (
          <div
            key={step.id}
            className={cn(
              "h-1.5 min-w-0 flex-1 rounded-full",
              i <= stepIndex ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="client-card min-h-[220px] w-full min-w-0 max-w-full border-[oklch(0.857_0.1698_134.5554)] p-4 shadow-none sm:p-5">
        {bookingStep === "service" ? (
          <ServiceStep
            hasSubscription={hasSubscription}
            planName={currentPlan?.name}
            services={activeServices}
            includedServices={includedServices}
            extraServices={extraServices}
            selectedIds={selectedServiceIds}
            onToggle={toggleService}
            onShowExtras={() => setBookingStep("extras")}
          />
        ) : null}

        {bookingStep === "extras" ? (
          <ExtrasStep
            services={extraServices}
            selectedIds={selectedServiceIds}
            onToggle={toggleService}
          />
        ) : null}

        {bookingStep === "professional" ? (
          <ProfessionalPickStep
            professionals={professionals}
            selectedId={professionalId}
            onSelect={setProfessionalId}
          />
        ) : null}

        {bookingStep === "datetime" ? (
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
            selectedDateId={dateId}
            selectedTime={time}
            onDateChange={setDateId}
            onTimeChange={setTime}
          />
        ) : null}

        {bookingStep === "confirm" ? (
          <ConfirmStep
            lines={selectedServiceLines}
            professionalName={selectedProfessional?.name}
            selectedDate={selectedDate}
            time={time}
            total={bookingTotal}
            services={selectedServices.filter(
              (s): s is ServiceCatalogItem => Boolean(s)
            )}
          />
        ) : null}
      </div>

      <div className="mt-3 grid w-full min-w-0 grid-cols-1 items-stretch gap-2 min-[360px]:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          className="h-11 w-full min-w-0 gap-2"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          Voltar
        </Button>

        {bookingStep === "confirm" ? (
          <Button
            type="button"
            className="green-shine h-11 w-full min-w-0 gap-2"
            onClick={confirmBooking}
          >
            Confirmar
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
          </Button>
        ) : (
          <Button
            type="button"
            className="h-11 w-full min-w-0 gap-2"
            onClick={goNext}
            disabled={!canContinue}
          >
            Continuar
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}

function ServiceStep({
  hasSubscription,
  planName,
  services,
  includedServices,
  extraServices,
  selectedIds,
  onToggle,
  onShowExtras,
}: {
  hasSubscription: boolean
  planName?: string
  services: ServiceCatalogItem[]
  includedServices: ServiceCatalogItem[]
  extraServices: ServiceCatalogItem[]
  selectedIds: number[]
  onToggle: (id: number) => void
  onShowExtras: () => void
}) {
  if (!hasSubscription) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium">Servicos</p>
        <div className="grid gap-2">
          {services.map((service) => (
            <ServiceOptionCard
              key={service.id}
              service={service}
              selected={selectedIds.includes(service.id)}
              onClick={() => onToggle(service.id)}
              priceValue={formatCurrency(service.price)}
            />
          ))}
        </div>
        <div className="rounded-xl border border-[oklch(0.857_0.1698_134.5554)] p-3">
          <p className="text-xs text-muted-foreground">Quer desconto?</p>
          <Button size="sm" className="mt-2 h-8" asChild>
            <Link href="/cliente/planos">Comprar plano</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Incluidos no plano</p>
        <p className="text-xs text-muted-foreground">{planName ?? "Plano ativo"}</p>
      </div>

      {includedServices.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-3 py-3 text-sm text-muted-foreground">
          Sem creditos agora.
        </p>
      ) : (
        <div className="grid gap-2">
          {includedServices.map((service) => (
            <ServiceOptionCard
              key={service.id}
              service={service}
              selected={selectedIds.includes(service.id)}
              onClick={() => onToggle(service.id)}
              label="Incluido"
              priceValue="Incluido"
            />
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[oklch(0.857_0.1698_134.5554)] p-3">
        <p className="text-sm font-medium">Extras</p>
        <p className="text-xs text-muted-foreground">{extraServices.length} opcao(oes) com desconto</p>
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-8"
            onClick={onShowExtras}
            disabled={extraServices.length === 0}
          >
            Ver extras
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-8" asChild>
            <Link href="/cliente/planos">Plano</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ExtrasStep({
  services,
  selectedIds,
  onToggle,
}: {
  services: ServiceCatalogItem[]
  selectedIds: number[]
  onToggle: (id: number) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Extras (20%)</p>

      {services.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-3 py-3 text-sm text-muted-foreground">
          Sem extras agora.
        </p>
      ) : (
        <div className="grid gap-2">
          {services.map((service) => (
            <ServiceOptionCard
              key={service.id}
              service={service}
              selected={selectedIds.includes(service.id)}
              onClick={() => onToggle(service.id)}
              label="Extra"
              priceValue={formatCurrency(service.price * 0.8)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ServiceOptionCard({
  service,
  selected,
  onClick,
  label,
  priceValue,
}: {
  service: ServiceCatalogItem
  selected: boolean
  onClick: () => void
  label?: string
  priceValue?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-selected={selected}
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-3 text-left text-sm",
        selected && "border-primary bg-primary/10"
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <HugeiconsIcon
          icon={Scissor01Icon}
          size={16}
          className="shrink-0 text-primary"
        />
        <span className="min-w-0">
          <span className="block truncate font-medium">{service.name}</span>
          <span className="block text-xs text-muted-foreground">
            {service.duration}
            {label ? ` · ${label}` : ""}
          </span>
        </span>
      </span>

      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {priceValue ?? formatCurrency(service.price)}
      </span>
    </button>
  )
}

function ProfessionalPickStep({
  professionals,
  selectedId,
  onSelect,
}: {
  professionals: ReturnType<typeof getActiveProfessionals>
  selectedId: number
  onSelect: (id: number) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Profissional</p>
      <div className="grid gap-2">
        {professionals.map((professional) => {
          const selected = professional.id === selectedId
          return (
            <button
              key={professional.id}
              type="button"
              onClick={() => onSelect(professional.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-border px-3 py-3 text-left",
                selected ? "border-primary bg-primary/10" : "bg-card"
              )}
            >
              <HugeiconsIcon icon={UserMultipleIcon} size={18} className="text-primary" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {professional.name}
                </span>
                <span className="text-xs text-muted-foreground">{professional.role}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ConfirmStep({
  lines,
  professionalName,
  selectedDate,
  time,
  total,
  services,
}: {
  lines: BookingServiceLine[]
  professionalName?: string
  selectedDate: DateOption | undefined
  time: string
  total: number
  services: ServiceCatalogItem[]
}) {
  const duration = services.reduce((sum, service) => sum + service.durationMinutes, 0)

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Resumo</p>

      <ul className="divide-y divide-border rounded-xl border border-border">
        {lines.map((line) => (
          <li
            key={line.service.id}
            className="flex items-center justify-between gap-2 px-3 py-3 text-sm"
          >
            <span className="truncate">{line.service.name}</span>
            <span className="shrink-0 text-muted-foreground">
              {line.kind === "plan" ? "Incluido" : formatCurrency(line.finalPrice)}
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-2 text-sm">
        <div className="flex justify-between gap-2">
          <span className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon icon={UserMultipleIcon} size={16} />
            Profissional
          </span>
          <span className="truncate font-medium">{professionalName ?? "-"}</span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon icon={Calendar03Icon} size={16} />
            Data
          </span>
          <span className="font-medium">
            {selectedDate ? `${formatShortDate(selectedDate.id)} · ${time}` : "-"}
          </span>
        </div>

        <div className="flex justify-between gap-2">
          <span className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon icon={Clock01Icon} size={16} />
            Duracao
          </span>
          <span className="font-medium">{duration || "-"} min</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-3">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-semibold">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
