"use client"

import { useMemo, useState } from "react"
import { Invoice03Icon, PlusSignCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
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

type SubscriptionStatus = "Ativa" | "Renovação próxima" | "Pausada"

type Subscription = {
  id: number
  client: string
  plan: string
  value: number
  nextCharge: string
  status: SubscriptionStatus
}

const initialSubscriptions: Subscription[] = [
  {
    id: 1,
    client: "João Silva",
    plan: "Corte Mensal",
    value: 79.9,
    nextCharge: "28/05/2026",
    status: "Ativa",
  },
  {
    id: 2,
    client: "Maria Oliveira",
    plan: "Premium",
    value: 249.9,
    nextCharge: "02/06/2026",
    status: "Renovação próxima",
  },
  {
    id: 3,
    client: "Rafael Lima",
    plan: "Barba Club",
    value: 119.9,
    nextCharge: "31/05/2026",
    status: "Ativa",
  },
]

export default function GerenciarAssinaturasPage() {
  const [items, setItems] = useState(initialSubscriptions)
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
        (filter === "proximas" && item.status === "Renovação próxima") ||
        (filter === "pausadas" && item.status === "Pausada")
      const matchesQuery =
        !normalizedQuery ||
        item.client.toLowerCase().includes(normalizedQuery) ||
        item.plan.toLowerCase().includes(normalizedQuery) ||
        item.status.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [filter, items, query])

  const recurringTotal = filteredItems.reduce((sum, item) => sum + item.value, 0)

  function openCreate() {
    setEditing(null)
    setDraft(createEmptySubscription())
    setModalOpen(true)
  }

  function openEdit(subscription: Subscription) {
    setEditing(subscription)
    setDraft({ ...subscription })
    setModalOpen(true)
  }

  function saveSubscription() {
    if (!draft.client.trim()) return

    setItems((current) =>
      editing
        ? current.map((item) => (item.id === draft.id ? draft : item))
        : [{ ...draft, id: Date.now() }, ...current]
    )
    setFeedback(
      editing
        ? `Assinatura de ${draft.client} atualizada.`
        : `Assinatura de ${draft.client} criada.`
    )
    setModalOpen(false)
  }

  function togglePause(subscription: Subscription) {
    const nextStatus = subscription.status === "Pausada" ? "Ativa" : "Pausada"

    setItems((current) =>
      current.map((item) =>
        item.id === subscription.id ? { ...item, status: nextStatus } : item
      )
    )
    setFeedback(`${subscription.client}: status alterado para ${nextStatus}.`)
  }

  function updateDraft<Key extends keyof Subscription>(
    key: Key,
    value: Subscription[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
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
              <SelectItem value="proximas">Renovação próxima</SelectItem>
              <SelectItem value="pausadas">Pausadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SimpleTable
          columns={["Cliente", "Plano", "Valor", "Próxima cobrança", "Status", "Ações"]}
          rows={filteredItems.map((subscription) => [
            subscription.client,
            subscription.plan,
            formatCurrency(subscription.value),
            subscription.nextCharge,
            <StatusBadge key="status" tone={getStatusTone(subscription.status)}>
              {subscription.status}
            </StatusBadge>,
            <div key="actions" className="flex flex-wrap gap-2">
              <Button size="xs" variant="outline" onClick={() => openEdit(subscription)}>
                Editar
              </Button>
              <Button size="xs" variant="outline" onClick={() => togglePause(subscription)}>
                {subscription.status === "Pausada" ? "Reativar" : "Pausar"}
              </Button>
            </div>,
          ])}
        />

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

          <div className="grid gap-4 p-4 md:grid-cols-2">
            <Field label="Cliente">
              <Input
                value={draft.client}
                onChange={(event) => updateDraft("client", event.target.value)}
              />
            </Field>
            <Field label="Plano">
              <Select
                value={draft.plan}
                onValueChange={(value) => updateDraft("plan", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corte Mensal">Corte Mensal</SelectItem>
                  <SelectItem value="Barba Club">Barba Club</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
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
                  updateDraft("status", value as SubscriptionStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Renovação próxima">
                    Renovação próxima
                  </SelectItem>
                  <SelectItem value="Pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

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
    client: "",
    plan: "Corte Mensal",
    value: 79.9,
    nextCharge: "29/05/2026",
    status: "Ativa",
  }
}

function getStatusTone(status: SubscriptionStatus) {
  if (status === "Ativa") return "green"
  if (status === "Renovação próxima") return "amber"
  return "neutral"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
