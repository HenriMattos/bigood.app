"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  CrownIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  database,
  type Plan,
  type Subscription,
} from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import {
  getStoredClientSubscriptions,
  saveClientSubscriptions,
} from "@/components/company/client-portal-config"
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

import {
  addMonths,
  formatCurrency,
  formatSubscriptionDate,
  getPlanBenefits,
  getPlanServiceIds,
} from "./booking-logic"
import { useClientPortal } from "./portal-provider"
import { SectionTitle } from "./section-title"

const POLICY_ITEMS = [
  {
    title: "Como assinar",
    body: "Escolha um plano, conclua o checkout e a assinatura entra em vigor na hora com renovacao automatica mensal.",
  },
  {
    title: "Como cancelar",
    body: "O cancelamento pode ser solicitado ate 24h antes da proxima cobranca para evitar renovacao do ciclo seguinte.",
  },
  {
    title: "Regras de uso",
    body: "Servicos inclusos respeitam o limite mensal do plano. Servicos fora da cobertura entram como extras com desconto.",
  },
]

export function PortalPlansView() {
  const { subscription, currentPlan, plans: portalPlans, clientProfile } =
    useClientPortal()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle")

  const activeServices = useMemo(
    () => database.services.filter((s) => s.status === "Ativo" && !s.hidden),
    []
  )

  const availablePlans = useMemo(
    () => portalPlans.filter((p) => p.status === "Ativo" || p.status === "Destaque"),
    [portalPlans]
  )

  const featuredPlan = currentPlan ?? availablePlans[0]
  const benefits = useMemo(() => getPlanBenefits(featuredPlan), [featuredPlan])

  const featuredPlanServices = useMemo(() => {
    const ids = getPlanServiceIds(activeServices, featuredPlan?.name)
    return activeServices.filter((s) => ids.includes(s.id))
  }, [activeServices, featuredPlan?.name])

  function openPicker() {
    setCheckoutPlan(null)
    setPaymentStatus("idle")
    setDialogOpen(true)
  }

  function confirmPayment() {
    if (!checkoutPlan || !clientProfile) return
    setPaymentStatus("processing")
    window.setTimeout(() => {
      const nextSubscription: Subscription = {
        id: Date.now(),
        clientId: clientProfile.id,
        client: clientProfile.name,
        phone: clientProfile.phone,
        plan: checkoutPlan.name,
        value: checkoutPlan.price,
        nextCharge: formatSubscriptionDate(addMonths(new Date(), 1)),
        startedAt: formatSubscriptionDate(new Date()),
        status: "Ativa",
      }
      const base = getStoredClientSubscriptions(database.subscriptions)
      const nextSubscriptions = [
        nextSubscription,
        ...base.filter((item) => item.clientId !== clientProfile.id),
      ]
      saveClientSubscriptions(nextSubscriptions)
      setPaymentStatus("success")
    }, 800)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:max-w-3xl sm:py-10">
      <SectionTitle
        eyebrow="Assinatura"
        title={subscription?.plan ?? "Planos premium"}
        description="Gerencie detalhes da sua assinatura, beneficios e regras de cancelamento em um unico lugar."
      />

      {!subscription ? (
        <EmptyState
          icon={CrownIcon}
          title="Sem plano ativo"
          description="Voce pode continuar como cliente avulso com valor cheio, ou ativar um plano para liberar servicos inclusos e desconto em extras."
          className="client-card mb-6"
          actionLabel="Ver planos"
          onAction={openPicker}
        />
      ) : null}

      <section className="client-card mb-6 rounded-xl border-[oklch(0.857_0.1698_134.5554)] p-6 shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary/90">
              {subscription ? "Plano ativo" : "Plano recomendado"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {featuredPlan?.name ?? "Plano premium"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {featuredPlan?.benefit ?? "Beneficios exclusivos para assinantes."}
            </p>
          </div>
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <HugeiconsIcon icon={CrownIcon} size={22} />
          </span>
        </div>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">Valor mensal</dt>
            <dd className="font-semibold">
              {formatCurrency(subscription?.value ?? featuredPlan?.price ?? 0)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Renovacao</dt>
            <dd className="font-semibold">
              {subscription?.nextCharge ?? "No checkout"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Limite mensal</dt>
            <dd className="font-semibold">
              {featuredPlan?.servicesLimit ?? "-"} servicos
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-semibold">{subscription?.status ?? "Sem assinatura"}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button className="green-shine" asChild>
            <Link href="/cliente/agendar">
              {subscription ? "Agendar com plano" : "Agendar como avulso"}
            </Link>
          </Button>
          <Button variant="outline" type="button" onClick={openPicker}>
            {subscription ? "Trocar plano" : "Assinar plano"}
          </Button>
        </div>
      </section>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <section className="client-card p-6">
          <p className="text-sm font-semibold">Beneficios premium</p>
          <ul className="mt-4 space-y-2">
            {benefits.map((b) => (
              <li key={b} className="flex gap-2 text-sm">
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />
                {b}
              </li>
            ))}
          </ul>
        </section>

        <section className="client-card p-6">
          <p className="text-sm font-semibold">Detalhes da assinatura</p>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Inicio</span>
              <span className="font-medium">{subscription?.startedAt ?? "A confirmar"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Recorrencia</span>
              <span className="font-medium">{featuredPlan?.recurrence ?? "Mensal"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Desconto em extras</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Cancelamento</span>
              <span className="font-medium">Ate 24h antes da renovacao</span>
            </div>
          </div>
        </section>
      </div>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        {POLICY_ITEMS.map((item) => (
          <article key={item.title} className="client-card p-4">
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <section className="client-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Servicos cobertos pelo plano</h2>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {featuredPlanServices.length} itens
          </span>
        </div>
        {featuredPlanServices.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Sem itens mapeados no momento para este plano.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {featuredPlanServices.slice(0, 8).map((service) => (
              <li
                key={service.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <span className="font-medium">{service.name}</span>
                <span className="text-xs text-muted-foreground">
                  {service.duration}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="client-dialog max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {checkoutPlan ? "Checkout simulado" : "Planos disponiveis"}
            </DialogTitle>
            <DialogDescription>
              {checkoutPlan
                ? "Pagamento recorrente simulado para demonstracao."
                : "Selecione um plano para continuar."}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="border-y border-[oklch(0.857_0.1698_134.5554_/_0.35)] py-4">
            {checkoutPlan ? (
              <CheckoutPanel
                plan={checkoutPlan}
                paymentStatus={paymentStatus}
                email={clientProfile?.email ?? ""}
              />
            ) : availablePlans.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum plano cadastrado no mock.
              </p>
            ) : (
              <div className="grid gap-3">
                {availablePlans.map((plan) => {
                  const current = plan.name === subscription?.plan
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setCheckoutPlan(plan)}
                      className="client-plan-option-card flex w-full flex-col p-4 text-left transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {current ? "Seu plano" : plan.status}
                          </p>
                          <p className="mt-1 text-lg font-semibold">{plan.name}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {plan.benefit}
                          </p>
                        </div>
                        <HugeiconsIcon icon={CrownIcon} size={24} className="text-primary" />
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[oklch(0.857_0.1698_134.5554_/_0.35)] pt-3 text-sm">
                        <span className="font-semibold">
                          {formatCurrency(plan.price)}/mes
                        </span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </DialogBody>

          <DialogFooter className="gap-2 sm:gap-0">
            {checkoutPlan ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={paymentStatus === "processing"}
                  onClick={() => {
                    setCheckoutPlan(null)
                    setPaymentStatus("idle")
                  }}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="green-shine"
                  disabled={paymentStatus === "processing"}
                  onClick={
                    paymentStatus === "success"
                      ? () => setDialogOpen(false)
                      : confirmPayment
                  }
                >
                  {paymentStatus === "processing"
                    ? "Processando..."
                    : paymentStatus === "success"
                      ? "Concluir"
                      : "Confirmar assinatura"}
                </Button>
              </>
            ) : (
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CheckoutPanel({
  plan,
  paymentStatus,
  email,
}: {
  plan: Plan
  paymentStatus: "idle" | "processing" | "success"
  email: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[oklch(0.857_0.1698_134.5554)] bg-card p-4 shadow-none">
        <p className="text-xs text-muted-foreground">Plano</p>
        <p className="text-xl font-semibold">{plan.name}</p>
        <p className="mt-2 text-sm text-muted-foreground">{plan.benefit}</p>
        <p className="mt-4 border-t border-[oklch(0.857_0.1698_134.5554_/_0.35)] pt-3 text-lg font-semibold">
          {formatCurrency(plan.price)}
        </p>
      </div>
      <div className="grid gap-2">
        <label className="grid gap-1 text-xs">
          E-mail
          <Input readOnly value={email} />
        </label>
        <label className="grid gap-1 text-xs">
          Cartao (simulado)
          <Input readOnly value="4242 4242 4242 4242" />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs">
            Validade
            <Input readOnly value="12/30" />
          </label>
          <label className="grid gap-1 text-xs">
            CVC
            <Input readOnly value="123" />
          </label>
        </div>
      </div>
      {paymentStatus === "success" ? (
        <p className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
          Assinatura registrada localmente.
        </p>
      ) : null}
    </div>
  )
}
