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
  const [cartOpen, setCartOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

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

  const selectedServiceItems = useMemo(
    () => selectedServices.filter((s): s is ServiceCatalogItem => Boolean(s)),
    [selectedServices]
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
        selectedServiceItems.map((s) => s.name).join(" + ") ||
        "Atendimento",
      type: "appointment",
    }

    addBooking(event)
    setSuccessOpen(true)
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
            services={selectedServiceItems}
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

      {selectedServiceItems.length > 0 ? (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-[5.7rem] right-4 z-40 flex items-center gap-2 rounded-full border border-primary/45 bg-background/95 px-4 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur-md"
        >
          <CartIcon />
          <span>{selectedServiceItems.length} selecionado(s)</span>
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {selectedServiceItems.length}
          </span>
        </button>
      ) : null}

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="client-dialog sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Carrinho de servicos</DialogTitle>
            <DialogDescription>
              Itens selecionados para este agendamento.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <ul className="space-y-2">
              {selectedServiceItems.map((service) => (
                <li
                  key={service.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-3 text-sm"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{service.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {service.duration}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-muted-foreground">
                    {formatCurrency(service.price)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-3 text-sm">
              <span className="text-muted-foreground">Total estimado</span>
              <span className="font-semibold">
                {formatCurrency(
                  selectedServiceItems.reduce((sum, service) => sum + service.price, 0)
                )}
              </span>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" onClick={() => setCartOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="client-dialog overflow-hidden sm:max-w-md">
          <DialogHeader className="border-b border-border/80 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary),white_75%)_0%,color-mix(in_oklch,var(--background),var(--primary)_12%)_100%)]">
            <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={34} />
            </div>
            <DialogTitle className="text-center text-xl">Pagamento aprovado</DialogTitle>
            <DialogDescription className="text-center">
              Agendamento confirmado com sucesso.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3 text-sm">
            <div className="rounded-xl border border-border/80 bg-muted/25 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Resumo da reserva
              </p>
              <div className="mt-3 grid gap-2">
                <p className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-medium">
                    {selectedDate ? formatShortDate(selectedDate.id) : "-"}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Horario</span>
                  <span className="font-medium">{time}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Servicos</span>
                  <span className="font-medium">{selectedServiceItems.length}</span>
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary-contrast">
              Seu atendimento ja esta na sua agenda.
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              className="green-shine w-full"
              onClick={() => {
                setSuccessOpen(false)
                router.push("/cliente/agendamentos")
              }}
            >
              Ver meus horarios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M3 4h2.1a1 1 0 0 1 .97.75l.48 1.85m0 0 1.5 5.9a1.8 1.8 0 0 0 1.75 1.35h7.95a1.8 1.8 0 0 0 1.75-1.35L21 8.2a1 1 0 0 0-.96-1.25H6.55Z" />
    </svg>
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
