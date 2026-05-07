"use client"

import { useMemo, useState } from "react"
import { Invoice03Icon, PlusSignCircleIcon, UserMultipleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database, type Subscription } from "@/components/admin/database"
import {
  getStoredCommercialPlans,
  getStoredCommercialSubscriptions,
  saveCommercialSubscriptions,
} from "@/components/company/commercial-storage"
import {
  formatDateForDisplay,
  toDateInputValue,
} from "@/components/admin/date-utils"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialSubscriptions: Subscription[] = database.subscriptions

const subscriptionClientOptions = Array.from(
  new Set([
    ...database.clients.map((client) => client.name),
    ...initialSubscriptions.map((subscription) => subscription.client),
  ])
)

export default function GerenciarAssinaturasPage() {
  const [items, setItems] = useState(() =>
    getStoredCommercialSubscriptions(initialSubscriptions)
  )
  const [plans] = useState(() => getStoredCommercialPlans(database.plans))
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("todas")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [draft, setDraft] = useState<Subscription>(createEmptySubscription())
  const [feedback, setFeedback] = useState("Nenhuma alteração nesta sessão.")

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items.filter((item) => {
      const matchesFilter =
        filter === "todas" ||
        (filter === "ativas" && item.status === "Ativa") ||
        (filter === "proximas" && item.status === "Renovacao proxima") ||
        (filter === "pausadas" && item.status === "Pausada") ||
        (filter === "atrasadas" && item.status === "Em atraso")
      const matchesQuery =
        !normalizedQuery ||
        item.client.toLowerCase().includes(normalizedQuery) ||
        item.plan.toLowerCase().includes(normalizedQuery) ||
        item.status.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [filter, items, query])

  const recurringTotal = filteredItems.reduce(
    (sum, item) => sum + item.value,
    0
  )

  function openCreate() {
    setEditing(null)
    setDraft(createEmptySubscription())
    setModalOpen(true)
  }

  function openEdit(subscription: Subscription) {
    setEditing(subscription)
    setDraft({
      ...subscription,
      nextCharge: toDateInputValue(subscription.nextCharge),
    })
    setModalOpen(true)
  }

  function saveSubscription() {
    if (!draft.client.trim()) return
    const savedDraft = {
      ...draft,
      nextCharge: formatDateForDisplay(draft.nextCharge),
    }

    setItems((current) => {
      const nextItems = editing
        ? current.map((item) => (item.id === draft.id ? savedDraft : item))
        : [{ ...savedDraft, id: Date.now() }, ...current]
      saveCommercialSubscriptions(nextItems)
      return nextItems
    })
    setFeedback(
      editing
        ? `Assinatura de ${draft.client} atualizada.`
        : `Assinatura de ${draft.client} criada.`
    )
    setModalOpen(false)
  }

  function togglePause(subscription: Subscription) {
    const nextStatus: Subscription["status"] =
      subscription.status === "Pausada" ? "Ativa" : "Pausada"

    setItems((current) => {
      const nextItems = current.map((item) =>
        item.id === subscription.id ? { ...item, status: nextStatus } : item
      )
      saveCommercialSubscriptions(nextItems)
      return nextItems
    })
    setFeedback(`${subscription.client}: status alterado para ${nextStatus}.`)
  }

  function updateDraft<Key extends keyof Subscription>(
    key: Key,
    value: Subscription[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function updateClient(clientName: string) {
    const client = database.clients.find((item) => item.name === clientName)

    setDraft((current) => ({
      ...current,
      client: clientName,
      clientId: client?.id ?? current.clientId,
      phone: client?.phone ?? current.phone,
    }))
  }

  function updatePlan(planName: string) {
    const plan = plans.find((item) => item.name === planName)

    setDraft((current) => ({
      ...current,
      plan: planName,
      value: plan?.price ?? current.value,
    }))
  }

  return (
    <>
      <SectionCard
        title="Gerenciar assinaturas"
        description="Acompanhe contratos ativos, vencimentos e renovações"
        action={
          <Button size="sm" onClick={openCreate}>
            <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
            Nova assinatura
          </Button>
        }
      >
        <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem]">
          <Input
            value={query}
            placeholder="Buscar cliente, plano ou status"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="ativas">Ativas</SelectItem>
              <SelectItem value="proximas">Renovacao proxima</SelectItem>
              <SelectItem value="pausadas">Pausadas</SelectItem>
              <SelectItem value="atrasadas">Em atraso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={UserMultipleIcon}
            title="Nenhuma assinatura ativa"
            description="Você ainda não possui clientes assinantes. Comece criando uma assinatura para um cliente."
            actionLabel="Nova assinatura"
            onAction={openCreate}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={UserMultipleIcon}
            title="Nenhum assinante encontrado"
            description="Não encontramos nenhuma assinatura que corresponda aos filtros aplicados."
            actionLabel="Limpar busca"
            onAction={() => {
              setQuery("")
              setFilter("todas")
            }}
          />
        ) : (
          <SimpleTable
            columns={[
              "Cliente",
              "Plano",
              "Valor",
              "Próxima cobrança",
              "Status",
              "Ações",
            ]}
            rows={filteredItems.map((subscription) => [
              subscription.client,
              subscription.plan,
              formatCurrency(subscription.value),
              subscription.nextCharge,
              <StatusBadge key="status" tone={getStatusTone(subscription.status)}>
                {subscription.status}
              </StatusBadge>,
              <div key="actions" className="flex flex-wrap gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => openEdit(subscription)}
                >
                  Editar
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => togglePause(subscription)}
                >
                  {subscription.status === "Pausada" ? "Reativar" : "Pausar"}
                </Button>
              </div>,
            ])}
          />
        )}

        <div className="mt-4 flex flex-col gap-2 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <HugeiconsIcon icon={Invoice03Icon} size={16} />
            Total recorrente filtrado: {formatCurrency(recurringTotal)}
          </span>
          <span>{feedback}</span>
        </div>
      </SectionCard>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar assinatura" : "Nova assinatura"}
            </DialogTitle>
            <DialogDescription>
              Defina cliente, plano, valor e próxima cobrança.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 md:grid-cols-2">
            <Field label="Cliente">
              <Select value={draft.client} onValueChange={updateClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionClientOptions.map((clientName) => (
                    <SelectItem key={clientName} value={clientName}>
                      {clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Plano">
              <Select value={draft.plan} onValueChange={updatePlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.name} value={plan.name}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Valor">
              <Input
                value={String(draft.value)}
                inputMode="decimal"
                onChange={(event) =>
                  updateDraft("value", Number(event.target.value) || 0)
                }
              />
            </Field>
            <Field label="Próxima cobrança">
              <Input
                type="date"
                value={draft.nextCharge}
                onChange={(event) =>
                  updateDraft("nextCharge", event.target.value)
                }
              />
            </Field>
            <Field label="Status">
              <Select
                value={draft.status}
                onValueChange={(value) =>
                  updateDraft("status", value as Subscription["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Renovacao proxima">
                    Renovacao proxima
                  </SelectItem>
                  <SelectItem value="Pausada">Pausada</SelectItem>
                  <SelectItem value="Em atraso">Em atraso</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveSubscription}>
              {editing ? "Salvar alterações" : "Criar assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function createEmptySubscription(): Subscription {
  return {
    id: 0,
    clientId: database.clients[0]?.id ?? 0,
    client: database.clients[0]?.name ?? "",
    phone: database.clients[0]?.phone ?? "",
    plan: database.plans[0]?.name ?? "",
    value: database.plans[0]?.price ?? 0,
    nextCharge: "2026-05-29",
    startedAt: "29/04/2026",
    status: "Ativa",
  }
}

function getStatusTone(status: Subscription["status"]) {
  if (status === "Ativa") return "green"
  if (status === "Renovacao proxima") return "amber"
  if (status === "Em atraso") return "red"
  return "neutral"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
