"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  UserSearch01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  addDays,
  formatCurrency,
  formatDateLabel,
  toDateInputValue,
  type ClientPortalProfessional,
  type ClientPortalService,
} from "@/components/client-portal/client-portal-data"
import { cn } from "@/lib/utils"

export type BookingPayload = {
  service: ClientPortalService
  professional: ClientPortalProfessional
  date: string
  time: string
}

type BookingStep = "service" | "professional" | "date" | "time" | "confirm"

const stepOrder: BookingStep[] = [
  "service",
  "professional",
  "date",
  "time",
  "confirm",
]

const stepLabels: Record<BookingStep, string> = {
  service: "Servico",
  professional: "Profissional",
  date: "Data",
  time: "Horario",
  confirm: "Confirmar",
}

const timeSlots = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"]

export function BookingFlow({
  open,
  services,
  professionals,
  initialServiceId,
  onClose,
  onConfirm,
  onViewAppointments,
}: {
  open: boolean
  services: ClientPortalService[]
  professionals: ClientPortalProfessional[]
  initialServiceId?: string
  onClose: () => void
  onConfirm: (payload: BookingPayload) => void
  onViewAppointments: () => void
}) {
  const [step, setStep] = useState<BookingStep>(
    initialServiceId ? "professional" : "service"
  )
  const [success, setSuccess] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState(
    initialServiceId || services[0]?.id || ""
  )
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(
    professionals[0]?.id || ""
  )
  const [selectedTime, setSelectedTime] = useState("")

  const dateOptions = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        toDateInputValue(addDays(new Date(), index + 1))
      ),
    []
  )
  const [selectedDate, setSelectedDate] = useState(dateOptions[0] || "")

  const selectedService = services.find(
    (service) => service.id === selectedServiceId
  )
  const selectedProfessional = professionals.find(
    (professional) => professional.id === selectedProfessionalId
  )
  const currentStepIndex = stepOrder.indexOf(step)

  if (!open) {
    return null
  }

  function goBack() {
    if (success) {
      onClose()
      return
    }

    if (currentStepIndex === 0) {
      onClose()
      return
    }

    setStep(stepOrder[currentStepIndex - 1])
  }

  function goNext() {
    if (step === "confirm") {
      if (!selectedService || !selectedProfessional) {
        return
      }

      onConfirm({
        service: selectedService,
        professional: selectedProfessional,
        date: selectedDate,
        time: selectedTime,
      })
      setSuccess(true)
      return
    }

    setStep(stepOrder[currentStepIndex + 1])
  }

  const canContinue =
    (step === "service" && Boolean(selectedService)) ||
    (step === "professional" && Boolean(selectedProfessional)) ||
    (step === "date" && Boolean(selectedDate)) ||
    (step === "time" && Boolean(selectedTime)) ||
    step === "confirm"

  return (
    <div className="fixed inset-y-0 left-1/2 z-[70] w-full max-w-[430px] -translate-x-1/2 border-x border-[var(--client-border,#d6e2db)] bg-[var(--client-bg,#f7faf6)] text-[var(--client-primary-dark,#0a3f28)]">
      <div className="flex h-dvh w-full flex-col bg-[var(--client-bg,#f7faf6)]">
        <div className="flex items-center justify-between border-b border-[rgba(11,51,36,0.10)] bg-white/90 px-5 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={goBack}
            className="grid size-10 place-items-center rounded-full border border-[rgba(11,51,36,0.12)] bg-white text-[#0a3f28] transition active:scale-95"
            aria-label="Voltar"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} aria-hidden />
          </button>
          <div className="text-center">
            <p className="text-[11px] font-black tracking-[0.08em] text-[#6f8178] uppercase">
              Agendamento
            </p>
            <h2 className="text-base font-black">
              {success ? "Confirmado" : stepLabels[step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full px-3 text-xs font-black text-[#6f8178] transition active:scale-95"
          >
            Fechar
          </button>
        </div>

        {success ? (
          <BookingSuccess
            service={selectedService}
            professional={selectedProfessional}
            date={selectedDate}
            time={selectedTime}
            onViewAppointments={onViewAppointments}
            onBookAnother={() => {
              setSuccess(false)
              setStep("service")
              setSelectedTime("")
            }}
          />
        ) : (
          <>
            <div className="px-5 pt-5">
              <div className="grid grid-cols-5 gap-2">
                {stepOrder.map((item, index) => (
                  <span
                    key={item}
                    className={cn(
                      "h-1.5 rounded-full",
                      index <= currentStepIndex
                        ? "bg-[var(--client-accent,#d8f23a)]"
                        : "bg-[rgba(11,51,36,0.10)]"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              {step === "service" && (
                <StepCard
                  title="Escolha um servico"
                  description="Selecione o atendimento que voce quer agendar."
                >
                  <div className="grid gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedServiceId(service.id)}
                        className={cn(
                          "client-choice-card text-left",
                          selectedServiceId === service.id &&
                            "client-choice-selected"
                        )}
                      >
                        <span>
                          <strong>{service.name}</strong>
                          <small>{service.durationMinutes}min</small>
                        </span>
                        <b>{formatCurrency(service.price)}</b>
                      </button>
                    ))}
                  </div>
                </StepCard>
              )}

              {step === "professional" && (
                <StepCard
                  title="Escolha o profissional"
                  description="Voce pode manter a recomendacao da barbearia."
                >
                  <div className="grid gap-3">
                    {professionals.map((professional) => (
                      <button
                        key={professional.id}
                        type="button"
                        onClick={() =>
                          setSelectedProfessionalId(professional.id)
                        }
                        className={cn(
                          "client-choice-card text-left",
                          selectedProfessionalId === professional.id &&
                            "client-choice-selected"
                        )}
                      >
                        <span>
                          <strong>{professional.name}</strong>
                          <small>{professional.role}</small>
                        </span>
                        <HugeiconsIcon
                          icon={UserSearch01Icon}
                          size={20}
                          aria-hidden
                        />
                      </button>
                    ))}
                  </div>
                </StepCard>
              )}

              {step === "date" && (
                <StepCard
                  title="Escolha a data"
                  description="Os proximos dias disponiveis aparecem abaixo."
                >
                  <div className="grid grid-cols-2 gap-3">
                    {dateOptions.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "rounded-[22px] border border-[rgba(11,51,36,0.10)] bg-white p-4 text-left text-sm font-black transition active:scale-[0.98]",
                          selectedDate === date && "client-choice-selected"
                        )}
                      >
                        <HugeiconsIcon
                          icon={Calendar03Icon}
                          size={18}
                          aria-hidden
                        />
                        <span className="mt-3 block capitalize">
                          {formatDateLabel(date)}
                        </span>
                      </button>
                    ))}
                  </div>
                </StepCard>
              )}

              {step === "time" && (
                <StepCard
                  title="Escolha o horario"
                  description="Toque em um horario para reservar sua vaga."
                >
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "rounded-[22px] border border-[rgba(11,51,36,0.10)] bg-white p-4 text-left text-sm font-black transition active:scale-[0.98]",
                          selectedTime === time && "client-choice-selected"
                        )}
                      >
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={18}
                          aria-hidden
                        />
                        <span className="mt-3 block">{time}</span>
                      </button>
                    ))}
                  </div>
                </StepCard>
              )}

              {step === "confirm" && (
                <StepCard
                  title="Confirme seu agendamento"
                  description="Revise os dados antes de concluir."
                >
                  <BookingSummary
                    service={selectedService}
                    professional={selectedProfessional}
                    date={selectedDate}
                    time={selectedTime}
                  />
                </StepCard>
              )}
            </div>

            <div className="border-t border-[rgba(11,51,36,0.10)] bg-white px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
              <BookingSummary
                compact
                service={selectedService}
                professional={selectedProfessional}
                date={selectedDate}
                time={selectedTime}
              />
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="client-button-lime mt-4 h-14 w-full uppercase disabled:opacity-50"
              >
                {step === "confirm" ? "Confirmar agendamento" : "Continuar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StepCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="text-[22px] leading-7 font-black">{title}</h3>
      <p className="mt-1 text-sm leading-5 font-medium text-[#6f8178]">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function BookingSummary({
  service,
  professional,
  date,
  time,
  compact,
}: {
  service?: ClientPortalService
  professional?: ClientPortalProfessional
  date: string
  time: string
  compact?: boolean
}) {
  if (!service) {
    return null
  }

  return (
    <div
      className={cn(
        "rounded-[24px] border border-[rgba(11,51,36,0.10)] bg-[rgba(11,51,36,0.04)] p-4",
        compact && "p-3"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{service.name}</p>
          <p className="mt-1 text-xs font-semibold text-[#6f8178]">
            {professional?.name || "Profissional"} -{" "}
            {date ? formatDateLabel(date) : "Data"} {time && `as ${time}`}
          </p>
        </div>
        <strong className="shrink-0 text-sm">
          {formatCurrency(service.price)}
        </strong>
      </div>
    </div>
  )
}

function BookingSuccess({
  service,
  professional,
  date,
  time,
  onViewAppointments,
  onBookAnother,
}: {
  service?: ClientPortalService
  professional?: ClientPortalProfessional
  date: string
  time: string
  onViewAppointments: () => void
  onBookAnother: () => void
}) {
  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-8">
      <div className="rounded-[32px] border border-[rgba(216,242,58,0.35)] bg-[var(--client-primary-dark,#0a3f28)] p-6 text-white">
        <div className="grid size-14 place-items-center rounded-full bg-[#d8f23a] text-[#0a3f28]">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} aria-hidden />
        </div>
        <h3 className="mt-5 text-2xl leading-7 font-black">
          Agendamento confirmado!
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/72">
          Seu horario foi salvo no portal da barbearia.
        </p>
        <div className="mt-5 rounded-[24px] border border-white/12 bg-white/10 p-4">
          <p className="font-black">{service?.name}</p>
          <p className="mt-1 text-sm text-white/72">
            {professional?.name} - {date && formatDateLabel(date)} as {time}
          </p>
          <p className="mt-3 text-lg font-black">
            {formatCurrency(service?.price || 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onViewAppointments}
          className="client-button-lime h-14 uppercase"
        >
          Ver meus agendamentos
        </button>
        <button
          type="button"
          onClick={onBookAnother}
          className="client-button-outline h-12"
        >
          Agendar outro servico
        </button>
      </div>
    </div>
  )
}
