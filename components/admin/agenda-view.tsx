"use client"

import { type ReactNode, useMemo, useState } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Add01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  Clock01Icon,
  Delete02Icon,
  InformationCircleIcon,
  Store01Icon,
  UserAdd01Icon,
  UserSearch01Icon,
} from "@hugeicons/core-free-icons"

import { serviceNames } from "@/components/admin/catalog-data"
import { database } from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Barber = string
type EventType = "appointment" | "blocked" | "break" | "unavailable"
type RepeatMode = "today" | "automatic"

type AgendaEvent = {
  id: number
  barber: Barber
  date: string
  start: string
  end: string
  title: string
  detail: string
  type: EventType
}

type AgendaClient = {
  id: string
  name: string
  phone: string
  email?: string
  notes?: string
  lastVisit: string
}

type NewAgendaClient = {
  name: string
  phone: string
  email: string
  notes: string
}

const barbers: Barber[] = database.professionals
  .filter((professional) => professional.status === "Ativo")
  .map((professional) => professional.name)
const appointmentTypes = [
  "Agendamento",
  "Retorno",
  "Encaixe",
  "Intervalo",
  "Bloqueio",
]
const branches: string[] = []
const initialClients: AgendaClient[] = database.clients.map((client) => ({
  id: String(client.id),
  name: client.name,
  phone: client.phone,
  email: client.email,
  lastVisit: client.lastVisit,
}))
const services = serviceNames
const recentAppointments = database.agendaEvents
  .filter((event) => event.type === "appointment")
  .slice(0, 3)
  .map((event) => ({
    date: "29/04/2026",
    service: event.detail,
    professional: event.barber,
  }))
const repurchaseItems = database.services.map((service) => ({
  id: String(service.id),
  label: service.name,
  days: service.repurchaseDays,
}))
const weekdays = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sab" },
]
const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
]
const timeSlots = buildTimeSlots("09:00", "18:00", 10)
const slotHeight = 38

const initialEvents: AgendaEvent[] = database.agendaEvents

export function AgendaView() {
  const [selectedBarber, setSelectedBarber] = useState<Barber>(barbers[0] ?? "")
  const now = new Date()
  const [selectedDay, setSelectedDay] = useState(String(now.getDate()).padStart(2, "0"))
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const [events, setEvents] = useState(initialEvents)
  const [appointmentClients, setAppointmentClients] = useState(initialClients)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formAppointmentType, setFormAppointmentType] = useState("Agendamento")
  const [formStart, setFormStart] = useState("09:00")
  const [formEnd, setFormEnd] = useState("09:30")
  const [formClient, setFormClient] = useState("")
  const [formService, setFormService] = useState(serviceNames[0] ?? "")
  const [formAddedServices, setFormAddedServices] = useState<string[]>([])
  const [formBranch, setFormBranch] = useState((branches[0] ?? ""))
  const [formNoPreference, setFormNoPreference] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const [formRepeatMode, setFormRepeatMode] = useState<RepeatMode>("today")
  const [formRepeatDays, setFormRepeatDays] = useState<number[]>([
    1, 2, 3, 4, 5,
  ])
  const [formRepurchaseItem, setFormRepurchaseItem] = useState("none")

  const selectedDate = `${selectedYear}-${selectedMonth}-${selectedDay.padStart(2, "0")}`

  const dayEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.date === selectedDate && event.barber === selectedBarber
        )
        .sort((a, b) => a.start.localeCompare(b.start)),
    [events, selectedBarber, selectedDate]
  )

  function openNewAppointment(slot = "09:00", barber = selectedBarber) {
    setSelectedBarber(barber)
    setEditingId(null)
    setFormAppointmentType("Agendamento")
    setFormStart(slot)
    setFormEnd(nextSlot(slot))
    setFormClient("")
    setFormService(serviceNames[0] ?? "")
    setFormAddedServices([])
    setFormBranch((branches[0] ?? ""))
    setFormNoPreference(false)
    setBlockReason("")
    setFormRepeatMode("today")
    setFormRepeatDays([1, 2, 3, 4, 5])
    setFormRepurchaseItem("none")
    setModalOpen(true)
  }

  function openSlot(barber: Barber, slot: string) {
    setSelectedBarber(barber)
    const slotMinutes = timeToMinutes(slot)
    const event = events.find(
      (item) =>
        item.barber === barber &&
        item.date === selectedDate &&
        slotMinutes >= timeToMinutes(item.start) &&
        slotMinutes < timeToMinutes(item.end)
    )

    if (event) {
      setEditingId(event.id)
      setFormAppointmentType(
        event.type === "appointment"
          ? "Agendamento"
          : event.type === "break"
            ? "Intervalo"
            : "Bloqueio"
      )
      setFormStart(event.start)
      setFormEnd(event.end)
      setFormClient(event.type === "appointment" ? event.title : "")
      setFormService(
        event.type === "appointment" ? event.detail : (serviceNames[0] ?? "")
      )
      setFormAddedServices(event.type === "appointment" ? [event.detail] : [])
      setBlockReason(
        event.type !== "appointment" ? event.title : "Horario bloqueado"
      )
      setFormRepeatMode("today")
      setFormRepeatDays([1, 2, 3, 4, 5])
      setFormRepurchaseItem("none")
      setModalOpen(true)
      return
    }

    openNewAppointment(slot, barber)
  }

  function saveAppointment() {
    const title = formClient.trim() || "Cliente sem nome"
    const eventServices = formAddedServices.length
      ? formAddedServices.join(", ")
      : formService
    const baseId = editingId ?? Date.now()
    const nextEvent: AgendaEvent = {
      id: baseId,
      barber: selectedBarber,
      date: selectedDate,
      start: formStart,
      end: formEnd,
      title,
      detail: eventServices,
      type: "appointment",
    }
    const repurchase = repurchaseItems.find(
      (item) => item.id === formRepurchaseItem
    )
    const repurchaseEvent: AgendaEvent | null = repurchase
      ? {
          ...nextEvent,
          id: baseId + 1,
          date: toDateInputValue(
            addDays(parseLocalDate(selectedDate), repurchase.days)
          ),
          detail: `${repurchase.label} (recompra)`,
        }
      : null

    setEvents((current) =>
      editingId
        ? current.map((event) => (event.id === editingId ? nextEvent : event))
        : repurchaseEvent
          ? [...current, nextEvent, repurchaseEvent]
          : [...current, nextEvent]
    )
    setModalOpen(false)
  }

  function blockSelectedSlot() {
    const isInterval = formAppointmentType === "Intervalo"
    const title = isInterval
      ? "Intervalo"
      : blockReason.trim() || "Horario bloqueado"
    const type: EventType = isInterval ? "break" : "blocked"
    const detail = formRepeatMode === "automatic" ? "Automatico" : "Hoje"
    const baseEvent: AgendaEvent = {
      id: editingId ?? Date.now(),
      barber: selectedBarber,
      date: selectedDate,
      start: formStart,
      end: formEnd,
      title,
      detail,
      type,
    }
    const nextEvents =
      formRepeatMode === "automatic"
        ? buildRecurringEvents(baseEvent, formRepeatDays)
        : [baseEvent]

    setEvents((current) =>
      editingId
        ? current.map((event) => (event.id === editingId ? baseEvent : event))
        : [...current, ...nextEvents]
    )
    setModalOpen(false)
  }

  function removeSelectedEvent() {
    if (!editingId) return

    setEvents((current) => current.filter((event) => event.id !== editingId))
    setModalOpen(false)
  }

  function addSelectedService() {
    setFormAddedServices((current) =>
      current.includes(formService) ? current : [...current, formService]
    )
  }

  function removeAddedService(service: string) {
    setFormAddedServices((current) =>
      current.filter((item) => item !== service)
    )
  }

  function createClient(client: NewAgendaClient) {
    const nextClient: AgendaClient = {
      id: `${slugify(client.name)}-${Date.now()}`,
      name: client.name.trim(),
      phone: client.phone.trim(),
      email: client.email.trim() || undefined,
      notes: client.notes.trim() || undefined,
      lastVisit: "Novo cadastro",
    }

    setAppointmentClients((current) => [nextClient, ...current])
    setFormClient(nextClient.name)
  }

  function handleAppointmentTypeChange(type: string) {
    setFormAppointmentType(type)
    if (type === "Intervalo") {
      setBlockReason("Intervalo")
      setFormRepeatMode("automatic")
      return
    }

    if (type === "Bloqueio") {
      setBlockReason("Horario bloqueado")
      setFormRepeatMode("today")
    }
  }

  const router = useRouter()

  if (barbers.length === 0) {
    return (
      <EmptyState
        icon={UserAdd01Icon}
        title="Nenhum profissional cadastrado"
        description="A agenda precisa de pelo menos um profissional para funcionar. Cadastre sua equipe para começar."
        actionLabel="Cadastrar Profissional"
        onAction={() => router.push("/profissionais/cadastrar")}
      />
    )
  }

  return (
    <>
      <AgendaDayScreen
        selectedBarber={selectedBarber}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedDate={selectedDate}
        events={dayEvents}
        onBarberChange={setSelectedBarber}
        onDayChange={setSelectedDay}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onToday={() =>
          setDateFromObject(
            new Date(2026, 3, 29),
            setSelectedDay,
            setSelectedMonth,
            setSelectedYear
          )
        }
        onPreviousDay={() =>
          shiftDate(
            -1,
            selectedDate,
            setSelectedDay,
            setSelectedMonth,
            setSelectedYear
          )
        }
        onNextDay={() =>
          shiftDate(
            1,
            selectedDate,
            setSelectedDay,
            setSelectedMonth,
            setSelectedYear
          )
        }
        onNewAppointment={() => openNewAppointment(formStart, selectedBarber)}
        onOpenSlot={openSlot}
      />

      <ScheduleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={Boolean(editingId)}
        barber={selectedBarber}
        start={formStart}
        end={formEnd}
        client={formClient}
        clients={appointmentClients}
        service={formService}
        blockReason={blockReason}
        onStartChange={(slot) => {
          setFormStart(slot)
          setFormEnd(nextSlot(slot))
        }}
        onEndChange={setFormEnd}
        onClientChange={setFormClient}
        onCreateClient={createClient}
        onServiceChange={setFormService}
        onBlockReasonChange={setBlockReason}
        onSaveAppointment={saveAppointment}
        onBlock={blockSelectedSlot}
        onRemove={removeSelectedEvent}
        appointmentType={formAppointmentType}
        selectedDate={selectedDate}
        branch={formBranch}
        noPreference={formNoPreference}
        addedServices={formAddedServices}
        onBarberChange={setSelectedBarber}
        repeatMode={formRepeatMode}
        repeatDays={formRepeatDays}
        repurchaseItem={formRepurchaseItem}
        onAppointmentTypeChange={handleAppointmentTypeChange}
        onDateChange={(value) =>
          setDateFromObject(
            parseLocalDate(value),
            setSelectedDay,
            setSelectedMonth,
            setSelectedYear
          )
        }
        onBranchChange={setFormBranch}
        onNoPreferenceChange={setFormNoPreference}
        onRepeatModeChange={setFormRepeatMode}
        onRepeatDaysChange={setFormRepeatDays}
        onRepurchaseItemChange={setFormRepurchaseItem}
        onAddService={addSelectedService}
        onRemoveService={removeAddedService}
      />
    </>
  )
}

function AgendaDayScreen({
  selectedBarber,
  selectedDay,
  selectedMonth,
  selectedYear,
  selectedDate,
  events,
  onBarberChange,
  onDayChange,
  onMonthChange,
  onYearChange,
  onToday,
  onPreviousDay,
  onNextDay,
  onNewAppointment,
  onOpenSlot,
}: {
  selectedBarber: Barber
  selectedDay: string
  selectedMonth: string
  selectedYear: string
  selectedDate: string
  events: AgendaEvent[]
  onBarberChange: (barber: Barber) => void
  onDayChange: (day: string) => void
  onMonthChange: (month: string) => void
  onYearChange: (year: string) => void
  onToday: () => void
  onPreviousDay: () => void
  onNextDay: () => void
  onNewAppointment: () => void
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="border-b p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase sm:hidden">
              Agenda do dia
            </p>
            <h2 className="hidden text-lg font-semibold tracking-normal sm:block sm:text-xl">
              {formatDateLabel(selectedDate)}
            </h2>
            <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-normal sm:hidden">
              <span>{formatMobileDateLabel(selectedDate)}</span>
              <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {selectedYear}
              </span>
            </h2>
            <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">
              Horarios de 10 em 10 minutos para o barbeiro selecionado.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_2.5rem_2.5rem] gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onToday}
            >
              Hoje
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-full text-[0px] text-foreground"
              aria-label="Dia anterior"
              onClick={onPreviousDay}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />‹
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-full text-[0px] text-foreground"
              aria-label="Proximo dia"
              onClick={onNextDay}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />›
            </Button>
            <Button
              size="sm"
              className="col-span-3 w-full sm:col-span-1 sm:w-auto"
              onClick={onNewAppointment}
            >
              <HugeiconsIcon icon={Add01Icon} size={16} />
              Novo agendamento
            </Button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 rounded-lg border bg-muted/20 p-2 sm:mt-4 sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0 lg:grid-cols-[1fr_1fr]">
          <div className="grid gap-1">
            <span className="px-1 text-[11px] font-semibold text-muted-foreground uppercase sm:hidden">
              Barbeiro
            </span>
            <Select value={selectedBarber} onValueChange={onBarberChange}>
              <SelectTrigger className="h-11 bg-background sm:h-10">
                <SelectValue placeholder="Barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber} value={barber}>
                    {barber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <DateSelects
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onDayChange={onDayChange}
              onMonthChange={onMonthChange}
              onYearChange={onYearChange}
            />
          </div>
        </div>
      </div>

      <ScheduleBoard
        barber={selectedBarber}
        events={events}
        onOpenSlot={onOpenSlot}
      />
    </section>
  )
}

function DateSelects({
  selectedDay,
  selectedMonth,
  selectedYear,
  onDayChange,
  onMonthChange,
  onYearChange,
}: {
  selectedDay: string
  selectedMonth: string
  selectedYear: string
  onDayChange: (day: string) => void
  onMonthChange: (month: string) => void
  onYearChange: (year: string) => void
}) {
  return (
    <>
      <Select value={selectedDay} onValueChange={onDayChange}>
        <SelectTrigger className="h-11 bg-background text-center sm:h-10">
          <SelectValue placeholder="Dia" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 31 }, (_, index) => {
            const day = String(index + 1).padStart(2, "0")
            return (
              <SelectItem key={day} value={day}>
                Dia {day}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="h-11 bg-background text-center sm:h-10">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => {
            const value = String(index + 1).padStart(2, "0")
            return (
              <SelectItem key={month} value={value}>
                {month}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="h-11 bg-background text-center sm:h-10">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {["2026", "2027", "2028"].map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

function ScheduleBoard({
  barber,
  events,
  onOpenSlot,
}: {
  barber: Barber
  events: AgendaEvent[]
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  return (
    <div className="min-w-0 overflow-hidden bg-background">
      <div className="md:hidden">
        <MobileScheduleList
          barber={barber}
          events={events}
          onOpenSlot={onOpenSlot}
        />
      </div>

      <ScrollArea className="hidden h-[min(34rem,calc(100svh-18rem))] min-h-[24rem] w-full md:block">
        <div
          className="min-w-[560px]"
          style={{
            display: "grid",
            gridTemplateColumns: "4.25rem minmax(32rem, 1fr)",
          }}
        >
          <div className="border-r border-b bg-background" />
          <div className="border-b bg-background px-4 py-3" />
        </div>

        <div
          className="min-w-[560px]"
          style={{
            display: "grid",
            gridTemplateColumns: "4.25rem minmax(32rem, 1fr)",
          }}
        >
          <TimeRail />
          <BarberScheduleColumn
            barber={barber}
            events={events}
            onOpenSlot={onOpenSlot}
          />
        </div>
      </ScrollArea>
    </div>
  )
}

function MobileScheduleList({
  barber,
  events,
  onOpenSlot,
}: {
  barber: Barber
  events: AgendaEvent[]
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  const visibleSlots = timeSlots.filter((slot) => {
    const event = events.find((item) => isSlotInsideEvent(slot, item))

    return !event || event.start === slot
  })

  return (
    <ScrollArea className="h-[clamp(18rem,calc(100svh-21rem),36rem)]">
      <div className="space-y-2 bg-muted/15 p-2.5 sm:p-3">
        {visibleSlots.map((slot) => {
          const event = events.find((item) => isSlotInsideEvent(slot, item))
          const startsHere = event?.start === slot

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onOpenSlot(barber, slot)}
              className={cn(
                "grid w-full grid-cols-[3.5rem_minmax(0,1fr)] gap-2 rounded-lg border bg-card p-2 text-left shadow-xs transition-colors hover:bg-muted/50",
                event && "border-primary/20 bg-primary/5"
              )}
            >
              <span className="pt-2 text-sm font-semibold text-muted-foreground">
                {slot}
              </span>
              {event && startsHere ? (
                <AgendaEventCard event={event} />
              ) : (
                <span className="flex min-h-11 items-center rounded-md border border-dashed bg-background/70 px-3 text-sm text-muted-foreground">
                  Livre
                </span>
              )}
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}

function TimeRail() {
  return (
    <div className="border-r">
      {timeSlots.map((slot) => (
        <div
          key={slot}
          className="border-b px-2 pt-1 text-right text-xs text-muted-foreground"
          style={{ height: slotHeight }}
        >
          {slot}
        </div>
      ))}
    </div>
  )
}

function BarberScheduleColumn({
  barber,
  events,
  onOpenSlot,
}: {
  barber: Barber
  events: AgendaEvent[]
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  return (
    <div
      className="relative border-r last:border-r-0"
      style={{ height: timeSlots.length * slotHeight }}
    >
      {timeSlots.map((slot) => (
        <button
          key={slot}
          type="button"
          aria-label={`${barber} ${slot}`}
          onClick={() => onOpenSlot(barber, slot)}
          className="block w-full border-b transition-colors hover:bg-muted/50"
          style={{ height: slotHeight }}
        />
      ))}

      {events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() => onOpenSlot(barber, event.start)}
          className="absolute right-1 left-1 text-left"
          style={eventPosition(event)}
        >
          <AgendaEventCard event={event} />
        </button>
      ))}
    </div>
  )
}

function AgendaEventCard({ event }: { event: AgendaEvent }) {
  const tone = {
    appointment: "border-primary/40 bg-primary/15 text-foreground",
    blocked: "border-red-500/35 bg-red-500/15 text-red-950",
    break: "border-sky-500/35 bg-sky-500/15 text-sky-950",
    unavailable: "border-zinc-300 bg-zinc-200 text-zinc-700",
  }[event.type]
  const icon = {
    appointment: Calendar03Icon,
    blocked: AlertCircleIcon,
    break: Clock01Icon,
    unavailable: InformationCircleIcon,
  }[event.type]

  return (
    <span
      className={cn(
        "block h-full overflow-hidden rounded-md border px-3 py-2",
        tone
      )}
    >
      <span className="flex flex-col gap-1">
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <HugeiconsIcon icon={icon} size={14} />
            <span className="min-w-0 truncate">{event.title}</span>
          </span>
          <span
            className={cn(
              "block text-xs",
              event.type === "blocked"
                ? "text-red-950/75"
                : event.type === "break"
                  ? "text-sky-950/75"
                  : "text-muted-foreground"
            )}
          >
            {event.detail}
          </span>
        </span>
        <span className="inline-flex rounded-full border bg-background/70 px-2 py-1 text-xs font-medium">
          {event.start} - {event.end}
        </span>
      </span>
    </span>
  )
}

function ScheduleModal({
  open,
  onOpenChange,
  editing,
  barber,
  appointmentType,
  selectedDate,
  start,
  end,
  client,
  clients,
  service,
  branch,
  noPreference,
  blockReason,
  addedServices,
  repeatMode,
  repeatDays,
  repurchaseItem,
  onBarberChange,
  onAppointmentTypeChange,
  onDateChange,
  onStartChange,
  onEndChange,
  onClientChange,
  onCreateClient,
  onServiceChange,
  onBranchChange,
  onNoPreferenceChange,
  onBlockReasonChange,
  onRepeatModeChange,
  onRepeatDaysChange,
  onRepurchaseItemChange,
  onAddService,
  onRemoveService,
  onSaveAppointment,
  onBlock,
  onRemove,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: boolean
  barber: Barber
  appointmentType: string
  selectedDate: string
  start: string
  end: string
  client: string
  clients: AgendaClient[]
  service: string
  branch: string
  noPreference: boolean
  blockReason: string
  addedServices: string[]
  repeatMode: RepeatMode
  repeatDays: number[]
  repurchaseItem: string
  onBarberChange: (barber: Barber) => void
  onAppointmentTypeChange: (type: string) => void
  onDateChange: (date: string) => void
  onStartChange: (slot: string) => void
  onEndChange: (slot: string) => void
  onClientChange: (value: string) => void
  onCreateClient: (client: NewAgendaClient) => void
  onServiceChange: (value: string) => void
  onBranchChange: (branch: string) => void
  onNoPreferenceChange: (checked: boolean) => void
  onBlockReasonChange: (value: string) => void
  onRepeatModeChange: (mode: RepeatMode) => void
  onRepeatDaysChange: (days: number[]) => void
  onRepurchaseItemChange: (item: string) => void
  onAddService: () => void
  onRemoveService: (service: string) => void
  onSaveAppointment: () => void
  onBlock: () => void
  onRemove: () => void
}) {
  const isIntervalType = appointmentType === "Intervalo"
  const isBlockType = appointmentType === "Bloqueio"
  const isRestrictionType = isBlockType || isIntervalType
  const [step, setStep] = useState(0)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [newClientNotes, setNewClientNotes] = useState("")
  const steps = isRestrictionType
    ? [
        "Dados",
        "Periodo",
        isIntervalType ? "Intervalo" : "Bloqueio",
        "Confirmar",
      ]
    : ["Dados", "Cliente", "Servicos", "Confirmar"]
  const lastStep = steps.length - 1
  const selectedClient = clients.find((item) => item.name === client)

  function goNext() {
    setStep((current) => Math.min(current + 1, lastStep))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function finishSchedule() {
    setStep(0)
    if (isRestrictionType) {
      onBlock()
      return
    }

    onSaveAppointment()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setStep(0)
    onOpenChange(nextOpen)
  }

  function openNewClientRegistration() {
    onOpenChange(true)
    setNewClientOpen(true)
  }

  function returnToScheduleModal() {
    setNewClientOpen(false)
    onOpenChange(true)
  }

  function saveNewClient() {
    const name = newClientName.trim()

    if (!name) return

    onCreateClient({
      name,
      phone: newClientPhone,
      email: newClientEmail,
      notes: newClientNotes,
    })
    setNewClientName("")
    setNewClientPhone("")
    setNewClientEmail("")
    setNewClientNotes("")
    returnToScheduleModal()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="grid grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] sm:h-[min(42rem,calc(100dvh-1rem))] sm:max-w-3xl">
          <DialogHeader className="flex-row items-start justify-between gap-2 border-b-0 p-3 pb-2 sm:gap-3 sm:border-b sm:p-4">
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2 text-[17px] leading-tight sm:text-lg">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary sm:size-auto sm:bg-transparent sm:text-foreground">
                  <HugeiconsIcon icon={Calendar03Icon} size={17} />
                </span>
                {editing ? "Editar agendamento" : "Novo agendamento"}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2 text-xs leading-snug sm:block sm:text-sm">
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground sm:bg-transparent sm:px-0 sm:py-0 sm:font-normal">
                  {step + 1}/{steps.length}
                </span>
                <span>{steps[step]}</span>
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                className="rounded-full"
                aria-label="Fechar modal"
              >
                <span className="sr-only">Fechar</span>
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="px-3 pt-0 pb-2 sm:border-b sm:px-4 sm:py-2">
            <ModalStepper steps={steps} currentStep={step} />
          </div>

          <ScrollArea className="h-full min-h-0">
            <div className="min-h-0 space-y-3 px-3 pt-1 pb-3 sm:space-y-4 sm:p-4">
              {step === 0 ? (
                <>
                  <div className="grid gap-2.5 sm:gap-3">
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required icon={Calendar03Icon}>
                        Tipo de agendamento
                      </FieldLabel>
                      <Select
                        value={appointmentType}
                        onValueChange={onAppointmentTypeChange}
                      >
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Tipo de agendamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {appointmentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {!isRestrictionType ? (
                      <div className="grid grid-cols-[minmax(0,1fr)_2.75rem] gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                        <div className="grid gap-1 sm:gap-1.5">
                          <FieldLabel required icon={UserSearch01Icon}>
                            Cliente
                          </FieldLabel>
                          <Select value={client} onValueChange={onClientChange}>
                            <SelectTrigger className="h-12 scroll-mt-28 items-center text-left text-sm sm:h-10 [&>span]:min-w-0 [&>span]:flex-1">
                              {selectedClient ? (
                                <span className="flex min-w-0 flex-col leading-tight sm:block">
                                  <span className="truncate font-medium">
                                    {selectedClient.name}
                                  </span>
                                  <span className="truncate text-[11px] text-muted-foreground sm:hidden">
                                    {selectedClient.phone} - ultima visita:{" "}
                                    {selectedClient.lastVisit}
                                  </span>
                                </span>
                              ) : (
                                <SelectValue placeholder="Selecionar cliente" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((item) => (
                                <SelectItem key={item.id} value={item.name}>
                                  <span className="flex min-w-0 flex-col gap-0.5">
                                    <span className="truncate font-medium">
                                      {item.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                      {item.phone} - ultima visita:{" "}
                                      {item.lastVisit}
                                    </span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="mt-5 size-9 sm:mt-0 sm:h-9 sm:w-auto sm:px-3"
                          aria-label="Novo cliente"
                          onClick={openNewClientRegistration}
                        >
                          <HugeiconsIcon icon={UserAdd01Icon} size={16} />
                          <span className="hidden sm:inline">Novo cliente</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                        Defina data, horario e profissional para aplicar esta
                        regra na agenda.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
                    <div className="col-span-2 grid gap-1 sm:col-span-1 sm:gap-1.5">
                      <FieldLabel required icon={Calendar03Icon}>
                        Data
                      </FieldLabel>
                      <CalendarDatePicker
                        value={selectedDate}
                        onChange={onDateChange}
                      />
                    </div>
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required icon={Clock01Icon}>
                        Inicio
                      </FieldLabel>
                      <Select value={start} onValueChange={onStartChange}>
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Inicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required icon={Clock01Icon}>
                        Fim
                      </FieldLabel>
                      <Select value={end} onValueChange={onEndChange}>
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Fim" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                          <SelectItem value="19:10">19:10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
<div className="col-span-2 grid gap-1 sm:col-span-1 sm:gap-1.5">
                      <FieldLabel required icon={Store01Icon}>
                        Filial
                      </FieldLabel>
                      {branches.length === 0 ? (
                        <div className="flex h-9 items-center rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground sm:h-10">
                          Nenhuma filial cadastrada
                        </div>
                      ) : (
                        <Select value={branch} onValueChange={onBranchChange}>
                          <SelectTrigger className="h-9 text-sm sm:h-10">
                            <SelectValue placeholder="Filial" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2.5 sm:gap-3">
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required icon={UserSearch01Icon}>
                        Profissional
                      </FieldLabel>
                      <Select
                        value={barber}
                        onValueChange={(value) =>
                          onBarberChange(value as Barber)
                        }
                        disabled={noPreference}
                      >
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          {barbers.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <label className="flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
                      <input
                        type="checkbox"
                        checked={noPreference}
                        onChange={(event) =>
                          onNoPreferenceChange(event.target.checked)
                        }
                        className="size-4 rounded border accent-primary"
                      />
                      Sem preferencia por profissional
                    </label>
                  </div>
                </>
              ) : null}

              {step === 2 && isRestrictionType ? (
                <div className="grid gap-3">
                  {isBlockType ? (
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required icon={AlertCircleIcon}>
                        Motivo do bloqueio
                      </FieldLabel>
                      <Input
                        className="h-9 scroll-mt-28 text-sm sm:h-10"
                        value={blockReason}
                        onChange={(event) =>
                          onBlockReasonChange(event.target.value)
                        }
                        placeholder="Compromisso, manutencao, fechamento..."
                        inputMode="text"
                        enterKeyHint="done"
                      />
                    </div>
                  ) : (
                    <div className="rounded-md border bg-sky-500/10 p-3 text-sm text-sky-950">
                      O intervalo sera exibido como <strong>Intervalo</strong>{" "}
                      na agenda.
                    </div>
                  )}

                  <div className="grid gap-1.5">
                    <FieldLabel required icon={Clock01Icon}>
                      Aplicacao
                    </FieldLabel>
                    <Select
                      value={repeatMode}
                      onValueChange={(value) =>
                        onRepeatModeChange(value as RepeatMode)
                      }
                      disabled={isIntervalType}
                    >
                      <SelectTrigger className="h-9 text-sm sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Somente neste dia</SelectItem>
                        <SelectItem value="automatic">
                          Automatico por dias da semana
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {repeatMode === "automatic" ? (
                    <div className="grid gap-1.5">
                      <FieldLabel required icon={Calendar03Icon}>
                        Dias da semana
                      </FieldLabel>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                        {weekdays.map((day) => {
                          const selected = repeatDays.includes(day.value)

                          return (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() =>
                                onRepeatDaysChange(
                                  selected
                                    ? repeatDays.filter(
                                        (value) => value !== day.value
                                      )
                                    : [...repeatDays, day.value].sort()
                                )
                              }
                              className={cn(
                                "h-9 rounded-md border text-xs font-medium transition-colors",
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "bg-background text-muted-foreground hover:bg-muted"
                              )}
                            >
                              {day.label}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        O sistema cria a recorrencia para as proximas 8 semanas.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step === 1 ? (
                <>
                  {isRestrictionType ? (
                    <div className="grid gap-3">
                      <div className="rounded-md border bg-muted/30 p-3">
                        <p className="text-sm font-semibold">
                          {isIntervalType
                            ? "Intervalo automatico"
                            : "Bloqueio de horario"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatShortDate(selectedDate)} das {start} ate {end},
                          com {noPreference ? "qualquer profissional" : barber}.
                        </p>
                      </div>
                      <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
                        No proximo passo voce escolhe se a regra vale so neste
                        dia ou se repete por dias da semana.
                      </div>
                    </div>
                  ) : (
                    <>
                      <InfoBlock
                        title="Ultimos 3 agendamentos"
                        icon={InformationCircleIcon}
                      >
                        {client.trim() ? (
                          <div className="grid gap-2">
                            {recentAppointments.map((item) => (
                              <div
                                key={`${item.date}-${item.service}`}
                                className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-xs"
                              >
                                <span className="min-w-0">
                                  <span className="block font-medium">
                                    {item.service}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {item.date} com {item.professional}
                                  </span>
                                </span>
                                <HugeiconsIcon
                                  icon={Calendar03Icon}
                                  size={16}
                                  className="shrink-0 text-muted-foreground"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyState
                            icon={InformationCircleIcon}
                            title="Nenhum cliente selecionado"
                            description="Selecione ou digite um cliente para ver os registros."
                            className="min-h-40"
                          />
                        )}
                      </InfoBlock>

                      <InfoBlock
                        title="Itens para recompra"
                        icon={InformationCircleIcon}
                      >
                        {client.trim() ? (
                          <div className="flex flex-wrap gap-2">
                            {repurchaseItems.map((item) => (
                              <span
                                key={item.id}
                                className="rounded-full border bg-background px-3 py-1 text-xs font-medium"
                              >
                                {item.label} em {item.days} dias
                              </span>
                            ))}
                          </div>
                        ) : (
                          <EmptyState
                            icon={InformationCircleIcon}
                            title="Sem recompras"
                            description="Cliente nao possui itens para recompra."
                            className="min-h-40"
                          />
                        )}
                      </InfoBlock>
                    </>
                  )}
                </>
              ) : null}

              {step === 2 && !isRestrictionType ? (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold">Servicos</h3>
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2.25rem] gap-2 sm:grid-cols-[minmax(0,1fr)_2.5rem]">
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required>Adicionar servico</FieldLabel>
                      <Select value={service} onValueChange={onServiceChange}>
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Selecionar servico" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="mt-5 size-9 sm:mt-6 sm:w-10"
                      aria-label="Adicionar servico"
                      onClick={onAddService}
                    >
                      <HugeiconsIcon icon={Add01Icon} size={18} />
                    </Button>
                  </div>

                  <div className="mt-3 min-h-14 rounded-md border border-dashed bg-muted/30 p-2">
                    {addedServices.length ? (
                      <div className="grid gap-2">
                        {addedServices.map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2 text-sm"
                          >
                            <span>{item}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Remover ${item}`}
                              onClick={() => onRemoveService(item)}
                            >
                              <HugeiconsIcon icon={Delete02Icon} size={15} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={InformationCircleIcon}
                        title="Lista vazia"
                        description="Nenhum servico adicionado."
                        className="min-h-32"
                      />
                    )}
                  </div>

                  <div className="mt-3 grid gap-1.5 rounded-md border bg-muted/25 p-3">
                    <FieldLabel icon={Calendar03Icon}>
                      Recompra/retorno automatico
                    </FieldLabel>
                    <Select
                      value={repurchaseItem}
                      onValueChange={onRepurchaseItemChange}
                    >
                      <SelectTrigger className="h-9 text-sm sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nao gerar retorno</SelectItem>
                        {repurchaseItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label} - voltar em {item.days} dias
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Ao concluir, a agenda recebe um proximo atendimento na
                      data sugerida.
                    </p>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="rounded-lg border bg-card p-2.5 sm:rounded-md sm:bg-muted/30 sm:p-3">
                    <h3 className="flex items-center gap-2 text-[13px] font-semibold sm:text-sm">
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <HugeiconsIcon icon={Calendar03Icon} size={15} />
                      </span>
                      Resumo
                    </h3>
                    <div className="mt-2 grid gap-1.5 text-sm sm:mt-3 sm:gap-2">
                      <SummaryRow label="Tipo" value={appointmentType} />
                      <SummaryRow
                        label="Cliente"
                        value={client || "Cliente nao selecionado"}
                      />
                      <SummaryRow
                        label="Data"
                        value={formatShortDate(selectedDate)}
                      />
                      <SummaryRow label="Horario" value={`${start} - ${end}`} />
                      <SummaryRow label="Filial" value={branch} />
                      <SummaryRow
                        label="Profissional"
                        value={noPreference ? "Sem preferencia" : barber}
                      />
                      <SummaryRow
                        label={isBlockType ? "Motivo" : "Servicos"}
                        value={
                          isBlockType
                            ? blockReason
                            : isIntervalType
                              ? "Intervalo automatico"
                              : addedServices.length
                                ? addedServices.join(", ")
                                : service
                        }
                      />
                      {repurchaseItem !== "none" && !isRestrictionType ? (
                        <SummaryRow
                          label="Retorno"
                          value={
                            repurchaseItems.find(
                              (item) => item.id === repurchaseItem
                            )?.label ?? "Recompra"
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-xs leading-snug text-foreground sm:rounded-md sm:p-3">
                    Revise os dados antes de concluir. Voce pode voltar e
                    ajustar qualquer etapa.
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t bg-background p-3 sm:justify-between sm:p-4">
            <div className="w-full sm:w-auto">
              {editing ? (
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={() => {
                    setStep(0)
                    onRemove()
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                  Desbloquear/remover
                </Button>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <div
                className={cn(
                  "grid gap-2 sm:contents",
                  step > 0 ? "grid-cols-2" : "grid-cols-1"
                )}
              >
                <DialogClose asChild>
                  <Button className="w-full sm:w-auto" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                {step > 0 ? (
                  <Button
                    className="w-full sm:w-auto"
                    variant="outline"
                    onClick={goBack}
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                    Voltar
                  </Button>
                ) : null}
              </div>
              {step < lastStep ? (
                <Button className="h-10 w-full sm:w-auto" onClick={goNext}>
                  Proximo
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Button>
              ) : (
                <Button
                  className="h-10 w-full sm:w-auto"
                  onClick={finishSchedule}
                >
                  <HugeiconsIcon
                    icon={isRestrictionType ? AlertCircleIcon : Calendar03Icon}
                    size={16}
                  />
                  {isRestrictionType
                    ? isIntervalType
                      ? "Concluir intervalo"
                      : "Concluir bloqueio"
                    : editing
                      ? "Salvar agendamento"
                      : "Concluir agendamento"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={newClientOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            openNewClientRegistration()
            return
          }

          returnToScheduleModal()
        }}
      >
        <DialogContent className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:h-[min(34rem,calc(100dvh-1rem))] sm:max-w-md">
          <DialogHeader className="flex-row items-start justify-between gap-3 border-b p-3 sm:p-4">
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2 text-base">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <HugeiconsIcon icon={UserAdd01Icon} size={16} />
                </span>
                Novo cliente
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs sm:text-sm">
                Cadastro rapido para usar neste agendamento.
              </DialogDescription>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="rounded-full"
              aria-label="Voltar ao agendamento"
              onClick={returnToScheduleModal}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </DialogHeader>

          <ScrollArea className="h-full min-h-0">
            <div className="grid gap-3 p-3 sm:p-4">
              <div className="grid gap-1.5">
                <FieldLabel required icon={UserSearch01Icon}>
                  Nome
                </FieldLabel>
                <Input
                  value={newClientName}
                  onChange={(event) => setNewClientName(event.target.value)}
                  placeholder="Ex.: Joao Pereira"
                  autoFocus
                  enterKeyHint="next"
                  className="scroll-mt-28"
                />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel icon={Calendar03Icon}>Telefone</FieldLabel>
                <Input
                  value={newClientPhone}
                  onChange={(event) => setNewClientPhone(event.target.value)}
                  placeholder="(11) 90000-0000"
                  inputMode="tel"
                  enterKeyHint="next"
                  className="scroll-mt-28"
                />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel>E-mail</FieldLabel>
                <Input
                  value={newClientEmail}
                  onChange={(event) => setNewClientEmail(event.target.value)}
                  placeholder="cliente@email.com"
                  type="email"
                  inputMode="email"
                  enterKeyHint="next"
                  className="scroll-mt-28"
                />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel>Observacao</FieldLabel>
                <Input
                  value={newClientNotes}
                  onChange={(event) => setNewClientNotes(event.target.value)}
                  placeholder="Preferencias, alergias, observacoes..."
                  enterKeyHint="done"
                  className="scroll-mt-28"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-background/95 p-3 sm:flex sm:p-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              onClick={returnToScheduleModal}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Voltar
            </Button>
            <Button
              type="button"
              className="h-11 w-full sm:w-auto"
              disabled={!newClientName.trim()}
              onClick={saveNewClient}
            >
              Salvar cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ModalStepper({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {steps.map((item, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep

        return (
          <div key={item} className="min-w-0">
            <div
              className={cn(
                "h-1 rounded-full bg-muted",
                (isActive || isDone) && "bg-primary"
              )}
            />
            <p
              className={cn(
                "mt-1 hidden truncate text-[11px] font-medium text-muted-foreground sm:block",
                isActive && "text-foreground"
              )}
            >
              {item}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-2 rounded-md bg-muted/40 px-2.5 py-2 text-xs sm:flex sm:justify-between sm:bg-background sm:px-3 sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right leading-snug font-medium sm:max-w-[65%]">
        {value}
      </span>
    </div>
  )
}

function FieldLabel({
  children,
  icon,
  required,
}: {
  children: ReactNode
  icon?: IconSvgElement
  required?: boolean
}) {
  return (
    <Label className="flex items-center gap-1 text-[11px] font-medium sm:gap-1.5 sm:text-xs">
      {icon ? (
        <HugeiconsIcon
          icon={icon}
          size={13}
          className="text-muted-foreground"
        />
      ) : null}
      <span>{children}</span>
      {required ? <span className="text-destructive">*</span> : null}
    </Label>
  )
}

function InfoBlock({
  title,
  icon,
  children,
}: {
  title: string
  icon: IconSvgElement
  children: ReactNode
}) {
  return (
    <section className="border-t pt-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <HugeiconsIcon
          icon={icon}
          size={16}
          className="text-muted-foreground"
        />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function CalendarDatePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const selectedDate = parseLocalDate(value)
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  )

  const days = useMemo(() => getCalendarDays(viewDate), [viewDate])
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(viewDate)

  function shiftMonth(amount: number) {
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    )
  }

  function selectDate(date: Date) {
    onChange(toDateInputValue(date))
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 w-full justify-between rounded-md px-2.5 text-sm font-normal sm:h-10 sm:px-3"
        >
          <span className="flex min-w-0 items-center gap-2">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={16}
              className="text-muted-foreground"
            />
            <span className="truncate">{formatShortDate(value)}</span>
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            className="text-muted-foreground"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(19rem,calc(100vw-1.5rem))]">
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Mes anterior"
            onClick={() => shiftMonth(-1)}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </Button>
          <div className="text-sm font-semibold capitalize">{monthLabel}</div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Proximo mes"
            onClick={() => shiftMonth(1)}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
            <span key={`${day}-${index}`} className="py-1">
              {day}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((date) => {
            const dateValue = toDateInputValue(date)
            const isSelected = dateValue === value
            const isOutside = date.getMonth() !== viewDate.getMonth()

            return (
              <button
                key={dateValue}
                type="button"
                onClick={() => selectDate(date)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  isOutside && "text-muted-foreground/50",
                  isSelected &&
                    "bg-primary font-semibold text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyScheduleModal({
  editing,
  barber,
  start,
  end,
  client,
  service,
  blockReason,
  onStartChange,
  onEndChange,
  onClientChange,
  onServiceChange,
  onBlockReasonChange,
  onClose,
  onSaveAppointment,
  onBlock,
  onRemove,
}: {
  editing: boolean
  barber: Barber
  start: string
  end: string
  client: string
  service: string
  blockReason: string
  onStartChange: (slot: string) => void
  onEndChange: (slot: string) => void
  onClientChange: (value: string) => void
  onServiceChange: (value: string) => void
  onBlockReasonChange: (value: string) => void
  onClose: () => void
  onSaveAppointment: () => void
  onBlock: () => void
  onRemove: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-lg border bg-background shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">
              {editing ? "Editar horario" : "Novo agendamento"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {barber} · agende, bloqueie ou desbloqueie este horario.
            </p>
          </div>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </Button>
        </div>

        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Inicio
              <select
                value={start}
                onChange={(event) => onStartChange(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Fim
              <select
                value={end}
                onChange={(event) => onEndChange(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
                <option>19:10</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Cliente
              <input
                value={client}
                onChange={(event) => onClientChange(event.target.value)}
                placeholder="Nome do cliente"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Servico
              <select
                value={service}
                onChange={(event) => onServiceChange(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              >
                {services.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-sm font-medium">
            Motivo do bloqueio
            <input
              value={blockReason}
              onChange={(event) => onBlockReasonChange(event.target.value)}
              placeholder="Almoco, pausa, compromisso..."
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-between">
          <div>
            {editing ? (
              <Button variant="outline" onClick={onRemove}>
                Desbloquear/remover
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={onBlock}>
              Bloquear horario
            </Button>
            <Button onClick={onSaveAppointment}>
              {editing ? "Salvar agendamento" : "Agendar cliente"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function eventPosition(event: AgendaEvent) {
  const dayStart = timeToMinutes(timeSlots[0])
  const start = timeToMinutes(event.start)
  const end = timeToMinutes(event.end)
  const top = ((start - dayStart) / 10) * slotHeight + 3
  const height = Math.max(((end - start) / 10) * slotHeight - 6, slotHeight - 6)

  return {
    top,
    height,
  }
}

function isSlotInsideEvent(slot: string, event: AgendaEvent) {
  const slotMinutes = timeToMinutes(slot)

  return (
    slotMinutes >= timeToMinutes(event.start) &&
    slotMinutes < timeToMinutes(event.end)
  )
}

function formatDateLabel(dateValue: string) {
  const date = parseLocalDate(dateValue)

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function formatMobileDateLabel(dateValue: string) {
  const date = parseLocalDate(dateValue)

  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "")
}

function formatShortDate(dateValue: string) {
  const date = parseLocalDate(dateValue)

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function buildRecurringEvents(
  baseEvent: AgendaEvent,
  selectedWeekdays: number[]
) {
  const startDate = parseLocalDate(baseEvent.date)
  const recurrenceDays = selectedWeekdays.length
    ? selectedWeekdays
    : [startDate.getDay()]

  return Array.from({ length: 56 }, (_, index) => addDays(startDate, index))
    .filter((date) => recurrenceDays.includes(date.getDay()))
    .map((date, index) => ({
      ...baseEvent,
      id: baseEvent.id + index,
      date: toDateInputValue(date),
    }))
}

function getCalendarDays(viewDate: Date) {
  const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
  const firstDayOffset = start.getDay()
  const totalDays = firstDayOffset + end.getDate()
  const trailingDays = (7 - (totalDays % 7)) % 7
  const calendarStart = new Date(start)
  calendarStart.setDate(start.getDate() - firstDayOffset)

  return Array.from(
    { length: totalDays + trailingDays },
    (_, index) =>
      new Date(
        calendarStart.getFullYear(),
        calendarStart.getMonth(),
        calendarStart.getDate() + index
      )
  )
}

function shiftDate(
  amount: number,
  dateValue: string,
  setDay: (day: string) => void,
  setMonth: (month: string) => void,
  setYear: (year: string) => void
) {
  const date = parseLocalDate(dateValue)
  date.setDate(date.getDate() + amount)
  setDateFromObject(date, setDay, setMonth, setYear)
}

function setDateFromObject(
  date: Date,
  setDay: (day: string) => void,
  setMonth: (month: string) => void,
  setYear: (year: string) => void
) {
  setDay(String(date.getDate()).padStart(2, "0"))
  setMonth(String(date.getMonth() + 1).padStart(2, "0"))
  setYear(String(date.getFullYear()))
}

function parseLocalDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function buildTimeSlots(start: string, end: string, stepMinutes: number) {
  const slots: string[] = []
  let cursor = timeToMinutes(start)
  const limit = timeToMinutes(end)

  while (cursor <= limit) {
    slots.push(minutesToTime(cursor))
    cursor += stepMinutes
  }

  return slots
}

function nextSlot(slot: string) {
  const index = timeSlots.indexOf(slot)
  return timeSlots[index + 1] ?? "19:10"
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return hours * 60 + minutes
}

function minutesToTime(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
