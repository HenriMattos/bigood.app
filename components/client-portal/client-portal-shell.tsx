"use client"

import { useEffect, useRef, useState, type UIEvent } from "react"
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  Scissor01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BookingFlow, type BookingPayload } from "./booking-flow"
import { ClientAuthModal } from "./client-auth-modal"
import { ClientBottomNav, type ClientPortalTab } from "./client-bottom-nav"
import {
  formatCurrency,
  formatDateLabel,
  getClientPortalData,
  getNextRenewalDate,
  readClientPortalState,
  saveClientPortalState,
  toDateInputValue,
  type AppointmentStatus,
  type ClientPortalAppointment,
  type ClientPortalData,
  type ClientPortalPlan,
  type ClientPortalState,
  type ClientProfile,
  type PaymentMethod,
} from "./client-portal-data"
import { ClientPortalHeader } from "./client-portal-header"
import { CheckoutScreen } from "./checkout-screen"
import { ClientAuthProvider, useClientAuth } from "@/hooks/use-client-auth"
import { useDragScroll } from "./use-drag-scroll"
import { COMPANY_PORTAL_SYNC_EVENT } from "@/components/company/company-assets"
import { cn } from "@/lib/utils"

const appointmentFilters = ["Todos", "Proximos", "Finalizados", "Cancelados"]

const statusLabels: Record<AppointmentStatus, string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  completed: "Finalizado",
  cancelled: "Cancelado",
}

const emptyClientPortalData: ClientPortalData = {
  company: null,
  services: [],
  professionals: [],
  plans: [],
}

function createEmptyClientPortalState(): ClientPortalState {
  return {
    profile: {
      id: "",
      name: "",
      phone: "",
      email: "",
      birthDate: "",
      cpf: "",
      gender: "",
      contactPreferences: {
        whatsapp: false,
        email: false,
        sms: false,
      },
    },
    appointments: [],
    subscription: null,
  }
}

export function ClientPortalShell({ slug }: { slug: string }) {
  return (
    <ClientAuthProvider slug={slug}>
      <PortalContent slug={slug} />
    </ClientAuthProvider>
  )
}

function PortalContent({ slug }: { slug: string }) {
  const {
    user,
    isAuthenticated,
    logout,
  } = useClientAuth()
  const [data, setData] = useState<ClientPortalData>(emptyClientPortalData)
  const [portalState, setPortalState] = useState<ClientPortalState>(
    createEmptyClientPortalState
  )
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<ClientPortalTab>("home")
  const [bookingOpen, setBookingOpen] = useState(false)
  const [initialBookingServiceId, setInitialBookingServiceId] = useState<
    string | undefined
  >()
  const [checkoutPlan, setCheckoutPlan] = useState<ClientPortalPlan | null>(
    null
  )
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login"
  )
  const pendingBookingRef = useRef<BookingPayload | null>(null)

  useEffect(() => {
    function refreshPortalData() {
      const nextData = getClientPortalData(slug)
      setData(nextData)
      setPortalState(readClientPortalState(slug, nextData))
      setReady(true)
    }

    const frame = window.requestAnimationFrame(refreshPortalData)

    return () => window.cancelAnimationFrame(frame)
  }, [slug])

  useEffect(() => {
    function refreshPortalData() {
      const nextData = getClientPortalData(slug)
      setData(nextData)
    }

    function handleStorage(event: StorageEvent) {
      if (!event.key || event.key.includes("clientPortal")) {
        refreshPortalData()
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener(COMPANY_PORTAL_SYNC_EVENT, refreshPortalData)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(COMPANY_PORTAL_SYNC_EVENT, refreshPortalData)
    }
  }, [slug])

  useEffect(() => {
    if (!ready || !data.company) {
      return
    }

    saveClientPortalState(slug, portalState)
  }, [data.company, portalState, ready, slug])

  if (!ready) {
    return <PortalLoading />
  }

  if (!data.company) {
    return <PortalNotFound slug={slug} />
  }

  function openBooking(serviceId?: string) {
    setInitialBookingServiceId(serviceId)
    setBookingOpen(true)
  }

  function createAppointment(payload: BookingPayload) {
    const appointment: ClientPortalAppointment = {
      id: `appointment_${Date.now()}`,
      status: "confirmed",
      serviceId: payload.service.id,
      serviceName: payload.service.name,
      professionalId: payload.professional.id,
      professionalName: payload.professional.name,
      date: payload.date,
      time: payload.time,
      price: payload.service.price,
      address: data.company?.address,
      notes: "Agendamento criado pelo portal mobile.",
    }

    setPortalState((current) => ({
      ...current,
      appointments: [appointment, ...current.appointments],
    }))
  }

  function updateProfile(profile: ClientProfile) {
    setPortalState((current) => ({
      ...current,
      profile,
    }))
  }

  function logoutProfile() {
    setPortalState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        name: "",
        phone: "",
        email: "",
        birthDate: "",
        cpf: "",
        gender: "",
        contactPreferences: {
          whatsapp: false,
          email: false,
          sms: false,
        },
      },
    }))
  }

  function subscribe(plan: ClientPortalPlan, paymentMethod: PaymentMethod) {
    setPortalState((current) => ({
      ...current,
      subscription: {
        planId: plan.id,
        planName: plan.name,
        status: "active",
        startedAt: toDateInputValue(new Date()),
        renewsAt: getNextRenewalDate(),
        price: plan.price,
        paymentMethod,
        benefits: plan.benefits,
      },
    }))
  }

  function openAuthModal(mode: "login" | "register") {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }

  function handleAuthSuccess() {
    if (pendingBookingRef.current) {
      const payload = pendingBookingRef.current
      pendingBookingRef.current = null
      createAppointment(payload)
      setBookingOpen(false)
      setActiveTab("appointments")
    }

    if (checkoutPlan) {
      setCheckoutPlan(null)
      setActiveTab("plans")
    }
  }

  function handleBookingRequireAuth(payload: BookingPayload) {
    pendingBookingRef.current = payload
    openAuthModal("login")
  }

  function handleCheckoutRequireAuth() {
    openAuthModal("login")
  }

  async function handleLogout() {
    await logout(slug)
    logoutProfile()
  }

  if (!ready) {
    return (
      <main className="client-portal-app min-h-dvh bg-[var(--client-bg)] text-[var(--client-primary-dark)]">
        <PortalLoading />
      </main>
    )
  }

  if (!data.company) {
    return (
      <main className="client-portal-app min-h-dvh bg-[var(--client-bg)] text-[var(--client-primary-dark)]">
        <PortalNotFound slug={slug} />
      </main>
    )
  }

  return (
    <main className="client-portal-app min-h-dvh bg-[var(--client-bg)] text-[var(--client-primary-dark)]">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-[var(--client-bg)] pb-[calc(104px+env(safe-area-inset-bottom))]">
        {activeTab === "home" && (
          <HomeTab
            data={data}
            state={portalState}
            onBook={openBooking}
            onViewAppointments={() => setActiveTab("appointments")}
            userName={user?.name}
            onAuthClick={() => openAuthModal("login")}
          />
        )}

        {activeTab === "appointments" && (
          <AppointmentsTab
            appointments={portalState.appointments}
            onBook={openBooking}
            isAuthenticated={isAuthenticated}
            onAuthClick={() => openAuthModal("login")}
          />
        )}

        {activeTab === "plans" && (
          <PlansTab
            plans={data.plans}
            subscription={portalState.subscription}
            onSubscribe={setCheckoutPlan}
          />
        )}

        {activeTab === "profile" && (
          isAuthenticated ? (
            <ProfileTab
              profile={portalState.profile}
              onSave={updateProfile}
              onLogout={handleLogout}
            />
          ) : (
            <ProfileGuestTab onAuthClick={() => openAuthModal("login")} />
          )
        )}
      </div>

      {user && (
        <div className="relative z-40 mx-auto w-full max-w-[430px] px-5 pb-1">
          <p className="text-center text-[10px] font-semibold text-[#6f8178]">
            Conectado como {user.name}
          </p>
        </div>
      )}

      <ClientBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBook={() => openBooking()}
      />

      {bookingOpen && (
        <BookingFlow
          open={bookingOpen}
          services={data.services}
          professionals={data.professionals}
          initialServiceId={initialBookingServiceId}
          onClose={() => setBookingOpen(false)}
          onConfirm={createAppointment}
          onRequireAuth={handleBookingRequireAuth}
          onViewAppointments={() => {
            setBookingOpen(false)
            setActiveTab("appointments")
          }}
        />
      )}

      <CheckoutScreen
        plan={checkoutPlan}
        profile={portalState.profile}
        onClose={() => {
          setCheckoutPlan(null)
          setActiveTab("plans")
        }}
        onConfirm={subscribe}
        onRequireAuth={handleCheckoutRequireAuth}
      />

      <ClientAuthModal
        slug={slug}
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false)
          pendingBookingRef.current = null
        }}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </main>
  )
}

function HomeTab({
  data,
  state,
  onBook,
  onViewAppointments,
  userName,
  onAuthClick,
}: {
  data: ClientPortalData
  state: ClientPortalState
  onBook: (serviceId?: string) => void
  onViewAppointments: () => void
  userName?: string
  onAuthClick?: () => void
}) {
  const recentAppointment = state.appointments[0]

  if (!data.company) {
    return null
  }

  return (
    <>
      <ClientPortalHeader
        company={data.company}
        userName={userName}
        onAuthClick={onAuthClick}
      />

      <section className="px-5 pt-6">
        <RecentAppointmentCard
          appointment={recentAppointment}
          onBook={() => onBook()}
          onView={onViewAppointments}
          onReschedule={(serviceId) => onBook(serviceId)}
        />
      </section>

      <section className="px-5 pt-7">
        <SectionTitle
          title="Servicos disponiveis"
          description="Escolha um servico para iniciar seu agendamento."
        />

        <div className="mt-4 grid gap-3">
          {data.services.length === 0 ? (
            <EmptyState
              title="Sem servicos disponiveis"
              description="Esta barbearia ainda nao possui servicos disponiveis para agendamento."
            />
          ) : (
            data.services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onBook(service.id)}
                className="client-service-card"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-[rgba(11,51,36,0.06)] text-[#0a3f28]">
                  <HugeiconsIcon icon={Scissor01Icon} size={20} aria-hidden />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <strong className="block truncate text-sm font-black">
                    {service.name}
                  </strong>
                  <small className="mt-1 block truncate text-xs font-semibold text-[#6f8178]">
                    {service.durationMinutes}min - {service.description}
                  </small>
                </span>
                <b className="shrink-0 text-sm">
                  {formatCurrency(service.price)}
                </b>
              </button>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => onBook()}
          className="client-button-lime mt-6 h-14 w-full uppercase"
        >
          <HugeiconsIcon icon={Calendar03Icon} size={18} aria-hidden />
          Agendar agora
        </button>
      </section>
    </>
  )
}

function RecentAppointmentCard({
  appointment,
  onBook,
  onView,
  onReschedule,
}: {
  appointment?: ClientPortalAppointment
  onBook: () => void
  onView: () => void
  onReschedule: (serviceId: string) => void
}) {
  if (!appointment) {
    return (
      <article className="client-card">
        <p className="text-[11px] font-black tracking-[0.08em] text-[#6f8178] uppercase">
          Proximo atendimento
        </p>
        <h2 className="mt-3 text-[20px] leading-6 font-black">
          Nenhum agendamento por enquanto.
        </h2>
        <p className="mt-2 text-sm leading-6 font-medium text-[#6f8178]">
          Agende seu proximo atendimento em poucos cliques.
        </p>
        <button
          type="button"
          onClick={onBook}
          className="client-button-lime mt-4 h-11 px-5 text-xs uppercase"
        >
          Agendar agora
        </button>
      </article>
    )
  }

  return (
    <article className="client-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black tracking-[0.08em] text-[#6f8178] uppercase">
            Proximo atendimento
          </p>
          <h2 className="mt-2 truncate text-[20px] leading-6 font-black">
            {appointment.serviceName}
          </h2>
        </div>
        <StatusPill status={appointment.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm font-semibold text-[#6f8178]">
        <InfoRow
          icon={Calendar03Icon}
          label={`${formatDateLabel(appointment.date)} as ${appointment.time}`}
        />
        <InfoRow icon={UserIcon} label={appointment.professionalName} />
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="client-button-outline h-10 flex-1 text-xs"
        >
          Ver detalhes
        </button>
        <button
          type="button"
          onClick={() => onReschedule(appointment.serviceId)}
          className="client-button-dark h-10 flex-1 text-xs"
        >
          Reagendar
        </button>
      </div>
    </article>
  )
}

function AppointmentsTab({
  appointments,
  onBook,
  isAuthenticated,
  onAuthClick,
}: {
  appointments: ClientPortalAppointment[]
  onBook: (serviceId?: string) => void
  isAuthenticated?: boolean
  onAuthClick?: () => void
}) {
  const [filter, setFilter] = useState("Todos")
  const [selectedAppointment, setSelectedAppointment] =
    useState<ClientPortalAppointment | null>(null)
  const filtersCarousel = useDragScroll<HTMLDivElement>()

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "Todos") return true
    if (filter === "Proximos") {
      return (
        appointment.status === "confirmed" || appointment.status === "pending"
      )
    }
    if (filter === "Finalizados") return appointment.status === "completed"
    return appointment.status === "cancelled"
  })

  return (
    <PageFrame
      eyebrow="Historico"
      title="Agendamentos"
      description="Acompanhe proximos atendimentos, passados e cancelados."
    >
      {!isAuthenticated ? (
        <EmptyState
          title="Entre para ver seus agendamentos."
          description="Faça login ou crie uma conta para acompanhar seus atendimentos."
          actionLabel="Entrar"
          onAction={onAuthClick}
        />
      ) : (
        <>
          <div className="client-scroll-frame">
            <div
              {...filtersCarousel}
              className="client-carousel flex gap-2 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {appointmentFilters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cn(
                    "h-10 min-w-max rounded-full border px-4 text-xs font-black transition active:scale-95",
                    filter === item ? "client-filter-active" : "client-filter-idle"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {filteredAppointments.length === 0 ? (
              <EmptyState
                title="Seu historico aparecera aqui."
                description="Quando voce fizer um agendamento, ele sera listado nesta tela."
              />
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentHistoryCard
                  key={appointment.id}
                  appointment={appointment}
                  onDetails={setSelectedAppointment}
                  onReschedule={(serviceId) => onBook(serviceId)}
                />
              ))
            )}
          </div>

          {selectedAppointment && (
            <AppointmentDetails
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
              onReschedule={(serviceId) => {
                setSelectedAppointment(null)
                onBook(serviceId)
              }}
            />
          )}
        </>
      )}
    </PageFrame>
  )
}

function AppointmentHistoryCard({
  appointment,
  onDetails,
  onReschedule,
}: {
  appointment: ClientPortalAppointment
  onDetails: (appointment: ClientPortalAppointment) => void
  onReschedule: (serviceId: string) => void
}) {
  return (
    <article className="client-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black">
            {appointment.serviceName}
          </h3>
          <p className="mt-1 text-xs font-semibold text-[#6f8178]">
            {appointment.professionalName}
          </p>
        </div>
        <StatusPill status={appointment.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm font-semibold text-[#6f8178]">
        <InfoRow
          icon={Calendar03Icon}
          label={`${formatDateLabel(appointment.date)} as ${appointment.time}`}
        />
        <InfoRow
          icon={CreditCardIcon}
          label={formatCurrency(appointment.price)}
        />
      </div>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onDetails(appointment)}
          className="client-button-outline h-10 flex-1 text-xs"
        >
          Ver detalhes
        </button>
        <button
          type="button"
          onClick={() => onReschedule(appointment.serviceId)}
          className="client-button-lime h-10 flex-1 text-xs"
        >
          Reagendar
        </button>
      </div>
    </article>
  )
}

function AppointmentDetails({
  appointment,
  onClose,
  onReschedule,
}: {
  appointment: ClientPortalAppointment
  onClose: () => void
  onReschedule: (serviceId: string) => void
}) {
  return (
    <div className="fixed inset-y-0 left-1/2 z-[80] w-full max-w-[430px] -translate-x-1/2 border-x border-[var(--client-border,#d6e2db)] bg-[rgba(10,63,40,0.36)] px-4 pt-6 backdrop-blur-[2px]">
      <div className="flex h-full w-full items-end">
        <article className="max-h-[calc(100dvh-24px)] w-full overflow-y-auto rounded-t-[32px] border-x border-t border-[var(--client-border,#d6e2db)] bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black tracking-[0.08em] text-[#6f8178] uppercase">
                Detalhes
              </p>
              <h3 className="mt-2 text-xl font-black">
                {appointment.serviceName}
              </h3>
            </div>
            <StatusPill status={appointment.status} />
          </div>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-[#6f8178]">
            <InfoRow
              icon={Calendar03Icon}
              label={`${formatDateLabel(appointment.date)} as ${appointment.time}`}
            />
            <InfoRow icon={UserIcon} label={appointment.professionalName} />
            <InfoRow
              icon={CreditCardIcon}
              label={formatCurrency(appointment.price)}
            />
            {appointment.address && (
              <p className="rounded-[18px] bg-[rgba(11,51,36,0.04)] p-3">
                {appointment.address}
              </p>
            )}
          </div>
          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => onReschedule(appointment.serviceId)}
              className="client-button-lime h-12"
            >
              Reagendar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="client-button-outline h-12"
            >
              Fechar
            </button>
          </div>
        </article>
      </div>
    </div>
  )
}

function ProfileTab({
  profile,
  onSave,
  onLogout,
}: {
  profile: ClientProfile
  onSave: (profile: ClientProfile) => void
  onLogout: () => void
}) {
  const [draft, setDraft] = useState(profile)
  const [feedback, setFeedback] = useState("Dados prontos para editar.")

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setDraft(profile))

    return () => window.cancelAnimationFrame(frame)
  }, [profile])

  function update<Key extends keyof ClientProfile>(
    key: Key,
    value: ClientProfile[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function updatePreference(
    key: keyof ClientProfile["contactPreferences"],
    value: boolean
  ) {
    setDraft((current) => ({
      ...current,
      contactPreferences: {
        ...current.contactPreferences,
        [key]: value,
      },
    }))
  }

  return (
    <PageFrame
      eyebrow="Minha conta"
      title="Perfil"
      description="Atualize seus dados basicos e preferencias de contato."
    >
      <div className="client-card">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full bg-[#0a3f28] text-xl font-black text-[#d8f23a]">
            {draft.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "CL"}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black">
              {draft.name || "Cliente"}
            </h3>
            <p className="truncate text-sm font-semibold text-[#6f8178]">
              {draft.email || "email@cliente.com"}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-5 grid gap-3">
        <ClientField
          label="Nome completo"
          value={draft.name}
          onChange={(value) => update("name", value)}
        />
        <ClientField
          label="Telefone"
          value={draft.phone}
          onChange={(value) => update("phone", value)}
        />
        <ClientField
          label="E-mail"
          value={draft.email}
          type="email"
          onChange={(value) => update("email", value)}
        />
        <ClientField
          label="Data de nascimento"
          value={draft.birthDate || ""}
          type="date"
          onChange={(value) => update("birthDate", value)}
        />
        <ClientField
          label="CPF opcional"
          value={draft.cpf || ""}
          onChange={(value) => update("cpf", value)}
        />
      </section>

      <section className="client-card mt-5">
        <SectionTitle
          title="Preferencias"
          description="Escolha como a barbearia pode falar com voce."
        />
        <div className="mt-4 grid gap-3">
          {(["whatsapp", "email", "sms"] as const).map((item) => (
            <label
              key={item}
              className="flex items-center justify-between rounded-[20px] bg-[rgba(11,51,36,0.04)] px-4 py-3 text-sm font-black capitalize"
            >
              {item}
              <input
                type="checkbox"
                checked={draft.contactPreferences[item]}
                onChange={(event) =>
                  updatePreference(item, event.target.checked)
                }
                className="size-5 accent-[#d8f23a]"
              />
            </label>
          ))}
        </div>
      </section>

      <p className="mt-4 rounded-[20px] bg-[rgba(11,51,36,0.05)] p-4 text-sm font-semibold text-[#6f8178]">
        {feedback}
      </p>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={() => {
            onSave(draft)
            setFeedback("Alteracoes salvas no portal.")
          }}
          className="client-button-lime h-14 uppercase"
        >
          Salvar alteracoes
        </button>
        <button
          type="button"
          onClick={() => {
            onLogout()
            setFeedback("Sessao local encerrada.")
          }}
          className="h-12 rounded-full border border-red-200 bg-white text-sm font-black text-red-600 transition active:scale-95"
        >
          Sair da conta
        </button>
      </div>
    </PageFrame>
  )
}

function PlansTab({
  plans,
  subscription,
  onSubscribe,
}: {
  plans: ClientPortalPlan[]
  subscription: ClientPortalState["subscription"]
  onSubscribe: (plan: ClientPortalPlan) => void
}) {
  const plansCarousel = useDragScroll<HTMLDivElement>()
  const [activePlanIndex, setActivePlanIndex] = useState(0)

  function updateActivePlan(event: UIEvent<HTMLDivElement>) {
    const carousel = event.currentTarget
    const cards = Array.from(
      carousel.querySelectorAll<HTMLElement>("[data-plan-card]")
    )

    if (cards.length === 0) {
      return
    }

    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2
    const nextIndex = cards.reduce((closestIndex, card, index) => {
      const closestCard = cards[closestIndex]
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2

      return Math.abs(cardCenter - carouselCenter) <
        Math.abs(closestCenter - carouselCenter)
        ? index
        : closestIndex
    }, 0)

    setActivePlanIndex(nextIndex)
  }

  return (
    <PageFrame
      eyebrow="Beneficios"
      title="Planos"
      description="Assine beneficios exclusivos para sua rotina na barbearia."
    >
      {subscription ? (
        <article className="relative overflow-hidden rounded-[32px] border border-[rgba(216,242,58,0.35)] bg-[var(--client-primary-dark)] p-6 text-white">
          <div className="relative">
            <p className="text-xs font-black tracking-[0.08em] text-[#d8f23a] uppercase">
              Plano atual
            </p>
            <h3 className="mt-3 text-2xl font-black">
              {subscription.planName}
            </h3>
            <p className="mt-2 inline-flex rounded-full bg-[#d8f23a] px-3 py-1 text-xs font-black text-[#0a3f28]">
              Ativo
            </p>
            <div className="mt-5 grid gap-2 text-sm font-semibold text-white/75">
              <p>Inicio: {formatDateLabel(subscription.startedAt)}</p>
              <p>Renovacao: {formatDateLabel(subscription.renewsAt)}</p>
              <p>{formatCurrency(subscription.price)}/mes</p>
            </div>
            <div className="mt-5 grid gap-2">
              {subscription.benefits.map((benefit) => (
                <p key={benefit} className="flex items-center gap-2 text-sm">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={16}
                    aria-hidden
                  />
                  {benefit}
                </p>
              ))}
            </div>
          </div>
        </article>
      ) : (
        <article className="relative overflow-hidden rounded-[32px] border border-[rgba(216,242,58,0.35)] bg-[var(--client-primary-dark)] p-6 text-white">
          <div className="relative">
            <p className="text-xs font-black tracking-[0.08em] text-[#d8f23a] uppercase">
              Sem plano ativo
            </p>
            <h3 className="mt-3 text-2xl leading-7 font-black">
              Voce ainda nao possui um plano ativo.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Veja os planos disponiveis e escolha o melhor para voce.
            </p>
          </div>
        </article>
      )}

      <section className="mt-7">
        <SectionTitle
          title="Planos disponiveis"
          description="Arraste para comparar beneficios e valores."
        />
        <div className="client-scroll-frame mt-4">
          <div
            {...plansCarousel}
            onScroll={updateActivePlan}
            className="client-carousel flex snap-x snap-mandatory scroll-px-2 gap-4 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {plans.map((plan, index) => (
              <article
                key={plan.id}
                data-plan-card
                className={cn(
                  "client-plan-card min-w-[78%] snap-center rounded-[28px] border p-5",
                  index === activePlanIndex
                    ? "scale-100 opacity-100"
                    : "scale-[0.965] opacity-80",
                  plan.isRecommended
                    ? "border-[rgba(216,242,58,0.35)] bg-[var(--client-primary-dark)] text-white"
                    : "border-[var(--client-border)] bg-white"
                )}
              >
                {plan.isRecommended && (
                  <span className="rounded-full bg-[#d8f23a] px-3 py-1 text-xs font-black text-[#0a3f28]">
                    Mais popular
                  </span>
                )}
                <h3 className="mt-4 text-xl leading-6 font-black">
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-6 font-medium",
                    plan.isRecommended ? "text-white/70" : "text-[#6f8178]"
                  )}
                >
                  {plan.description}
                </p>
                <p className="mt-5 text-2xl font-black">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-bold opacity-70">/mes</span>
                </p>
                <div className="mt-5 grid gap-2">
                  {plan.benefits.map((benefit) => (
                    <p key={benefit} className="flex items-start gap-2 text-sm">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={16}
                        className={plan.isRecommended ? "text-[#d8f23a]" : ""}
                        aria-hidden
                      />
                      {benefit}
                    </p>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onSubscribe(plan)}
                  className={cn(
                    "mt-6 h-12 w-full text-sm",
                    plan.isRecommended
                      ? "client-button-lime"
                      : "client-button-dark"
                  )}
                >
                  Assinar
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  )
}

function PortalLoading() {
  return (
    <main className="min-h-dvh bg-[#f7faf6] text-[#0a3f28]">
      <div className="mx-auto grid min-h-dvh w-full max-w-[430px] place-items-center px-5">
        <article className="client-card text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#0a3f28] text-[#d8f23a]">
            <HugeiconsIcon icon={Calendar03Icon} size={25} aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl leading-7 font-black">
            Carregando portal
          </h1>
          <p className="mt-3 text-sm leading-6 font-semibold text-[#6f8178]">
            Preparando sua experiencia mobile.
          </p>
        </article>
      </div>
    </main>
  )
}

function PortalNotFound({ slug }: { slug: string }) {
  return (
    <main className="min-h-dvh bg-[#f7faf6] text-[#0a3f28]">
      <div className="mx-auto grid min-h-dvh w-full max-w-[430px] place-items-center px-5">
        <article className="client-card text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#0a3f28] text-[#d8f23a]">
            <HugeiconsIcon icon={Calendar03Icon} size={25} aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl leading-7 font-black">
            Nao conseguimos carregar este portal.
          </h1>
          <p className="mt-3 text-sm leading-6 font-semibold text-[#6f8178]">
            A barbearia &quot;{slug}&quot; nao foi encontrada ou o portal esta
            desativado.
          </p>
        </article>
      </div>
    </main>
  )
}

function PageFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="px-5 pt-7">
      <p className="text-[11px] font-black tracking-[0.08em] text-[#6f8178] uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl leading-7 font-black">{title}</h1>
      <p className="mt-2 text-sm leading-6 font-medium text-[#6f8178]">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <h2 className="text-[17px] leading-[22px] font-black">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-5 font-medium text-[#6f8178]">
          {description}
        </p>
      )}
    </div>
  )
}

function StatusPill({ status }: { status: AppointmentStatus }) {
  const tone = {
    confirmed: "bg-[rgba(216,242,58,0.16)] text-[#0a3f28]",
    pending: "bg-amber-100 text-amber-800",
    completed: "bg-slate-100 text-slate-700",
    cancelled: "bg-red-100 text-red-700",
  }[status]

  return (
    <span className={cn("rounded-full px-3 py-1 text-[11px] font-black", tone)}>
      {statusLabels[status]}
    </span>
  )
}

function InfoRow({
  icon,
  label,
}: {
  icon: typeof Calendar03Icon
  label: string
}) {
  return (
    <p className="flex min-w-0 items-center gap-2">
      <HugeiconsIcon icon={icon} size={16} aria-hidden />
      <span className="truncate">{label}</span>
    </p>
  )
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="rounded-[26px] border border-dashed border-[rgba(11,51,36,0.14)] bg-white p-5 text-center">
      <h3 className="text-base font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 font-medium text-[#6f8178]">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="client-button-lime mt-4 h-11 px-6 text-xs uppercase"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function ProfileGuestTab({
  onAuthClick,
}: {
  onAuthClick: () => void
}) {
  return (
    <PageFrame
      eyebrow="Minha conta"
      title="Perfil"
      description="Entre ou crie uma conta para gerenciar seus dados."
    >
      <div className="rounded-[28px] border border-[rgba(11,51,36,0.12)] bg-white p-6 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[rgba(11,51,36,0.06)] text-[#0a3f28]">
          <HugeiconsIcon icon={UserIcon} size={28} aria-hidden />
        </div>
        <h3 className="mt-4 text-lg font-black">Voce ainda nao entrou.</h3>
        <p className="mt-2 text-sm leading-6 font-medium text-[#6f8178]">
          Entre com sua conta para ver e editar seus dados pessoais,
          preferencias e historico.
        </p>
        <button
          type="button"
          onClick={onAuthClick}
          className="client-button-lime mt-6 h-14 w-full uppercase"
        >
          Entrar ou criar conta
        </button>
      </div>
    </PageFrame>
  )
}

function ClientField({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string
  value: string
  type?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2">
      <span className="px-1 text-xs font-black text-[#6f8178]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="client-input"
      />
    </label>
  )
}
