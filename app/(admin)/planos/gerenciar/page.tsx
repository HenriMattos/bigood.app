"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  CrownIcon,
  Delete02Icon,
  File01Icon,
  PlusSignCircleIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

import {
  database,
  type Plan as DatabasePlan,
} from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
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

type Plan = DatabasePlan & { subscribers: number }

const initialPlans: Plan[] = database.plans.map((plan) => ({
  ...plan,
  subscribers: database.subscriptions.filter(
    (subscription) => subscription.plan === plan.name
  ).length,
}))

const statusOptions = ["Todos", "Ativo", "Destaque", "Rascunho", "Inativo"]

export default function GerenciarPlanosPage() {
  const [plans, setPlans] = useState(initialPlans)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [draft, setDraft] = useState<Plan | null>(null)

  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return plans.filter((plan) => {
      const matchesStatus =
        statusFilter === "Todos" || plan.status === statusFilter
      const matchesQuery =
        !normalizedQuery ||
        plan.name.toLowerCase().includes(normalizedQuery) ||
        plan.benefit.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [plans, query, statusFilter])

  function openEditor(plan: Plan) {
    setEditingPlan(plan)
    setDraft({ ...plan })
  }

  function closeEditor() {
    setEditingPlan(null)
    setDraft(null)
  }

  function updateDraft<Key extends keyof Plan>(key: Key, value: Plan[Key]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  function savePlan() {
    if (!draft) return

    setPlans((current) =>
      current.map((plan) => (plan.id === draft.id ? draft : plan))
    )
    closeEditor()
  }

  function removePlan() {
    if (!editingPlan) return

    setPlans((current) => current.filter((plan) => plan.id !== editingPlan.id))
    closeEditor()
  }

  function togglePlanStatus(plan: Plan) {
    setPlans((current) =>
      current.map((item) =>
        item.id === plan.id
          ? { ...item, status: item.status === "Inativo" ? "Ativo" : "Inativo" }
          : item
      )
    )
  }

  return (
    <div className="grid min-w-0 gap-4">
      <SectionCard
        title="Gerenciar planos"
        description="Planos ativos, assinaturas e pacotes recorrentes"
        action={
          <Button size="sm" asChild>
            <Link href="/planos/criar">
              <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
              Criar plano
            </Link>
          </Button>
        }
      >
        <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} size={17} />
            <input
              value={query}
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Buscar plano"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {filteredPlans.map((plan) => (
            <article
              key={plan.id}
              className="plan-premium-card grid min-w-0 gap-5 rounded-lg p-5"
            >
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/35 text-foreground shadow-sm">
                      <HugeiconsIcon icon={CrownIcon} size={19} />
                    </span>
                    <span className="rounded-full border border-white/45 bg-white/32 px-3 py-1 text-xs font-semibold text-foreground uppercase shadow-sm">
                      {plan.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl leading-tight font-semibold break-words">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium break-words text-foreground/72">
                    {plan.benefit}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-foreground/62 uppercase">
                    Mensal
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatCurrency(plan.price)}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <PremiumInfo
                  label="Assinantes"
                  value={String(plan.subscribers)}
                />
                <PremiumInfo
                  label="MRR"
                  value={formatCurrency(plan.price * plan.subscribers)}
                />
                <PremiumInfo
                  label="Uso"
                  value={`${plan.servicesLimit} serviços`}
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-white/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-foreground/70">
                  Risco de churn: <strong>{plan.churnRisk}</strong>
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/55 bg-white/30 hover:bg-white/45"
                    onClick={() => openEditor(plan)}
                  >
                    <HugeiconsIcon icon={File01Icon} size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/55 bg-white/30 hover:bg-white/45"
                    onClick={() => togglePlanStatus(plan)}
                  >
                    <HugeiconsIcon
                      icon={
                        plan.status === "Inativo"
                          ? CheckmarkCircle01Icon
                          : CancelCircleIcon
                      }
                      size={16}
                    />
                    {plan.status === "Inativo" ? "Ativar" : "Inativar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/55 bg-white/30 hover:bg-white/45"
                    asChild
                  >
                    <Link href="/planos/criar">Duplicar</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <Dialog
        open={Boolean(editingPlan)}
        onOpenChange={(open) => !open && closeEditor()}
      >
        <DialogContent className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:h-[min(36rem,calc(100dvh-1rem))] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar plano</DialogTitle>
            <DialogDescription>
              Ajuste dados comerciais e disponibilidade do plano selecionado.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="grid content-start gap-4 overflow-y-auto p-4 md:grid-cols-2">
              <Field label="Nome">
                <Input
                  value={draft.name}
                  onChange={(event) => updateDraft("name", event.target.value)}
                />
              </Field>
              <Field label="Preço">
                <Input
                  value={String(draft.price)}
                  inputMode="decimal"
                  onChange={(event) =>
                    updateDraft("price", Number(event.target.value) || 0)
                  }
                />
              </Field>
              <Field className="md:col-span-2" label="Benefício">
                <Input
                  value={draft.benefit}
                  onChange={(event) =>
                    updateDraft("benefit", event.target.value)
                  }
                />
              </Field>
              <Field label="Assinantes">
                <Input
                  value={String(draft.subscribers)}
                  inputMode="numeric"
                  onChange={(event) =>
                    updateDraft("subscribers", Number(event.target.value) || 0)
                  }
                />
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onValueChange={(value) =>
                    updateDraft("status", value as Plan["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Destaque">Destaque</SelectItem>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Limite de serviços">
                <Input
                  value={String(draft.servicesLimit)}
                  inputMode="numeric"
                  onChange={(event) =>
                    updateDraft(
                      "servicesLimit",
                      Number(event.target.value) || 0
                    )
                  }
                />
              </Field>
              <Field label="Risco de churn">
                <Select
                  value={draft.churnRisk}
                  onValueChange={(value) =>
                    updateDraft("churnRisk", value as Plan["churnRisk"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo</SelectItem>
                    <SelectItem value="Medio">Medio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          ) : null}

          <DialogFooter className="sm:justify-between">
            <Button variant="destructive" onClick={removePlan}>
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Remover plano
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="outline" onClick={closeEditor}>
                Cancelar
              </Button>
              <Button onClick={savePlan}>Salvar alterações</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`grid min-w-0 gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function PremiumInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/35 bg-white/25 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold text-foreground/58 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold break-words">{value}</p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
