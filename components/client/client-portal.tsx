"use client"

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react"
import Image from "next/image"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  ChairBarberIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CrownIcon,
  LockPasswordIcon,
  Logout03Icon,
  Mail01Icon,
  Scissor01Icon,
  UserMultipleIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { database, type AgendaEvent } from "@/components/admin/database"
import { COMPANY_LOGO_STORAGE_KEY } from "@/components/company/company-assets"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type ClientStage = "welcome" | "menu" | "booking" | "appointments" | "plan"
type BookingStep = "service" | "professional" | "datetime" | "confirm"

const customer = database.clients[0]
const company = database.company
const companyDisplayName = getCompanyDisplayName(company.tradeName)
const defaultCompanyLogoUrl = company.logoUrl?.trim()
const subscription = database.subscriptions.find(
  (item) => item.clientId === customer.id
)
const activeServices = database.services
  .filter((service) => service.status === "Ativo" && !service.hidden)
  .sort((first, second) => first.order - second.order)
const professionals = database.professionals.filter(
  (professional) => professional.status === "Ativo"
)
const categories = Array.from(
  new Set(activeServices.map((service) => service.category))
)

const bookingSteps: { id: BookingStep; label: string; eyebrow: string }[] = [
  { id: "service", label: "Tratamento", eyebrow: "Escolha" },
  { id: "professional", label: "Profissional", eyebrow: "Equipe" },
  { id: "datetime", label: "Data e hora", eyebrow: "Agenda" },
  { id: "confirm", label: "Finalizar", eyebrow: "Resumo" },
]

const dateOptions = [
  { id: "2026-04-29", day: "29", weekday: "qua", label: "Hoje" },
  { id: "2026-04-30", day: "30", weekday: "qui", label: "Amanhã" },
  { id: "2026-05-01", day: "01", weekday: "sex", label: "Sexta" },
  { id: "2026-05-02", day: "02", weekday: "sáb", label: "Sábado" },
  { id: "2026-05-04", day: "04", weekday: "seg", label: "Segunda" },
  { id: "2026-05-05", day: "05", weekday: "ter", label: "Terça" },
]

const timeSlots = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: false },
]

export function ClientPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [stage, setStage] = useState<ClientStage>("welcome")
  const [logoUrl, setLogoUrl] = useState(() =>
    getStoredCompanyLogo(defaultCompanyLogoUrl)
  )
  const [bookingStep, setBookingStep] = useState<BookingStep>("service")
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [serviceId, setServiceId] = useState(activeServices[0]?.id)
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id)
  const [dateId, setDateId] = useState(dateOptions[0].id)
  const [time, setTime] = useState("10:00")
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<AgendaEvent | null>(null)

  const selectedService = useMemo(
    () => activeServices.find((service) => service.id === serviceId),
    [serviceId]
  )
  const selectedProfessional = useMemo(
    () =>
      professionals.find((professional) => professional.id === professionalId),
    [professionalId]
  )
  const selectedDate = useMemo(
    () => dateOptions.find((date) => date.id === dateId) ?? dateOptions[0],
    [dateId]
  )
  const visibleServices = useMemo(() => {
    return activeServices.filter(
      (service) => service.category === activeCategory
    )
  }, [activeCategory])

  useEffect(() => {
    function syncCompanyLogo() {
      setLogoUrl(getStoredCompanyLogo(defaultCompanyLogoUrl))
    }
    window.addEventListener("storage", syncCompanyLogo)
    return () => window.removeEventListener("storage", syncCompanyLogo)
  }, [])

  function enterPortal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoggedIn(true)
    setStage("menu")
  }

  return (
    <main className="client-portal font-sans selection:bg-primary/30">
      <div className="flex h-dvh flex-col overflow-hidden">
        {isLoggedIn && (
          <PortalTopBar
            isLoggedIn={isLoggedIn}
            onHome={() => setStage("menu")}
            onExit={() => {
              setIsLoggedIn(false)
              setStage("welcome")
            }}
          />
        )}

        <ScrollArea className="flex-1">
          <div
            className={cn(
              "mx-auto flex w-full max-w-7xl flex-col px-3 pb-6 sm:px-6 sm:pb-12 lg:px-8",
              isLoggedIn ? "min-h-[calc(100dvh-4rem)]" : "min-h-dvh"
            )}
          >
            <div
              className={cn(
                "motion-rise mt-2 flex-1 sm:mt-4",
                !isLoggedIn && "flex items-center justify-center"
              )}
            >
              {stage === "welcome" && (
                <WelcomeScreen logoUrl={logoUrl} onSubmit={enterPortal} />
              )}

              {stage === "menu" && (
                <ChoiceMenu
                  onBooking={() => {
                    setStage("booking")
                    setBookingStep("service")
                  }}
                  onAppointments={() => setStage("appointments")}
                  onPlan={() => setStage("plan")}
                />
              )}

              {stage === "booking" && (
                <BookingExperience
                  step={bookingStep}
                  activeCategory={activeCategory}
                  visibleServices={visibleServices}
                  serviceId={serviceId}
                  professionalId={professionalId}
                  dateId={dateId}
                  time={time}
                  selectedService={selectedService}
                  selectedProfessional={selectedProfessional}
                  selectedDate={selectedDate}
                  onCategoryChange={setActiveCategory}
                  onServiceChange={setServiceId}
                  onProfessionalChange={setProfessionalId}
                  onDateChange={setDateId}
                  onTimeChange={setTime}
                  onBack={() => {
                    const idx = bookingSteps.findIndex((s) => s.id === bookingStep)
                    if (idx <= 0) setStage("menu")
                    else setBookingStep(bookingSteps[idx - 1].id)
                  }}
                  onNext={() => {
                    const idx = bookingSteps.findIndex((s) => s.id === bookingStep)
                    if (bookingSteps[idx + 1]) setBookingStep(bookingSteps[idx + 1].id)
                  }}
                  onConfirm={() => {
                    setConfirmedAppointment({
                      id: Date.now(),
                      barber: selectedProfessional?.name ?? "Profissional",
                      date: dateId,
                      start: time,
                      end: getEndTime(time, selectedService?.durationMinutes ?? 30),
                      title: customer.name,
                      detail: selectedService?.name ?? "Atendimento",
                      type: "appointment",
                    })
                    setStage("appointments")
                  }}
                />
              )}

              {stage === "appointments" && (
                <AppointmentsScreen
                  confirmedAppointment={confirmedAppointment}
                  onBooking={() => {
                    setStage("booking")
                    setBookingStep("service")
                  }}
                />
              )}

              {stage === "plan" && (
                <PlanScreen
                  onBooking={() => {
                    setStage("booking")
                    setBookingStep("service")
                  }}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  )
}

function PortalTopBar({
  isLoggedIn,
  onHome,
  onExit,
}: {
  isLoggedIn: boolean
  onHome: () => void
  onExit: () => void
}) {
  return (
    <header className="sticky top-0 z-50 shrink-0 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onHome}
          className="min-w-0 flex items-center gap-2.5 transition-opacity hover:opacity-80 sm:gap-3"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-inner sm:size-10">
            <HugeiconsIcon icon={ChairBarberIcon} size={16} />
          </span>
          <div className="min-w-0 text-left">
            <p className="truncate text-xs font-bold tracking-tight uppercase sm:text-sm">
              {companyDisplayName}
            </p>
            <p className="truncate text-[9px] font-medium tracking-widest text-muted-foreground uppercase sm:text-[10px]">
              Portal do Cliente
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              onClick={onExit}
            >
              <HugeiconsIcon icon={Logout03Icon} size={18} />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function WelcomeScreen({
  logoUrl,
  onSubmit,
}: {
  logoUrl?: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <section className="client-card mx-auto my-0 grid w-full max-w-md min-h-0 overflow-hidden sm:my-6 sm:max-w-6xl lg:min-h-[500px] lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="relative hidden min-h-[300px] items-center justify-center overflow-hidden p-0 sm:flex lg:min-h-[560px]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,var(--primary)_0%,transparent_40%)] opacity-[0.05]" />

        <div className="relative z-10 flex h-full min-h-[300px] w-full justify-center lg:min-h-[560px]">
          <CompanyLogoShowcase logoUrl={logoUrl} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-muted/30 p-4 backdrop-blur-sm sm:border-l sm:p-8 lg:border-l">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm space-y-4 sm:space-y-6"
        >
          <div className="mx-auto flex size-14 items-center justify-center overflow-hidden rounded-lg border bg-background shadow-sm sm:hidden">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={companyDisplayName}
                width={80}
                height={80}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <HugeiconsIcon icon={ChairBarberIcon} size={26} className="text-primary" />
            )}
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-lg font-bold tracking-tight sm:text-2xl">Entrar na conta</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
              Acesse com as credenciais fornecidas pela empresa.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-mail</Label>
              <div className="relative group">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <Input
                  id="client-email"
                  type="email"
                  defaultValue={customer.email}
                  className="h-11 rounded-lg border-border/50 bg-background/50 pl-11 text-base backdrop-blur-sm transition-all focus:border-primary/50 focus:ring-primary/20 sm:h-12 sm:text-sm"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="client-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Senha</Label>
                <button type="button" className="text-[10px] font-bold text-primary hover:underline">Esqueci a senha</button>
              </div>
              <div className="relative group">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <Input
                  id="client-password"
                  type="password"
                  className="h-11 rounded-lg border-border/50 bg-background/50 pl-11 text-base backdrop-blur-sm transition-all focus:border-primary/50 focus:ring-primary/20 sm:h-12 sm:text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 py-1">
              <Checkbox className="size-5 rounded" />
              <span className="text-xs font-medium text-muted-foreground">Lembrar neste dispositivo</span>
            </label>

            <Button
              type="submit"
              className="green-shine h-11 w-full rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 sm:h-12 sm:text-sm"
            >
              Acessar Portal
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Button>
          </div>

          <p className="rounded-lg border bg-background/50 p-2.5 text-center text-[10px] leading-relaxed text-muted-foreground sm:p-3">
            Acesso restrito. Se você não possui uma conta, entre em contato com o estabelecimento.
          </p>
        </form>
      </div>
    </section>
  )
}

function CompanyLogoShowcase({
  logoUrl,
}: {
  logoUrl?: string
}) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-background/25">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={companyDisplayName}
          width={900}
          height={900}
          unoptimized
          className="h-full w-full scale-110 object-cover"
        />
      ) : (
        <HugeiconsIcon icon={ChairBarberIcon} size={118} className="text-primary" />
      )}
    </div>
  )
}

function ChoiceMenu({
  onBooking,
  onAppointments,
  onPlan,
}: {
  onBooking: () => void
  onAppointments: () => void
  onPlan: () => void
}) {
  return (
    <section className="flex min-h-[calc(100dvh-5rem)] flex-1 items-center justify-center py-3 sm:min-h-[400px] sm:py-8">
      <div className="w-full max-w-3xl">
        <div className="mb-4 text-center sm:mb-12">
          <p className="text-[9px] font-black tracking-[0.28em] text-primary uppercase sm:text-[10px] sm:tracking-[0.4em]">Escolha sua jornada</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight uppercase sm:mt-4 sm:text-6xl">
            O que vamos
            <span className="block text-muted-foreground font-light">fazer hoje?</span>
          </h1>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">
          <MenuActionButton
            icon={Calendar03Icon}
            title="Agendar Agora"
            description="Marque seu próximo horário em segundos"
            onClick={onBooking}
            variant="primary"
          />
          <MenuActionButton
            icon={UserMultipleIcon}
            title="Meus Horários"
            description="Consulte e gerencie suas reservas"
            onClick={onAppointments}
          />
          <MenuActionButton
            icon={CrownIcon}
            title="Minha Assinatura"
            description="Veja seus benefícios e status"
            onClick={onPlan}
          />
        </div>
      </div>
    </section>
  )
}

function MenuActionButton({
  icon,
  title,
  description,
  onClick,
  variant = "secondary",
}: {
  icon: IconSvgElement
  title: string
  description: string
  onClick: () => void
  variant?: "primary" | "secondary"
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "client-card group flex items-center gap-3 p-3.5 text-left transition-all sm:flex-col sm:p-6 sm:text-center",
        variant === "primary" ? "border-primary/20 bg-primary/5" : ""
      )}
    >
      <span className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 sm:size-14",
        variant === "primary" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-foreground"
      )}>
        <HugeiconsIcon icon={icon} size={24} />
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-bold tracking-tight sm:mt-6 sm:text-lg">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground sm:mt-2 sm:text-xs">{description}</p>
      </div>
    </button>
  )
}

function BookingExperience({
  step,
  activeCategory,
  visibleServices,
  serviceId,
  professionalId,
  dateId,
  time,
  selectedService,
  selectedProfessional,
  selectedDate,
  onCategoryChange,
  onServiceChange,
  onProfessionalChange,
  onDateChange,
  onTimeChange,
  onBack,
  onNext,
  onConfirm,
}: {
  step: BookingStep
  activeCategory: string
  visibleServices: typeof activeServices
  serviceId?: number
  professionalId?: number
  dateId: string
  time: string
  selectedService?: (typeof activeServices)[number]
  selectedProfessional?: (typeof professionals)[number]
  selectedDate: (typeof dateOptions)[number]
  onCategoryChange: (category: string) => void
  onServiceChange: (id: number) => void
  onProfessionalChange: (id: number) => void
  onDateChange: (id: string) => void
  onTimeChange: (time: string) => void
  onBack: () => void
  onNext: () => void
  onConfirm: () => void
}) {
  const stepIndex = bookingSteps.findIndex((item) => item.id === step)
  const currentStep = bookingSteps[stepIndex]

  return (
    <section className="grid flex-1 gap-4 py-3 sm:gap-8 sm:py-6 lg:grid-cols-[1fr_24rem]">
      <div className="min-w-0 pb-20 sm:pb-0">
        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-8 sm:gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[8px] font-bold tracking-[0.16em] text-primary uppercase sm:text-[10px] sm:tracking-[0.2em]">
              <span className="flex size-4 items-center justify-center rounded bg-primary text-[7px] text-primary-foreground sm:size-5 sm:text-[8px]">
                {stepIndex + 1}
              </span>
              {currentStep.eyebrow}
            </div>
            <h2 className="mt-1.5 truncate text-2xl font-black tracking-tight uppercase sm:mt-2 sm:text-4xl">
              {currentStep.label}
            </h2>
          </div>
          <StepCounter stepIndex={stepIndex} />
        </div>

        <StepDots activeIndex={stepIndex} />

        <div className="mt-4 sm:mt-10">
          {step === "service" && (
            <ServiceStep
              activeCategory={activeCategory}
              visibleServices={visibleServices}
              selectedServiceId={serviceId}
              onCategoryChange={onCategoryChange}
              onServiceChange={onServiceChange}
            />
          )}

          {step === "professional" && (
            <ProfessionalStep
              professionalId={professionalId}
              onProfessionalChange={onProfessionalChange}
            />
          )}

          {step === "datetime" && (
            <DateTimeStep
              dateId={dateId}
              time={time}
              onDateChange={onDateChange}
              onTimeChange={onTimeChange}
            />
          )}

          {step === "confirm" && (
            <CheckoutStep
              service={selectedService}
              professional={selectedProfessional}
              selectedDate={selectedDate}
              time={time}
            />
          )}
        </div>

        <BookingFooter
          isLastStep={step === "confirm"}
          canContinue={Boolean(
            (step === "service" && serviceId) ||
            (step === "professional" && professionalId) ||
            (step === "datetime" && time) ||
            step === "confirm"
          )}
          onBack={onBack}
          onNext={onNext}
          onConfirm={onConfirm}
        />
      </div>

      <SummaryRail
        service={selectedService}
        professional={selectedProfessional}
        selectedDate={selectedDate}
        time={time}
      />
    </section>
  )
}

function ServiceStep({
  activeCategory,
  visibleServices,
  selectedServiceId,
  onCategoryChange,
  onServiceChange,
}: {
  activeCategory: string
  visibleServices: typeof activeServices
  selectedServiceId?: number
  onCategoryChange: (category: string) => void
  onServiceChange: (id: number) => void
}) {
  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1.5 no-scrollbar sm:mx-0 sm:px-0">
        {categories.map((category) => {
          const active = category === activeCategory
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={cn(
                "shrink-0 rounded-lg border px-3.5 py-2 text-[9px] font-bold tracking-widest uppercase transition-all sm:px-5 sm:py-2 sm:text-[10px]",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              {category}
            </button>
          )
        })}
      </div>

      <div className="grid gap-2.5 sm:gap-4">
        {visibleServices.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => onServiceChange(service.id)}
            data-selected={service.id === selectedServiceId}
            className="client-choice-card flex items-center justify-between gap-3 p-3.5 sm:p-6"
          >
            <div className="min-w-0 text-left">
              <h4 className="truncate text-base font-black tracking-tight uppercase sm:text-xl">{service.name}</h4>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] font-black tracking-widest text-muted-foreground uppercase sm:mt-2 sm:text-[11px]">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} size={14} />
                  {service.duration}
                </span>
                <span className="opacity-30">•</span>
                <span>{service.category}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xl font-black text-primary-contrast sm:text-2xl">
                {formatCurrency(service.price)}
              </p>
              {service.startingFrom && (
                <p className="mt-0.5 text-[8px] font-black text-muted-foreground uppercase tracking-tighter sm:mt-1 sm:text-[9px]">A partir de</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProfessionalStep({
  professionalId,
  onProfessionalChange,
}: {
  professionalId?: number
  onProfessionalChange: (id: number) => void
}) {
  return (
    <div className="grid gap-2.5 sm:gap-4">
      {professionals.map((professional) => (
        <button
          key={professional.id}
          type="button"
          onClick={() => onProfessionalChange(professional.id)}
          data-selected={professional.id === professionalId}
          className="client-choice-card flex items-center justify-between gap-3 p-3.5 sm:p-5"
        >
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-black tracking-tighter text-muted-foreground sm:size-16 sm:text-xl">
              {getInitials(professional.name)}
            </div>
            <div className="min-w-0 text-left">
              <h4 className="truncate text-base font-black tracking-tight uppercase sm:text-xl">{professional.name}</h4>
              <p className="mt-0.5 truncate text-[9px] font-black tracking-[0.14em] text-primary-contrast uppercase sm:mt-1 sm:text-[11px] sm:tracking-[0.2em]">{professional.role}</p>
            </div>
          </div>
          <HugeiconsIcon icon={UserMultipleIcon} size={22} className="shrink-0 text-muted-foreground/20" />
        </button>
      ))}
    </div>
  )
}

function DateTimeStep({
  dateId,
  time,
  onDateChange,
  onTimeChange,
}: {
  dateId: string
  time: string
  onDateChange: (id: string) => void
  onTimeChange: (time: string) => void
}) {
  return (
    <div className="space-y-4 sm:space-y-8">
      <div>
        <h4 className="mb-2 text-[9px] font-black tracking-[0.22em] text-muted-foreground uppercase sm:mb-4 sm:text-[10px] sm:tracking-[0.3em]">Selecione o Dia</h4>
        <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-3 no-scrollbar sm:mx-0 sm:gap-3 sm:px-0 sm:pb-4">
          {dateOptions.map((date) => {
            const active = date.id === dateId
            return (
              <button
                key={date.id}
                type="button"
                onClick={() => onDateChange(date.id)}
                data-selected={active}
                className="client-choice-card flex min-w-[64px] flex-col items-center justify-center py-2.5 sm:min-w-[80px] sm:py-4"
              >
                <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase sm:text-[10px]">{date.weekday}</span>
                <span className="mt-0.5 text-xl font-black tracking-tighter sm:mt-1 sm:text-3xl">{date.day}</span>
                <span className="mt-1 text-[9px] font-black uppercase text-primary/70">{date.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-[9px] font-black tracking-[0.22em] text-muted-foreground uppercase sm:mb-5 sm:text-[11px] sm:tracking-[0.4em]">Horários Disponíveis</h4>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-4 md:grid-cols-5">
          {timeSlots.map((slot) => {
            const active = slot.time === time
            return (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => onTimeChange(slot.time)}
                data-selected={active}
                className="client-choice-card flex h-11 items-center justify-center text-sm font-black tracking-tighter disabled:opacity-20 disabled:grayscale sm:h-16 sm:text-xl"
              >
                {slot.time}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CheckoutStep({
  service,
  professional,
  selectedDate,
  time,
}: {
  service?: (typeof activeServices)[number]
  professional?: (typeof professionals)[number]
  selectedDate: (typeof dateOptions)[number]
  time: string
}) {
  return (
    <div className="client-card overflow-hidden shadow-2xl">
      <div className="border-b bg-muted/50 p-4 sm:p-8">
        <h4 className="text-[9px] font-black tracking-[0.22em] text-primary-contrast uppercase sm:text-[11px] sm:tracking-[0.4em]">Resumo da Reserva</h4>
        <h3 className="mt-2 text-xl font-black leading-tight tracking-tight text-balance uppercase sm:mt-4 sm:text-4xl sm:leading-none sm:tracking-tighter">
          {service?.name || "Serviço"}
        </h3>
      </div>
      
      <div className="divide-y divide-border/40">
        <CheckoutItem label="Profissional" value={professional?.name || "-"} icon={UserMultipleIcon} />
        <CheckoutItem 
          label="Data e Hora" 
          value={`${formatShortDate(selectedDate.id)} às ${time}`} 
          icon={Calendar03Icon} 
        />
        <CheckoutItem label="Duração Estimada" value={service?.duration || "-"} icon={Clock01Icon} />
      </div>

      <div className="flex flex-col gap-3 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] text-muted-foreground uppercase sm:text-[11px] sm:tracking-[0.2em]">Valor Total</p>
          <p className="mt-1.5 text-2xl font-black text-primary-contrast sm:mt-2 sm:text-4xl">{service ? formatCurrency(service.price) : "-"}</p>
        </div>
        <div className="w-fit rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black tracking-[0.1em] text-primary-contrast uppercase sm:px-6 sm:py-3 sm:text-[11px]">
          No Local
        </div>
      </div>
    </div>
  )
}

function CheckoutItem({ label, value, icon }: { label: string, value: string, icon: IconSvgElement }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3.5 sm:items-center sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <HugeiconsIcon icon={icon} size={16} />
        </span>
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{label}</span>
      </div>
      <span className="max-w-[55%] text-right text-sm font-bold tracking-tight break-words uppercase">{value}</span>
    </div>
  )
}





function AppointmentsScreen({
  confirmedAppointment,
  onBooking,
}: {
  confirmedAppointment: AgendaEvent | null
  onBooking: () => void
}) {
  const appointments = useMemo(() => {
    const base = database.agendaEvents.filter(
      (event) => event.title === customer.name && event.type === "appointment"
    )
    return confirmedAppointment ? [confirmedAppointment, ...base] : base
  }, [confirmedAppointment])

  return (
    <section className="min-w-0 overflow-hidden py-3 sm:py-6">
      <ScreenTitle
        eyebrow="Sua Agenda"
        title="Meus Horários"
        description="Confira seus agendamentos realizados e gerencie seu tempo."
      />

      {confirmedAppointment && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 shadow-lg shadow-primary/5 sm:mb-8 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:size-12">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} />
            </span>
            <div>
              <h3 className="text-sm font-bold tracking-tight uppercase sm:text-lg">Agendamento Confirmado!</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">Sua reserva foi registrada com sucesso. Te esperamos no horário combinado.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <div className="client-card flex flex-col items-center justify-center px-5 py-10 text-center sm:py-16">
            <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground/30 sm:size-16">
              <HugeiconsIcon icon={Calendar03Icon} size={26} />
            </div>
            <h4 className="mt-6 text-xl font-bold">Nenhum agendamento</h4>
            <p className="mt-2 text-sm text-muted-foreground">Você ainda não possui horários marcados.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center sm:mt-10">
        <Button onClick={onBooking} className="green-shine h-11 w-full rounded-lg px-5 text-xs font-bold uppercase tracking-widest sm:h-12 sm:w-auto sm:px-8">
          Marcar Novo Horário
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </Button>
      </div>
    </section>
  )
}

function PlanScreen({ onBooking }: { onBooking: () => void }) {
  const plan = database.plans.find((item) => item.name === subscription?.plan)

  return (
    <section className="min-w-0 overflow-hidden py-3 sm:py-6">
      <ScreenTitle
        eyebrow="Assinatura"
        title={subscription?.plan || "Plano Bronze"}
        description="Detalhes do seu plano atual e benefícios ativos."
      />

      <div className="grid min-w-0 gap-3 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <div className="client-card grid min-w-0 gap-3 p-4 sm:grid-cols-3 sm:p-6">
            <MetricTile icon={CrownIcon} label="Benefício" value={plan?.benefit || "Prioridade"} />
            <MetricTile icon={Calendar03Icon} label="Renovação" value={subscription?.nextCharge || "05/05/2026"} />
            <MetricTile icon={Wallet02Icon} label="Mensalidade" value={subscription ? formatCurrency(subscription.value) : "R$ 0,00"} />
          </div>
          <p className="mt-3 text-[9px] font-medium leading-relaxed break-words text-muted-foreground uppercase tracking-[0.14em] sm:mt-4 sm:text-[10px] sm:tracking-widest">
            As cobranças são gerenciadas diretamente pelo estabelecimento.
          </p>
        </div>

        <div className="client-card min-w-0 flex flex-col justify-between border-primary/20 bg-primary/5 p-4 shadow-lg shadow-primary/5 sm:p-6">
          <div>
            <h4 className="text-[9px] font-black tracking-[0.24em] text-primary uppercase sm:text-[10px] sm:tracking-[0.3em]">Status do Plano</h4>
            <h3 className="mt-2 text-xl font-black uppercase tracking-tight sm:mt-3 sm:text-2xl">Membro Prime</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:mt-3 sm:text-sm">Você possui acesso antecipado a novos horários e descontos exclusivos em serviços selecionados.</p>
          </div>
          <Button onClick={onBooking} className="mt-5 h-11 w-full rounded-lg px-3 text-xs font-bold uppercase tracking-[0.08em] sm:mt-8 sm:h-12 sm:tracking-widest">
            Agendar com Plano
          </Button>
        </div>
      </div>
    </section>
  )
}

function BookingFooter({
  isLastStep,
  canContinue,
  onBack,
  onNext,
  onConfirm,
}: {
  isLastStep: boolean
  canContinue: boolean
  onBack: () => void
  onNext: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur-xl sm:sticky sm:inset-auto sm:-mx-0 sm:mt-12 sm:px-0 sm:py-6 sm:pb-10">
      <div className="grid grid-cols-[0.38fr_1fr] gap-2 sm:flex sm:items-center sm:gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-10 rounded-lg border-border/60 bg-background/60 px-2 text-[10px] font-black uppercase tracking-widest sm:h-14 sm:w-40 sm:text-xs"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          Voltar
        </Button>
        <Button
          disabled={!canContinue}
          onClick={isLastStep ? onConfirm : onNext}
          className="green-shine h-10 flex-1 rounded-lg px-3 text-[11px] font-black uppercase tracking-[0.06em] shadow-xl shadow-primary/20 sm:h-16 sm:text-sm sm:tracking-[0.1em]"
        >
          {isLastStep ? "Confirmar Reserva" : "Próximo Passo"}
          <HugeiconsIcon icon={isLastStep ? CheckmarkCircle01Icon : ArrowRight01Icon} size={20} />
        </Button>
      </div>
    </div>
  )
}

function SummaryRail({
  service,
  professional,
  selectedDate,
  time,
}: {
  service?: (typeof activeServices)[number]
  professional?: (typeof professionals)[number]
  selectedDate: (typeof dateOptions)[number]
  time: string
}) {
  return (
    <aside className="hidden lg:block">
      <div className="client-card sticky top-24 overflow-hidden shadow-2xl">
        <div className="border-b bg-muted/50 p-6">
          <h4 className="text-[10px] font-black tracking-[0.4em] text-primary-contrast uppercase">Sua Reserva</h4>
        </div>
        
        <div className="space-y-6 p-6">
          <SummaryLine icon={Scissor01Icon} label="Serviço" value={service?.name || "Pendente"} />
          <SummaryLine icon={UserMultipleIcon} label="Equipe" value={professional?.name || "Pendente"} />
          <SummaryLine icon={Calendar03Icon} label="Quando" value={`${selectedDate.day} ${selectedDate.weekday.toUpperCase()}`} />
          <SummaryLine icon={Clock01Icon} label="Horário" value={time || "--:--"} />
        </div>

        <div className="m-6 rounded-lg border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Total</span>
            <span className="text-3xl font-black text-primary-contrast">{service ? formatCurrency(service.price) : "-"}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SummaryLine({ icon, label, value }: { icon: IconSvgElement, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <HugeiconsIcon icon={icon} size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
        <p className="truncate text-sm font-black tracking-tight uppercase">{value}</p>
      </div>
    </div>
  )
}

function ScreenTitle({ eyebrow, title, description }: { eyebrow: string, title: string, description: string }) {
  return (
    <div className="mb-7 sm:mb-12">
      <p className="text-[9px] font-black tracking-[0.28em] text-primary-contrast uppercase sm:text-[11px] sm:tracking-[0.5em]">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight uppercase sm:mt-4 sm:text-6xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-xs font-medium leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">{description}</p>
    </div>
  )
}

function AppointmentCard({ appointment }: { appointment: AgendaEvent }) {
  return (
    <div className="client-card flex flex-col gap-3 p-3.5 transition-all hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary-contrast sm:size-16">
          <HugeiconsIcon icon={Scissor01Icon} size={20} />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-base font-black tracking-tight uppercase sm:text-xl">{appointment.detail}</h4>
          <p className="mt-1 text-xs font-bold text-muted-foreground uppercase sm:text-sm">
            {formatLongDate(appointment.date)} • {appointment.start}
          </p>
          <p className="mt-1 truncate text-[10px] font-black text-primary-contrast uppercase tracking-widest sm:text-[11px]">{appointment.barber}</p>
        </div>
      </div>
      <div className="w-fit rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-[9px] font-black tracking-widest text-primary-contrast uppercase sm:px-5 sm:py-2 sm:text-[10px]">
        Confirmado
      </div>
    </div>
  )
}

function StepCounter({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-background/50 px-3 text-[10px] font-black tracking-widest text-muted-foreground backdrop-blur-md sm:h-12 sm:px-5 sm:text-xs">
      <span className="text-foreground">{String(stepIndex + 1).padStart(2, "0")}</span>
      <span className="opacity-30">/</span>
      <span className="opacity-50">04</span>
    </div>
  )
}

function StepDots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex gap-2">
      {bookingSteps.map((step, index) => (
        <div key={step.id} className="flex-1">
          <div className={cn(
            "h-1.5 rounded transition-all duration-700 sm:h-2",
            index <= activeIndex ? "bg-primary shadow-[0_0_12px_rgba(var(--primary),0.6)]" : "bg-muted"
          )} />
        </div>
      ))}
    </div>
  )
}

function MetricTile({ icon, label, value }: { icon: IconSvgElement, label: string, value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 sm:block sm:space-y-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary-contrast sm:size-12">
        <HugeiconsIcon icon={icon} size={24} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">{label}</p>
        <p className="mt-1 text-base font-black leading-tight tracking-tight break-words sm:text-xl">{value}</p>
      </div>
    </div>
  )
}

function getCompanyDisplayName(value: string) {
  const normalized = value.trim()
  return (!normalized || normalized === "Empresa sem nome definido") ? "Empresa" : normalized
}

function getStoredCompanyLogo(fallback?: string) {
  if (typeof window === "undefined") return fallback
  return window.localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) || fallback
}

function getInitials(value: string) {
  return value.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase()
}

function getEndTime(start: string, durationMinutes: number) {
  const [h, m] = start.split(":").map(Number)
  const d = new Date(2026, 3, 29, h, m + durationMinutes)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}

function formatShortDate(v: string) {
  const [y, m, d] = v.split("-").map(Number)
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(y, m - 1, d))
}

function formatLongDate(v: string) {
  const [y, m, d] = v.split("-").map(Number)
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(y, m - 1, d))
}
