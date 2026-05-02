"use client"

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
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
import {
  CLIENT_PORTAL_SYNC_EVENT,
  createDefaultClientPortalSettings,
  getClientPortalCssVariables,
  getStoredClientPlans,
  getStoredClientPortalSettings,
  getStoredClientSubscriptions,
  saveClientSubscriptions,
} from "@/components/company/client-portal-config"
import {
  COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY,
  COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY,
  COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY,
  COMPANY_LOGO_STORAGE_KEY,
} from "@/components/company/company-assets"
import {
  database,
  type AgendaEvent,
  type Plan,
  type ServiceCatalogItem,
  type Subscription,
} from "@/components/admin/database"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type ClientStage = "welcome" | "menu" | "booking" | "appointments" | "plan"
type BookingStep = "service" | "extras" | "professional" | "datetime" | "confirm"
type BookingServiceLine = {
  service: ServiceCatalogItem
  kind: "plan" | "extra" | "regular"
  finalPrice: number
  discountPercent: number
}
type AppointmentReschedule = {
  date: string
  start: string
  end: string
}

const customer = database.clients[0]
const company = database.company
const defaultCompanyLogoUrl = company.logoUrl?.trim()
const defaultClientPortalSettings = createDefaultClientPortalSettings(company)
const fallbackSubscription = database.subscriptions.find(
  (item) => item.clientId === customer.id
)
const fallbackCurrentPlan = database.plans.find(
  (item) => item.name === fallbackSubscription?.plan
)
const activeServices = database.services
  .filter((service) => service.status === "Ativo" && !service.hidden)
  .sort((first, second) => first.order - second.order)
const professionals = database.professionals.filter(
  (professional) => professional.status === "Ativo"
)
const bookingSteps: { id: BookingStep; label: string; eyebrow: string }[] = [
  { id: "service", label: "Tratamento", eyebrow: "Escolha" },
  { id: "extras", label: "Extras", eyebrow: "Adicionais" },
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
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [stage, setStage] = useState<ClientStage>("welcome")
  const [portalSettings, setPortalSettings] = useState(defaultClientPortalSettings)
  const [plans, setPlans] = useState(database.plans)
  const [subscriptions, setSubscriptions] = useState(database.subscriptions)
  const [bookingStep, setBookingStep] = useState<BookingStep>("service")
  const subscription = useMemo(
    () =>
      subscriptions.find(
        (item) =>
          item.clientId === customer.id &&
          item.status !== "Pausada" &&
          item.status !== "Em atraso"
      ),
    [subscriptions]
  )
  const currentPlan = useMemo(
    () => plans.find((item) => item.name === subscription?.plan),
    [plans, subscription?.plan]
  )
  const companyDisplayName = getCompanyDisplayName(portalSettings.tradeName)
  const logoUrl = getStoredCompanyLogo(
    portalSettings.logoUrl || defaultCompanyLogoUrl
  )
  const portalStyle = useMemo(
    () => getClientPortalCssVariables(portalSettings) as CSSProperties,
    [portalSettings]
  )
  const initialBookingService = getInitialBookingService(activeServices, currentPlan)
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(
    initialBookingService ? [initialBookingService.id] : []
  )
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id)
  const [dateId, setDateId] = useState(dateOptions[0].id)
  const [time, setTime] = useState("10:00")
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<AgendaEvent | null>(null)

  const selectedServices = useMemo(
    () =>
      selectedServiceIds
        .map((id) => activeServices.find((service) => service.id === id))
        .filter((service): service is (typeof activeServices)[number] =>
          Boolean(service)
        ),
    [selectedServiceIds]
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
  const planServiceIds = useMemo(
    () => getPlanServiceIds(activeServices, currentPlan?.name),
    [currentPlan?.name]
  )
  const usedPlanCredits = useMemo(
    () => getUsedPlanCredits(planServiceIds, confirmedAppointment),
    [confirmedAppointment, planServiceIds]
  )
  const selectedServiceLines = useMemo(
    () => {
      const availablePlanCredits = Math.max(
        (currentPlan?.servicesLimit ?? 0) - usedPlanCredits,
        0
      )

      return selectedServices.reduce<{
        lines: BookingServiceLine[]
        remaining: number
      }>((accumulator, service) => {
        const line = getBookingServiceLine(
          service,
          planServiceIds,
          Boolean(subscription),
          accumulator.remaining
        )

        return {
          lines: [...accumulator.lines, line],
          remaining:
            line.kind === "plan"
              ? accumulator.remaining - service.credits
              : accumulator.remaining,
        }
      }, { lines: [], remaining: availablePlanCredits }).lines
    },
    [
      selectedServices,
      planServiceIds,
      usedPlanCredits,
      currentPlan?.servicesLimit,
      subscription,
    ]
  )
  const bookingTotal = useMemo(
    () =>
      selectedServiceLines.reduce((total, item) => total + item.finalPrice, 0),
    [selectedServiceLines]
  )
  const bookingFlow = useMemo(
    () => getBookingFlow(Boolean(subscription)),
    [subscription]
  )
  const canContinueBooking = useMemo(
    () =>
      getCanContinueBooking({
        step: bookingStep,
        selectedServiceIds,
        professionalId,
        time,
        hasSubscription: Boolean(subscription),
        planServiceIds,
        usedPlanCredits,
        servicesLimit: currentPlan?.servicesLimit ?? 0,
      }),
    [
      bookingStep,
      selectedServiceIds,
      professionalId,
      time,
      planServiceIds,
      usedPlanCredits,
      subscription,
      currentPlan?.servicesLimit,
    ]
  )

  useEffect(() => {
    setMounted(true)
    function syncClientPortalData() {
      setPortalSettings(
        getStoredClientPortalSettings(defaultClientPortalSettings)
      )
      setPlans(getStoredClientPlans(database.plans))
      setSubscriptions(getStoredClientSubscriptions(database.subscriptions))
    }
    syncClientPortalData()
    window.addEventListener("storage", syncClientPortalData)
    window.addEventListener(CLIENT_PORTAL_SYNC_EVENT, syncClientPortalData)
    return () => {
      window.removeEventListener("storage", syncClientPortalData)
      window.removeEventListener(CLIENT_PORTAL_SYNC_EVENT, syncClientPortalData)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const previousValues = new Map<string, string>()
    const previousColorScheme = root.style.colorScheme
    const hadDarkClass = root.classList.contains("dark")

    Object.entries(portalStyle).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (key.startsWith("--")) {
        previousValues.set(key, root.style.getPropertyValue(key))
        root.style.setProperty(key, String(value))
        return
      }

      if (key === "colorScheme") {
        root.style.colorScheme = String(value)
      }
    })

    root.classList.toggle("dark", portalSettings.mode === "dark")

    return () => {
      previousValues.forEach((value, key) => {
        if (value) root.style.setProperty(key, value)
        else root.style.removeProperty(key)
      })
      root.style.colorScheme = previousColorScheme
      root.classList.toggle("dark", hadDarkClass)
    }
  }, [portalSettings.mode, portalStyle])

  function enterPortal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoggedIn(true)
    setStage("menu")
  }

  function toggleServiceSelection(id: number) {
    setSelectedServiceIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  function goBackBooking() {
    const idx = bookingFlow.findIndex((step) => step.id === bookingStep)
    if (idx <= 0) setStage("menu")
    else setBookingStep(bookingFlow[idx - 1].id)
  }

  function goNextBooking() {
    const idx = bookingFlow.findIndex((step) => step.id === bookingStep)
    if (bookingFlow[idx + 1]) setBookingStep(bookingFlow[idx + 1].id)
  }

  function confirmBooking() {
    setConfirmedAppointment({
      id: Date.now(),
      barber: selectedProfessional?.name ?? "Profissional",
      date: dateId,
      start: time,
      end: getEndTime(
        time,
        selectedServices.reduce(
          (total, service) => total + service.durationMinutes,
          0
        ) || 30
      ),
      title: customer.name,
      detail:
        selectedServices.map((service) => service.name).join(" + ") ||
        "Atendimento",
      type: "appointment",
    })
    setStage("appointments")
  }
  if (!mounted) return null

  return (
    <main
      className={cn(
        "client-portal font-sans text-foreground selection:bg-primary/30",
        portalSettings.mode === "dark" && "dark"
      )}
      style={portalStyle}
    >
      <div className="flex h-dvh flex-col overflow-hidden">
        {isLoggedIn && (
          <PortalTopBar
            isLoggedIn={isLoggedIn}
            companyName={companyDisplayName}
            logoUrl={logoUrl}
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
                <WelcomeScreen
                  logoUrl={logoUrl}
                  companyName={companyDisplayName}
                  portalSettings={portalSettings}
                  onSubmit={enterPortal}
                  onGoogleLogin={() => setIsLoggedIn(true)}
                />
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
                  bookingFlow={bookingFlow}
                  canContinue={canContinueBooking}
                  selectedServiceIds={selectedServiceIds}
                  selectedServiceLines={selectedServiceLines}
                  bookingTotal={bookingTotal}
                  plan={currentPlan}
                  subscription={subscription}
                  planServiceIds={planServiceIds}
                  usedPlanCredits={usedPlanCredits}
                  professionalId={professionalId}
                  dateId={dateId}
                  time={time}
                  selectedServices={selectedServices}
                  selectedProfessional={selectedProfessional}
                  selectedDate={selectedDate}
                  onServiceToggle={toggleServiceSelection}
                  onProfessionalChange={setProfessionalId}
                  onDateChange={setDateId}
                  onTimeChange={setTime}
                  onBack={goBackBooking}
                  onNext={goNextBooking}
                  onConfirm={confirmBooking}
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
                  plan={currentPlan}
                  plans={plans}
                  subscription={subscription}
                  onBooking={() => {
                    setStage("booking")
                    setBookingStep("service")
                  }}
                />
              )}
            </div>
          </div>
        </ScrollArea>

        {isLoggedIn && stage === "booking" && (
          <BookingFooter
            placement="mobile"
            isLastStep={bookingStep === "confirm"}
            canContinue={canContinueBooking}
            selectedLines={selectedServiceLines}
            total={bookingTotal}
            onBack={goBackBooking}
            onNext={goNextBooking}
            onConfirm={confirmBooking}
          />
        )}
      </div>
    </main>
  )
}

function PortalTopBar({
  isLoggedIn,
  companyName,
  logoUrl,
  onHome,
  onExit,
}: {
  isLoggedIn: boolean
  companyName: string
  logoUrl?: string
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
          {logoUrl ? (
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background sm:size-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-10">
              <HugeiconsIcon icon={ChairBarberIcon} size={16} />
            </span>
          )}
          <div className="min-w-0 text-left">
            <p className="truncate text-xs font-bold tracking-tight text-foreground uppercase sm:text-sm">
              {companyName}
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
  companyName,
  portalSettings,
  onSubmit,
  onGoogleLogin,
}: {
  logoUrl?: string
  companyName: string
  portalSettings: any
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onGoogleLogin: () => void
}) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const carouselImages = [
    {
      url: portalSettings.carouselImage1 || getStoredCarouselImage(COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY) || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop",
      title: portalSettings.introTitle1 || "Experiência Premium",
      description: portalSettings.introSubtitle1 || "Transforme seu visual com os melhores profissionais da região."
    },
    {
      url: portalSettings.carouselImage2 || getStoredCarouselImage(COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY) || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop",
      title: portalSettings.introTitle2 || "Estilo & Conforto",
      description: portalSettings.introSubtitle2 || "Um ambiente exclusivo pensado para o seu bem-estar."
    },
    {
      url: portalSettings.carouselImage3 || getStoredCarouselImage(COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY) || "https://images.unsplash.com/photo-1621605815841-aa88c82b0ad2?q=80&w=1000&auto=format&fit=crop",
      title: portalSettings.introTitle3 || "Agendamento Simples",
      description: portalSettings.introSubtitle3 || "Marque seu horário em segundos, de onde estiver."
    }
  ].filter(img => img.url)

  return (
    <section className="client-card mx-auto my-0 grid w-full max-w-md min-h-0 overflow-hidden sm:my-6 sm:max-w-6xl lg:min-h-[600px] lg:grid-cols-[minmax(0,1fr)_28rem]">
      {/* Coluna do Carrossel */}
      <div className="relative hidden min-h-[400px] flex-col overflow-hidden sm:flex lg:min-h-[600px]">
        {carouselImages.length > 0 ? (
          <Carousel slides={carouselImages} />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-muted/20">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,var(--primary)_0%,transparent_40%)] opacity-[0.05]" />
            <CompanyLogoShowcase logoUrl={logoUrl} companyName={companyName} />
          </div>
        )}
      </div>

      {/* Coluna de Login/Cadastro */}
      <div className="flex flex-col items-center justify-center bg-background p-6 backdrop-blur-sm sm:p-10 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex size-16 items-center justify-center overflow-hidden rounded-2xl border bg-background sm:hidden">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={companyName}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <HugeiconsIcon icon={ChairBarberIcon} size={32} className="text-primary" />
              )}
            </div>
            
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {authMode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {authMode === "login" 
                ? "Entre para gerenciar seus agendamentos." 
                : "Cadastre-se para aproveitar nossos serviços."}
            </p>
          </div>

          <div className="flex w-fit mx-auto rounded-full border bg-muted/40 p-1">
            <button
              onClick={() => setAuthMode("login")}
              className={cn(
                "px-6 py-2 text-xs font-semibold transition-all rounded-full",
                authMode === "login" 
                  ? "bg-background text-foreground shadow-sm border border-border/40" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={cn(
                "px-6 py-2 text-xs font-semibold transition-all rounded-full",
                authMode === "register" 
                  ? "bg-background text-foreground shadow-sm border border-border/40" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {authMode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="client-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                <div className="relative group">
                  <HugeiconsIcon
                    icon={UserMultipleIcon}
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                  />
                  <Input
                    id="client-name"
                    type="text"
                    className="h-12 rounded-xl border-border/50 bg-muted/20 pl-11 text-sm transition-all focus:bg-background focus:ring-4 focus:ring-primary/10"
                    placeholder="Seu nome"
                    required={authMode === "register"}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="client-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail</Label>
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
                  className="h-12 rounded-xl border-border/50 bg-muted/20 pl-11 text-sm transition-all focus:bg-background focus:ring-4 focus:ring-primary/10"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="client-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Senha</Label>
                {authMode === "login" && (
                  <button type="button" className="text-[10px] font-bold text-primary hover:underline">Esqueci a senha</button>
                )}
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
                  className="h-12 rounded-xl border-border/50 bg-muted/20 pl-11 text-sm transition-all focus:bg-background focus:ring-4 focus:ring-primary/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-xs font-bold uppercase tracking-widest"
            >
              {authMode === "login" ? "Entrar no Portal" : "Criar Minha Conta"}
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Ou continue com</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="h-12 w-full rounded-xl border-border/50 bg-background text-xs font-bold uppercase tracking-widest transition-all hover:bg-muted/50"
            onClick={onGoogleLogin}
          >
            <GoogleIcon className="mr-2 size-4" />
            Google
          </Button>

          <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <button className="font-bold text-foreground hover:underline">Termos de Uso</button> e{" "}
            <button className="font-bold text-foreground hover:underline">Privacidade</button>.
          </p>
        </div>
      </div>
    </section>
  )
}

function Carousel({ slides }: { slides: { url: string; title?: string; description?: string }[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.url}
            alt={slide.title || "Slide"}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-10 text-white">
            <h3 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">{slide.title}</h3>
            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed opacity-90 sm:text-base">
              {slide.description}
            </p>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-10 right-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full",
              index === current ? "w-8 bg-white" : "w-2 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function CompanyLogoShowcase({
  logoUrl,
  companyName,
}: {
  logoUrl?: string
  companyName: string
}) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-background/25">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={companyName}
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
          <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground uppercase sm:mt-4 sm:text-6xl">
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
        "client-card group flex items-center gap-3 p-3.5 text-left text-foreground transition-all sm:flex-col sm:p-6 sm:text-center",
        variant === "primary" ? "border-primary/20 bg-primary/5" : ""
      )}
    >
      <span className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 sm:size-14",
        variant === "primary" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
      )}>
        <HugeiconsIcon icon={icon} size={24} />
      </span>
      <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight text-foreground sm:mt-6 sm:text-lg">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground sm:mt-2 sm:text-xs">{description}</p>
      </div>
    </button>
  )
}

function BookingExperience({
  step,
  bookingFlow,
  canContinue,
  selectedServiceIds,
  selectedServiceLines,
  bookingTotal,
  plan,
  subscription,
  planServiceIds,
  usedPlanCredits,
  professionalId,
  dateId,
  time,
  selectedServices,
  selectedProfessional,
  selectedDate,
  onServiceToggle,
  onProfessionalChange,
  onDateChange,
  onTimeChange,
  onBack,
  onNext,
  onConfirm,
}: {
  step: BookingStep
  bookingFlow: typeof bookingSteps
  canContinue: boolean
  selectedServiceIds: number[]
  selectedServiceLines: BookingServiceLine[]
  bookingTotal: number
  plan?: Plan
  subscription?: Subscription
  planServiceIds: number[]
  usedPlanCredits: number
  professionalId?: number
  dateId: string
  time: string
  selectedServices: typeof activeServices
  selectedProfessional?: (typeof professionals)[number]
  selectedDate: (typeof dateOptions)[number]
  onServiceToggle: (id: number) => void
  onProfessionalChange: (id: number) => void
  onDateChange: (id: string) => void
  onTimeChange: (time: string) => void
  onBack: () => void
  onNext: () => void
  onConfirm: () => void
}) {
  const stepIndex = bookingFlow.findIndex((item) => item.id === step)
  const currentStep = bookingFlow[stepIndex] ?? bookingFlow[0]

  return (
    <section className="grid flex-1 gap-4 py-3 sm:gap-8 sm:py-6 lg:grid-cols-[1fr_24rem]">
      <div className="min-w-0 pb-36 sm:pb-0">
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
          <StepCounter stepIndex={stepIndex} totalSteps={bookingFlow.length} />
        </div>

        <StepDots activeIndex={stepIndex} steps={bookingFlow} />

        <div className="mt-4 sm:mt-10">
          {step === "service" && (
            <ServiceStep
              selectedServiceIds={selectedServiceIds}
              plan={plan}
              subscription={subscription}
              planServiceIds={planServiceIds}
              usedPlanCredits={usedPlanCredits}
              onServiceToggle={onServiceToggle}
            />
          )}

          {step === "extras" && (
            <ExtrasStep
              selectedServiceIds={selectedServiceIds}
              subscription={subscription}
              planServiceIds={planServiceIds}
              onServiceToggle={onServiceToggle}
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
              services={selectedServices}
              serviceLines={selectedServiceLines}
              professional={selectedProfessional}
              selectedDate={selectedDate}
              time={time}
              total={bookingTotal}
            />
          )}
        </div>

        <BookingFooter
          placement="desktop"
          isLastStep={step === "confirm"}
          canContinue={canContinue}
          selectedLines={selectedServiceLines}
          total={bookingTotal}
          onBack={onBack}
          onNext={onNext}
          onConfirm={onConfirm}
        />
      </div>

      <SummaryRail
        selectedLines={selectedServiceLines}
        total={bookingTotal}
        professional={selectedProfessional}
        selectedDate={selectedDate}
        time={time}
      />
    </section>
  )
}

function ServiceStep({
  selectedServiceIds,
  plan,
  subscription,
  planServiceIds,
  usedPlanCredits,
  onServiceToggle,
}: {
  selectedServiceIds: number[]
  plan?: Plan
  subscription?: Subscription
  planServiceIds: number[]
  usedPlanCredits: number
  onServiceToggle: (id: number) => void
}) {
  const planServices = subscription
    ? activeServices.filter((service) => planServiceIds.includes(service.id))
    : []
  const remainingCredits = Math.max((plan?.servicesLimit ?? 0) - usedPlanCredits, 0)
  const availablePlanServices = planServices.filter(
    (service) => service.credits <= remainingCredits
  )

  return (
    <div className="space-y-5 sm:space-y-7">
      {subscription && plan && (
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-black tracking-[0.24em] text-primary uppercase">
                Agendar com plano
              </p>
              <h3 className="mt-1 truncate text-base font-black uppercase">
                {plan.name}
              </h3>
            </div>
            <div className="rounded-lg bg-background px-3 py-2 text-right border">
              <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                Restantes
              </p>
              <p className="text-sm font-black text-primary-contrast">
                {remainingCredits}/{plan.servicesLimit}
              </p>
            </div>
          </div>
        </div>
      )}

      {availablePlanServices.length > 0 && (
        <ServiceSection
          eyebrow="Incluídos no plano"
          description="Selecionar aqui usa seus créditos mensais."
          services={availablePlanServices}
          selectedServiceIds={selectedServiceIds}
          planServiceIds={planServiceIds}
          hasSubscription
          planOnly
          remainingPlanCredits={remainingCredits}
          onServiceToggle={onServiceToggle}
        />
      )}

      {subscription && plan && availablePlanServices.length === 0 && (
        <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
          <p className="text-sm font-black uppercase tracking-tight">
            Seus creditos do plano ja foram usados.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Avance para escolher servicos extras com o desconto da assinatura.
          </p>
        </div>
      )}

      {!subscription && (
      <ServiceSection
        eyebrow={subscription ? "Serviços extras" : "Escolha seu serviço"}
        description={
          subscription
            ? "Extras têm preço menor para assinantes."
            : "Você paga o valor integral no atendimento."
        }
        services={activeServices}
        selectedServiceIds={selectedServiceIds}
        planServiceIds={planServiceIds}
        hasSubscription={Boolean(subscription)}
        onServiceToggle={onServiceToggle}
      />
      )}
    </div>
  )
  /*
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
  */
}

function ExtrasStep({
  selectedServiceIds,
  subscription,
  planServiceIds,
  onServiceToggle,
}: {
  selectedServiceIds: number[]
  subscription?: Subscription
  planServiceIds: number[]
  onServiceToggle: (id: number) => void
}) {
  const extraServices = subscription
    ? activeServices.filter((service) => !planServiceIds.includes(service.id))
    : []

  return (
    <div className="space-y-5 sm:space-y-7">
      <div className="rounded-lg border border-primary/20 bg-background/70 p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary-contrast">
          Extras com desconto
        </p>
        <h3 className="mt-1 text-lg font-black uppercase tracking-tight">
          Quer adicionar algo a mais?
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Estes servicos nao consomem o plano e entram com desconto de assinante.
        </p>
      </div>

      <ServiceSection
        eyebrow="Servicos extras"
        description="Adicione somente se quiser complementar seu horario."
        services={extraServices}
        selectedServiceIds={selectedServiceIds}
        planServiceIds={planServiceIds}
        hasSubscription={Boolean(subscription)}
        onServiceToggle={onServiceToggle}
      />
    </div>
  )
}

function ServiceSection({
  eyebrow,
  description,
  services,
  selectedServiceIds,
  planServiceIds,
  hasSubscription,
  planOnly = false,
  remainingPlanCredits = Number.POSITIVE_INFINITY,
  onServiceToggle,
}: {
  eyebrow: string
  description: string
  services: typeof activeServices
  selectedServiceIds: number[]
  planServiceIds: number[]
  hasSubscription: boolean
  planOnly?: boolean
  remainingPlanCredits?: number
  onServiceToggle: (id: number) => void
}) {
  const selectedPlanCredits = selectedServiceIds.reduce((total, id) => {
    const service = activeServices.find((item) => item.id === id)
    return service && planServiceIds.includes(service.id)
      ? total + service.credits
      : total
  }, 0)

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[9px] font-black tracking-[0.24em] text-primary-contrast uppercase">
          {eyebrow}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-2.5 sm:gap-4">
        {services.map((service) => {
          const selected = selectedServiceIds.includes(service.id)
          const planCreditsLeft = Math.max(
            remainingPlanCredits - selectedPlanCredits,
            0
          )
          const canSelectPlanService =
            !planOnly || selected || service.credits <= planCreditsLeft
          const line = getBookingServiceLine(
            service,
            planServiceIds,
            hasSubscription,
            planOnly ? remainingPlanCredits : Number.POSITIVE_INFINITY
          )

          return (
            <button
              key={service.id}
              type="button"
              disabled={!canSelectPlanService}
              onClick={() => onServiceToggle(service.id)}
              data-selected={selected}
              className="client-choice-card flex items-center justify-between gap-3 p-3.5 disabled:cursor-not-allowed disabled:opacity-45 sm:p-6"
            >
              <div className="min-w-0 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="truncate text-base font-black tracking-tight uppercase sm:text-xl">
                    {service.name}
                  </h4>
                  <span
                    className={cn(
                      "rounded px-2 py-1 text-[8px] font-black tracking-widest uppercase",
                      line.kind === "plan"
                        ? "bg-primary/15 text-primary-contrast"
                        : line.kind === "extra"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {line.kind === "plan"
                      ? "Plano"
                      : line.kind === "extra"
                        ? `${line.discountPercent}% off`
                        : "Avulso"}
                  </span>
                </div>
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
                {line.kind === "plan" ? (
                  <p className="text-lg font-black text-primary-contrast sm:text-2xl">
                    Incluído
                  </p>
                ) : (
                  <>
                    {line.discountPercent > 0 && (
                      <p className="text-[10px] font-bold text-muted-foreground line-through">
                        {formatCurrency(service.price)}
                      </p>
                    )}
                    <p className="text-xl font-black text-primary-contrast sm:text-2xl">
                      {formatCurrency(line.finalPrice)}
                    </p>
                  </>
                )}
                <p className="mt-0.5 text-[8px] font-black text-muted-foreground uppercase tracking-tighter sm:mt-1 sm:text-[9px]">
                  {selected
                    ? "Selecionado"
                    : !canSelectPlanService
                      ? "Sem saldo"
                      : planOnly
                        ? `${planCreditsLeft} restante(s)`
                        : "Adicionar"}
                </p>
              </div>
            </button>
          )
        })}
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
  services,
  serviceLines,
  professional,
  selectedDate,
  time,
  total,
}: {
  services: typeof activeServices
  serviceLines: BookingServiceLine[]
  professional?: (typeof professionals)[number]
  selectedDate: (typeof dateOptions)[number]
  time: string
  total: number
}) {
  const duration = services.reduce(
    (sum, service) => sum + service.durationMinutes,
    0
  )

  return (
    <div className="client-card overflow-hidden">
      <div className="border-b bg-muted/50 p-4 sm:p-8">
        <h4 className="text-[9px] font-black tracking-[0.22em] text-primary-contrast uppercase sm:text-[11px] sm:tracking-[0.4em]">Resumo da Reserva</h4>
        <h3 className="mt-2 text-xl font-black leading-tight tracking-tight text-balance uppercase sm:mt-4 sm:text-4xl sm:leading-none sm:tracking-tighter">
          {services.length > 1
            ? `${services.length} serviços`
            : services[0]?.name || "Serviço"}
        </h3>
      </div>

      <div className="divide-y divide-border/40">
        {serviceLines.map((line) => (
          <CheckoutItem
            key={line.service.id}
            label={line.kind === "plan" ? "Plano" : "Serviço"}
            value={`${line.service.name} · ${
              line.kind === "plan" ? "incluído" : formatCurrency(line.finalPrice)
            }`}
            icon={Scissor01Icon}
          />
        ))}
      </div>

      <div className="divide-y divide-border/40">
        <CheckoutItem label="Profissional" value={professional?.name || "-"} icon={UserMultipleIcon} />
        <CheckoutItem 
          label="Data e Hora" 
          value={`${formatShortDate(selectedDate.id)} às ${time}`} 
          icon={Calendar03Icon} 
        />
        <CheckoutItem label="Duração Estimada" value={`${duration || 0} min`} icon={Clock01Icon} />
      </div>

      <div className="flex flex-col gap-3 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] text-muted-foreground uppercase sm:text-[11px] sm:tracking-[0.2em]">Valor Total</p>
          <p className="mt-1.5 text-2xl font-black text-primary-contrast sm:mt-2 sm:text-4xl">{formatCurrency(total)}</p>
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
  const [rescheduledAppointments, setRescheduledAppointments] = useState<
    Record<number, AppointmentReschedule>
  >({})
  const [detailsAppointment, setDetailsAppointment] =
    useState<AgendaEvent | null>(null)
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<AgendaEvent | null>(null)
  const [cancelAppointment, setCancelAppointment] =
    useState<AgendaEvent | null>(null)
  const [canceledAppointmentIds, setCanceledAppointmentIds] = useState<
    number[]
  >([])
  const [rescheduleDateId, setRescheduleDateId] = useState(dateOptions[0].id)
  const [rescheduleTime, setRescheduleTime] = useState("10:00")

  const appointments = useMemo(() => {
    const base = database.agendaEvents.filter(
      (event) => event.title === customer.name && event.type === "appointment"
    )
    const schedule = confirmedAppointment ? [confirmedAppointment, ...base] : base

    return schedule.map((appointment) => {
      const rescheduled = rescheduledAppointments[appointment.id]
      return rescheduled ? { ...appointment, ...rescheduled } : appointment
    })
  }, [confirmedAppointment, rescheduledAppointments])
  const activeAppointmentCount = appointments.filter(
    (appointment) => !canceledAppointmentIds.includes(appointment.id)
  ).length

  function openReschedule(appointment: AgendaEvent) {
    if (canceledAppointmentIds.includes(appointment.id)) return
    setRescheduleAppointment(appointment)
    setRescheduleDateId(appointment.date)
    setRescheduleTime(appointment.start)
  }

  function confirmReschedule() {
    if (!rescheduleAppointment) return

    const duration = getAppointmentDuration(rescheduleAppointment)
    setRescheduledAppointments((current) => ({
      ...current,
      [rescheduleAppointment.id]: {
        date: rescheduleDateId,
        start: rescheduleTime,
        end: getEndTime(rescheduleTime, duration),
      },
    }))
    setRescheduleAppointment(null)
  }

  function confirmCancelAppointment() {
    if (!cancelAppointment || !isAppointmentCancelable(cancelAppointment)) return

    setCanceledAppointmentIds((current) =>
      current.includes(cancelAppointment.id)
        ? current
        : [...current, cancelAppointment.id]
    )
    setCancelAppointment(null)
    if (detailsAppointment?.id === cancelAppointment.id) {
      setDetailsAppointment(null)
    }
  }

  return (
    <section className="min-w-0 overflow-hidden py-3 sm:py-6">
      <ScreenTitle
        eyebrow="Sua Agenda"
        title="Meus Horários"
        description="Confira seus agendamentos realizados e gerencie seu tempo."
      />

      <div className="client-card mb-4 grid gap-3 p-3 sm:mb-6 sm:grid-cols-3 sm:p-4">
        <MetricTile
          icon={Calendar03Icon}
          label="Proximo horario"
          value={
            appointments[0]
              ? `${formatShortDate(appointments[0].date)} as ${appointments[0].start}`
              : "Sem reserva"
          }
        />
        <MetricTile
          icon={CheckmarkCircle01Icon}
          label="Confirmados"
          value={`${activeAppointmentCount} ativo(s)`}
        />
        <MetricTile
          icon={Clock01Icon}
          label="Tempo reservado"
          value={`${appointments.length * 35} min`}
        />
      </div>

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
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isCanceled={canceledAppointmentIds.includes(appointment.id)}
              onDetails={() => setDetailsAppointment(appointment)}
              onReschedule={() => openReschedule(appointment)}
              onCancel={() => setCancelAppointment(appointment)}
            />
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

      <AppointmentDetailsDialog
        appointment={detailsAppointment}
        isCanceled={
          detailsAppointment
            ? canceledAppointmentIds.includes(detailsAppointment.id)
            : false
        }
        onOpenChange={(open) => {
          if (!open) setDetailsAppointment(null)
        }}
      />
      <RescheduleAppointmentDialog
        appointment={rescheduleAppointment}
        dateId={rescheduleDateId}
        time={rescheduleTime}
        onDateChange={setRescheduleDateId}
        onTimeChange={setRescheduleTime}
        onConfirm={confirmReschedule}
        onOpenChange={(open) => {
          if (!open) setRescheduleAppointment(null)
        }}
      />
      <CancelAppointmentDialog
        appointment={cancelAppointment}
        onConfirm={confirmCancelAppointment}
        onOpenChange={(open) => {
          if (!open) setCancelAppointment(null)
        }}
      />
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyPlanScreen({ onBooking }: { onBooking: () => void }) {
  const plan = fallbackCurrentPlan

  return (
    <section className="min-w-0 overflow-hidden py-3 sm:py-6">
      <ScreenTitle
        eyebrow="Assinatura"
        title={fallbackSubscription?.plan || "Plano Bronze"}
        description="Detalhes do seu plano atual e benefícios ativos."
      />

      <div className="grid min-w-0 gap-3 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <div className="client-card grid min-w-0 gap-3 p-4 sm:grid-cols-3 sm:p-6">
            <MetricTile icon={CrownIcon} label="Benefício" value={plan?.benefit || "Prioridade"} />
            <MetricTile icon={Calendar03Icon} label="Renovação" value={fallbackSubscription?.nextCharge || "05/05/2026"} />
            <MetricTile icon={Wallet02Icon} label="Mensalidade" value={fallbackSubscription ? formatCurrency(fallbackSubscription.value) : "R$ 0,00"} />
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

function PlanScreen({
  plan,
  plans,
  subscription,
  onBooking,
}: {
  plan?: Plan
  plans: Plan[]
  subscription?: Subscription
  onBooking: () => void
}) {
  const [plansDialogOpen, setPlansDialogOpen] = useState(false)
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle")
  const benefits = getPlanBenefits(plan)
  const planServices = activeServices.filter((service) =>
    getPlanServiceIds(activeServices, plan?.name).includes(service.id)
  )
  const availablePlans = plans.filter(
    (item) => item.status === "Ativo" || item.status === "Destaque"
  )

  function openPlansDialog() {
    setCheckoutPlan(null)
    setPaymentStatus("idle")
    setPlansDialogOpen(true)
  }

  function startCheckout(nextPlan: Plan) {
    setCheckoutPlan(nextPlan)
    setPaymentStatus("idle")
  }

  function confirmSubscription() {
    if (!checkoutPlan) return

    setPaymentStatus("processing")
    window.setTimeout(() => {
      const nextSubscription: Subscription = {
        id: Date.now(),
        clientId: customer.id,
        client: customer.name,
        phone: customer.phone,
        plan: checkoutPlan.name,
        value: checkoutPlan.price,
        nextCharge: formatSubscriptionDate(addMonths(new Date(), 1)),
        startedAt: formatSubscriptionDate(new Date()),
        status: "Ativa",
      }
      const currentSubscriptions = getStoredClientSubscriptions(
        database.subscriptions
      )
      const nextSubscriptions = [
        nextSubscription,
        ...currentSubscriptions.filter((item) => item.clientId !== customer.id),
      ]

      saveClientSubscriptions(nextSubscriptions)
      setPaymentStatus("success")
    }, 900)
  }

  return (
    <section className="min-w-0 overflow-hidden py-3 sm:py-6">
      <ScreenTitle
        eyebrow="Assinatura"
        title={subscription?.plan || "Sem plano ativo"}
        description="Gerencie sua assinatura, acompanhe limites e veja todos os beneficios ativos."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="plan-premium-card relative min-h-[250px] overflow-hidden rounded-lg p-5 text-white shadow-2xl sm:p-7">
          <div className="plan-card-ray" />
          <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/75">
                  Cartao do plano
                </p>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-5xl">
                  {plan?.name ?? "Cliente"}
                </h3>
                <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-white/75">
                  {plan?.benefit ?? "Escolha um plano para liberar beneficios mensais."}
                </p>
              </div>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white shadow-lg backdrop-blur">
                <HugeiconsIcon icon={CrownIcon} size={24} />
              </span>
            </div>

            <div className="grid gap-3 pt-8 sm:grid-cols-3">
              <PlanCardMetric label="Mensalidade" value={subscription ? formatCurrency(subscription.value) : "R$ 0,00"} />
              <PlanCardMetric label="Renova em" value={subscription?.nextCharge ?? "Sem data"} />
              <PlanCardMetric label="Limite mensal" value={`${plan?.servicesLimit ?? 0} servicos`} />
            </div>
          </div>
        </div>

        <div className="client-card min-w-0 p-4 shadow-xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary-contrast">
                Gerenciar
              </p>
              <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
                Minha assinatura
              </h3>
            </div>
            <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary-contrast">
              {subscription?.status ?? "Ativo"}
            </span>
          </div>

          <div className="mt-4 grid gap-2">
            <Button onClick={onBooking} className="green-shine h-11 rounded-lg text-[11px] font-black uppercase tracking-widest">
              Agendar com plano
            </Button>
            <Button
              variant="outline"
              onClick={openPlansDialog}
              className="h-11 rounded-lg text-[11px] font-black uppercase tracking-widest"
            >
              {subscription ? "Trocar plano" : "Ver planos disponiveis"}
            </Button>
            <Button variant="outline" className="h-11 rounded-lg text-[11px] font-black uppercase tracking-widest">
              Ver cobrancas
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="client-card p-4 sm:p-5">
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary-contrast">
            Beneficios
          </p>
          <div className="mt-4 grid gap-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={17} />
                </span>
                <p className="text-sm font-bold leading-snug">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="client-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary-contrast">
                Servicos inclusos
              </p>
              <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
                Pode usar no plano
              </h3>
            </div>
            <span className="text-2xl font-black text-primary-contrast">
              {planServices.length}
            </span>
          </div>
          <div className="mt-4 grid gap-2">
            {planServices.slice(0, 5).map((service) => (
              <div key={service.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/70 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black uppercase">
                    {service.name}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {service.duration} · {service.category}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-black text-primary-contrast">
                  Incluso
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AvailablePlansDialog
        open={plansDialogOpen}
        plans={availablePlans}
        currentPlanName={subscription?.plan}
        checkoutPlan={checkoutPlan}
        paymentStatus={paymentStatus}
        onOpenChange={setPlansDialogOpen}
        onSelectPlan={startCheckout}
        onBackToPlans={() => {
          setCheckoutPlan(null)
          setPaymentStatus("idle")
        }}
        onConfirm={confirmSubscription}
      />
    </section>
  )
}

function AvailablePlansDialog({
  open,
  plans,
  currentPlanName,
  checkoutPlan,
  paymentStatus,
  onOpenChange,
  onSelectPlan,
  onBackToPlans,
  onConfirm,
}: {
  open: boolean
  plans: Plan[]
  currentPlanName?: string
  checkoutPlan: Plan | null
  paymentStatus: "idle" | "processing" | "success"
  onOpenChange: (open: boolean) => void
  onSelectPlan: (plan: Plan) => void
  onBackToPlans: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="client-dialog sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {checkoutPlan ? "Checkout seguro" : "Planos disponiveis"}
          </DialogTitle>
          <DialogDescription>
            {checkoutPlan
              ? "Pagamento recorrente simulado no estilo Stripe."
              : "Escolha um plano para liberar beneficios no portal."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {checkoutPlan ? (
            <StripeLikeCheckout
              plan={checkoutPlan}
              paymentStatus={paymentStatus}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => {
                const current = plan.name === currentPlanName

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => onSelectPlan(plan)}
                    className="client-plan-option-card group min-w-0 p-4 text-left transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary-contrast">
                          {current ? "Plano atual" : plan.status}
                        </p>
                        <h3 className="mt-1 truncate text-xl font-black uppercase tracking-tight">
                          {plan.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-muted-foreground">
                          {plan.benefit}
                        </p>
                      </div>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <HugeiconsIcon icon={CrownIcon} size={20} />
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <PlanMiniMetric label="Mensal" value={formatCurrency(plan.price)} />
                      <PlanMiniMetric label="Limite" value={`${plan.servicesLimit} usos`} />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {current ? "Gerenciar" : "Assinar agora"}
                      </span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={18}
                        className="text-primary-contrast transition group-hover:translate-x-0.5"
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          {checkoutPlan ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onBackToPlans}
                disabled={paymentStatus === "processing"}
              >
                Voltar aos planos
              </Button>
              <Button
                type="button"
                className="green-shine"
                onClick={paymentStatus === "success" ? () => onOpenChange(false) : onConfirm}
                disabled={paymentStatus === "processing"}
              >
                {paymentStatus === "processing"
                  ? "Processando..."
                  : paymentStatus === "success"
                    ? "Concluir"
                    : "Assinar com Stripe"}
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StripeLikeCheckout({
  plan,
  paymentStatus,
}: {
  plan: Plan
  paymentStatus: "idle" | "processing" | "success"
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="plan-premium-card rounded-lg p-5 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/70">
          Assinatura
        </p>
        <h3 className="mt-2 text-3xl font-black uppercase tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-white/75">
          {plan.benefit}
        </p>
        <div className="mt-6 grid gap-2">
          <PlanCardMetric label="Mensalidade" value={formatCurrency(plan.price)} />
          <PlanCardMetric label="Limite mensal" value={`${plan.servicesLimit} servicos`} />
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-muted-foreground">
              Stripe checkout
            </p>
            <h3 className="mt-1 text-lg font-black uppercase tracking-tight">
              Pagamento seguro
            </h3>
          </div>
          <span className="rounded bg-muted px-2 py-1 text-[10px] font-black uppercase tracking-widest">
            Teste
          </span>
        </div>

        <div className="grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Email
            </span>
            <Input value={customer.email} readOnly />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Cartao
            </span>
            <Input value="4242 4242 4242 4242" readOnly />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Validade
              </span>
              <Input value="12/30" readOnly />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                CVC
              </span>
              <Input value="123" readOnly />
            </label>
          </div>
        </div>

        <div className="mt-4 rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Total hoje</span>
            <span>{formatCurrency(plan.price)}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A cobranca recorrente sera renovada mensalmente. Este checkout e uma simulacao.
          </p>
        </div>

        {paymentStatus === "success" && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm font-bold text-primary-contrast">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
            Assinatura aprovada e plano ativado.
          </div>
        )}
      </div>
    </div>
  )
}

function PlanMiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-2">
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black uppercase">{value}</p>
    </div>
  )
}

function PlanCardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/60">
        {label}
      </p>
      <p className="mt-1 text-lg font-black uppercase tracking-tight text-white">
        {value}
      </p>
    </div>
  )
}

function BookingFooter({
  placement,
  isLastStep,
  canContinue,
  selectedLines,
  total,
  onBack,
  onNext,
  onConfirm,
}: {
  placement: "mobile" | "desktop"
  isLastStep: boolean
  canContinue: boolean
  selectedLines: BookingServiceLine[]
  total: number
  onBack: () => void
  onNext: () => void
  onConfirm: () => void
}) {
  const includedCount = selectedLines.filter((line) => line.kind === "plan").length
  const serviceLabel =
    selectedLines.length === 1
      ? selectedLines[0].service.name
      : `${selectedLines.length} serviços selecionados`

  return (
    <div
      className={cn(
        "border-t bg-background/95 backdrop-blur-xl",
        placement === "mobile"
          ? "fixed inset-x-0 bottom-0 z-[80] px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:hidden"
          : "hidden sm:sticky sm:inset-auto sm:-mx-0 sm:mt-12 sm:block sm:px-0 sm:py-6 sm:pb-10"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-primary/20 bg-background p-2.5 shadow-lg shadow-primary/5 sm:hidden">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HugeiconsIcon icon={Calendar03Icon} size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-black uppercase tracking-tight">
              {selectedLines.length ? serviceLabel : "Escolha seus serviços"}
            </p>
            <p className="mt-0.5 truncate text-[10px] font-bold text-muted-foreground">
              {includedCount > 0 ? `${includedCount} no plano · ` : ""}
              {formatCurrency(total)}
            </p>
          </div>
        </div>

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
    </div>
  )
}

function SummaryRail({
  selectedLines,
  total,
  professional,
  selectedDate,
  time,
}: {
  selectedLines: BookingServiceLine[]
  total: number
  professional?: (typeof professionals)[number]
  selectedDate: (typeof dateOptions)[number]
  time: string
}) {
  const serviceSummary =
    selectedLines.length > 1
      ? `${selectedLines.length} serviços`
      : selectedLines[0]?.service.name || "Pendente"
  const service = { name: serviceSummary, price: total } as ServiceCatalogItem

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyAppointmentCard({ appointment }: { appointment: AgendaEvent }) {
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

function AppointmentCard({
  appointment,
  isCanceled,
  onDetails,
  onReschedule,
  onCancel,
}: {
  appointment: AgendaEvent
  isCanceled: boolean
  onDetails: () => void
  onReschedule: () => void
  onCancel: () => void
}) {
  const service = getAppointmentService(appointment)
  const duration = service?.duration ?? `${getAppointmentDuration(appointment)} min`
  const canCancel = isAppointmentCancelable(appointment)

  return (
    <div
      className={cn(
        "client-premium-card overflow-hidden",
        isCanceled && "grayscale"
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-primary/10 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary-contrast">
            Reserva premium
          </p>
          <h4 className="mt-1 truncate text-xl font-black uppercase tracking-tight sm:text-2xl">
            {appointment.detail}
          </h4>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {formatLongDate(appointment.date)}
          </p>
        </div>
        <div
          className={cn(
            "rounded-lg border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest",
            isCanceled
              ? "border-border bg-muted text-muted-foreground"
              : "border-primary/30 bg-primary/10 text-primary-contrast"
          )}
        >
          {isCanceled ? "Cancelado" : "Confirmado"}
        </div>
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5">
        <AppointmentDetail icon={Clock01Icon} label="Horario" value={`${appointment.start} - ${appointment.end}`} />
        <AppointmentDetail icon={Scissor01Icon} label="Duracao" value={duration} />
        <AppointmentDetail icon={UserMultipleIcon} label="Profissional" value={appointment.barber} />
        <AppointmentDetail icon={Wallet02Icon} label="Valor estimado" value={service ? formatCurrency(service.price) : "No local"} />
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-primary/10 p-4 pt-3 sm:grid-cols-3 sm:p-5 sm:pt-4">
        <Button
          type="button"
          onClick={onReschedule}
          disabled={isCanceled}
          className="h-10 rounded-lg bg-muted text-foreground border border-border/40 text-[10px] font-black uppercase tracking-widest hover:bg-muted/80"
        >
          Remarcar
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isCanceled || !canCancel}
          className="h-10 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={onDetails}
          className="green-shine col-span-2 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest sm:col-span-1"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  )
}

function AppointmentDetail({
  icon,
  label,
  value,
}: {
  icon: IconSvgElement
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border/50 bg-background/70 p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary-contrast">
        <HugeiconsIcon icon={icon} size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-black uppercase tracking-tight">
          {value}
        </p>
      </div>
    </div>
  )
}

function AppointmentDetailsDialog({
  appointment,
  isCanceled,
  onOpenChange,
}: {
  appointment: AgendaEvent | null
  isCanceled: boolean
  onOpenChange: (open: boolean) => void
}) {
  const service = appointment ? getAppointmentService(appointment) : undefined
  const duration = appointment
    ? service?.duration ?? `${getAppointmentDuration(appointment)} min`
    : "-"
  const cancelDeadline = appointment ? getCancelDeadline(appointment) : null

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent className="client-dialog">
        <DialogHeader>
          <DialogTitle>Detalhes do agendamento</DialogTitle>
          <DialogDescription>
            Confira todos os dados da sua reserva confirmada.
          </DialogDescription>
        </DialogHeader>
        {appointment && (
          <DialogBody className="space-y-3">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary-contrast">
                Servico reservado
              </p>
              <h3 className="mt-1 text-2xl font-black uppercase tracking-tight">
                {appointment.detail}
              </h3>
              <p className="mt-2 text-xs font-bold text-muted-foreground">
                {isCanceled
                  ? "Reserva cancelada pelo cliente."
                  : "Status confirmado pelo estabelecimento."}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <AppointmentDetail icon={Calendar03Icon} label="Data" value={formatLongDate(appointment.date)} />
              <AppointmentDetail icon={Clock01Icon} label="Horario" value={`${appointment.start} - ${appointment.end}`} />
              <AppointmentDetail icon={Scissor01Icon} label="Duracao" value={duration} />
              <AppointmentDetail icon={UserMultipleIcon} label="Profissional" value={appointment.barber} />
              <AppointmentDetail icon={Wallet02Icon} label="Valor" value={service ? formatCurrency(service.price) : "No local"} />
              <AppointmentDetail
                icon={Clock01Icon}
                label="Cancelar ate"
                value={
                  cancelDeadline && !isCanceled
                    ? formatDateTime(cancelDeadline)
                    : "Indisponivel"
                }
              />
              <AppointmentDetail icon={CheckmarkCircle01Icon} label="Reserva" value={`#${appointment.id}`} />
            </div>
          </DialogBody>
        )}
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RescheduleAppointmentDialog({
  appointment,
  dateId,
  time,
  onDateChange,
  onTimeChange,
  onConfirm,
  onOpenChange,
}: {
  appointment: AgendaEvent | null
  dateId: string
  time: string
  onDateChange: (id: string) => void
  onTimeChange: (time: string) => void
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent className="client-dialog">
        <DialogHeader>
          <DialogTitle>Remarcar horario</DialogTitle>
          <DialogDescription>
            Escolha uma nova data e horario para este atendimento.
          </DialogDescription>
        </DialogHeader>
        {appointment && (
          <DialogBody className="space-y-5">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary-contrast">
                Agendamento atual
              </p>
              <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
                {appointment.detail}
              </h3>
              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {formatShortDate(appointment.date)} as {appointment.start}
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                Nova data
              </h4>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 no-scrollbar">
                {dateOptions.map((date) => (
                  <button
                    key={date.id}
                    type="button"
                    onClick={() => onDateChange(date.id)}
                    data-selected={date.id === dateId}
                    className="client-choice-card flex min-w-[66px] flex-col items-center justify-center py-2.5"
                  >
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      {date.weekday}
                    </span>
                    <span className="mt-0.5 text-xl font-black tracking-tighter">
                      {date.day}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                Novo horario
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onTimeChange(slot.time)}
                    data-selected={slot.time === time}
                    className="client-choice-card flex h-11 items-center justify-center text-sm font-black disabled:opacity-20 disabled:grayscale"
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </DialogBody>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirmar remarcacao
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CancelAppointmentDialog({
  appointment,
  onConfirm,
  onOpenChange,
}: {
  appointment: AgendaEvent | null
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}) {
  const canCancel = appointment ? isAppointmentCancelable(appointment) : false
  const deadline = appointment ? getCancelDeadline(appointment) : null

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent className="client-dialog">
        <DialogHeader>
          <DialogTitle>Cancelar agendamento</DialogTitle>
          <DialogDescription>
            O cliente pode cancelar em ate 1 hora depois que o agendamento foi feito.
          </DialogDescription>
        </DialogHeader>
        {appointment && (
          <DialogBody className="space-y-4">
            <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-4 text-foreground">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-destructive">
                Politica de cancelamento
              </p>
              <h3 className="mt-1 text-xl font-black uppercase tracking-tight">
                {appointment.detail}
              </h3>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">
                {canCancel
                  ? `Cancelamento disponivel ate ${deadline ? formatDateTime(deadline) : "o prazo limite"}.`
                  : "O prazo de 1 hora para cancelamento ja expirou."}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <AppointmentDetail icon={Calendar03Icon} label="Data" value={formatLongDate(appointment.date)} />
              <AppointmentDetail icon={Clock01Icon} label="Horario" value={`${appointment.start} - ${appointment.end}`} />
              <AppointmentDetail icon={UserMultipleIcon} label="Profissional" value={appointment.barber} />
              <AppointmentDetail
                icon={CheckmarkCircle01Icon}
                label="Prazo"
                value={deadline ? formatDateTime(deadline) : "Expirado"}
              />
            </div>
          </DialogBody>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
          <Button
            type="button"
            disabled={!canCancel}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Confirmar cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StepCounter({
  stepIndex,
  totalSteps,
}: {
  stepIndex: number
  totalSteps: number
}) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-background/50 px-3 text-[10px] font-black tracking-widest text-muted-foreground backdrop-blur-md sm:h-12 sm:px-5 sm:text-xs">
      <span className="text-foreground">{String(stepIndex + 1).padStart(2, "0")}</span>
      <span className="opacity-30">/</span>
      <span className="opacity-50">{String(totalSteps).padStart(2, "0")}</span>
    </div>
  )
}

function StepDots({
  activeIndex,
  steps,
}: {
  activeIndex: number
  steps: typeof bookingSteps
}) {
  return (
    <div className="flex gap-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex-1">
          <div className={cn(
            "h-1.5 rounded transition-all duration-700 sm:h-2",
            index <= activeIndex ? "bg-primary" : "bg-muted"
          )} />
        </div>
      ))}
    </div>
  )
}

function MetricTile({ icon, label, value }: { icon: IconSvgElement, label: string, value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 sm:block sm:space-y-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground sm:size-12">
        <HugeiconsIcon icon={icon} size={24} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-black tracking-widest text-muted-foreground uppercase">{label}</p>
        <p className="mt-1 text-base font-black leading-tight tracking-tight break-words sm:text-xl">{value}</p>
      </div>
    </div>
  )
}

function getBookingFlow(hasSubscription: boolean) {
  return hasSubscription
    ? bookingSteps
    : bookingSteps.filter((step) => step.id !== "extras")
}

function getCanContinueBooking({
  step,
  selectedServiceIds,
  professionalId,
  time,
  hasSubscription,
  planServiceIds,
  usedPlanCredits,
  servicesLimit,
}: {
  step: BookingStep
  selectedServiceIds: number[]
  professionalId?: number
  time: string
  hasSubscription: boolean
  planServiceIds: number[]
  usedPlanCredits: number
  servicesLimit: number
}) {
  if (step === "extras") return true
  if (step === "professional") return Boolean(professionalId)
  if (step === "datetime") return Boolean(time)
  if (step === "confirm") return true

  if (!hasSubscription) return selectedServiceIds.length > 0

  const remainingCredits = Math.max(servicesLimit - usedPlanCredits, 0)
  const planServiceCount = activeServices.filter(
    (service) =>
      planServiceIds.includes(service.id) && service.credits <= remainingCredits
  ).length

  if (remainingCredits <= 0 || planServiceCount === 0) return true

  return selectedServiceIds.some((id) => planServiceIds.includes(id))
}

function getInitialBookingService(services: typeof activeServices, plan?: Plan) {
  if (plan) return undefined
  return services[0]
}

function getPlanServiceIds(services: typeof activeServices, planName?: string) {
  const normalizedPlan = normalizeText(planName ?? "")

  if (!normalizedPlan) return []

  if (normalizedPlan.includes("integral")) {
    return services.map((service) => service.id)
  }

  if (normalizedPlan.includes("completo")) {
    return services
      .filter((service) =>
        ["barba", "cabelo", "combo"].some((category) =>
          normalizeText(service.category).includes(category)
        )
      )
      .map((service) => service.id)
  }

  if (normalizedPlan.includes("barba")) {
    return services
      .filter((service) =>
        normalizeText(`${service.name} ${service.category}`).includes("barba")
      )
      .map((service) => service.id)
  }

  return services
    .filter((service) => {
      const searchable = normalizeText(`${service.name} ${service.category}`)
      return (
        service.credits <= 1 &&
        service.price <= 65 &&
        (searchable.includes("barba") || searchable.includes("cabelo"))
      )
    })
    .map((service) => service.id)
}

function getBookingServiceLine(
  service: ServiceCatalogItem,
  planServiceIds: number[],
  hasSubscription: boolean,
  remainingPlanCredits = Number.POSITIVE_INFINITY
): BookingServiceLine {
  if (
    hasSubscription &&
    planServiceIds.includes(service.id) &&
    remainingPlanCredits >= service.credits
  ) {
    return {
      service,
      kind: "plan",
      finalPrice: 0,
      discountPercent: 100,
    }
  }

  if (hasSubscription) {
    return {
      service,
      kind: "extra",
      finalPrice: roundCurrency(service.price * 0.8),
      discountPercent: 20,
    }
  }

  return {
    service,
    kind: "regular",
    finalPrice: service.price,
    discountPercent: 0,
  }
}

function getUsedPlanCredits(
  planServiceIds: number[],
  confirmedAppointment: AgendaEvent | null
) {
  const appointments = database.agendaEvents.filter(
    (event) => event.title === customer.name && event.type === "appointment"
  )
  const allAppointments = confirmedAppointment
    ? [confirmedAppointment, ...appointments]
    : appointments

  return allAppointments.reduce((total, appointment) => {
    const normalizedDetail = normalizeText(appointment.detail)
    const matchedServices = activeServices.filter(
      (service) =>
        planServiceIds.includes(service.id) &&
        normalizedDetail.includes(normalizeText(service.name))
    )

    return (
      total +
      matchedServices.reduce((sum, service) => sum + service.credits, 0)
    )
  }, 0)
}

function getAppointmentService(appointment: AgendaEvent) {
  return activeServices.find((item) =>
    normalizeText(appointment.detail).includes(normalizeText(item.name))
  )
}

function getAppointmentDuration(appointment: AgendaEvent) {
  const service = getAppointmentService(appointment)
  return service?.durationMinutes ?? getMinutesBetween(appointment.start, appointment.end)
}

function getAppointmentCreatedAt(appointment: AgendaEvent) {
  return appointment.id > 1_000_000_000_000 ? new Date(appointment.id) : null
}

function getCancelDeadline(appointment: AgendaEvent) {
  const createdAt = getAppointmentCreatedAt(appointment)
  return createdAt ? new Date(createdAt.getTime() + 60 * 60 * 1000) : null
}

function isAppointmentCancelable(appointment: AgendaEvent) {
  const deadline = getCancelDeadline(appointment)
  return Boolean(deadline && Date.now() <= deadline.getTime())
}

function getPlanBenefits(plan?: Plan) {
  const baseBenefits = [
    plan?.benefit ?? "Benefícios exclusivos ativos",
    `${plan?.servicesLimit ?? 1} atendimento(s) incluído(s) no mês`,
    "20% de desconto em serviços extras",
    "Prioridade nos melhores horários",
  ]

  return Array.from(new Set(baseBenefits))
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function getCompanyDisplayName(value: string) {
  const normalized = value.trim()
  return (!normalized || normalized === "Empresa sem nome definido") ? "Empresa" : normalized
}

function getStoredCarouselImage(key: string) {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem(key) || ""
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

function getMinutesBetween(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number)
  const [endHour, endMinute] = end.split(":").map(Number)
  return endHour * 60 + endMinute - (startHour * 60 + startMinute)
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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value)
}

function addMonths(value: Date, months: number) {
  const nextDate = new Date(value)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}

function formatSubscriptionDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value)
}
