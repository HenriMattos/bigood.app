"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  CreditCardIcon,
  CrownIcon,
  File01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  database,
  type Plan,
  type Subscription,
} from "@/components/admin/database"
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
import { cn } from "@/lib/utils"

import {
  addMonths,
  formatCurrency,
  formatSubscriptionDate,
  getPlanBenefits,
  getPlanServiceIds,
  getUsedPlanCredits,
} from "./booking-logic"
import { portalCustomer } from "./portal-data"
import { useClientPortal } from "./portal-provider"
import { SectionTitle } from "./section-title"

type FinanceLog = {
  id: string
  status: "Pago" | "Pendente" | "Falhou"
  date: string
  value: number
}

const PLAN_THEMES = [
  {
    gradient:
      "linear-gradient(145deg, oklch(0.965 0.02 136) 0%, oklch(0.942 0.085 132) 52%, oklch(0.918 0.13 104) 100%)",
  },
  {
    gradient:
      "linear-gradient(145deg, oklch(0.972 0.014 142) 0%, oklch(0.948 0.075 138) 45%, oklch(0.925 0.118 106) 100%)",
  },
  {
    gradient:
      "linear-gradient(145deg, oklch(0.968 0.02 128) 0%, oklch(0.944 0.092 126) 48%, oklch(0.914 0.14 100) 100%)",
  },
]

type CardForm = {
  holder: string
  number: string
  expiry: string
  cvv: string
  document: string
  brand: string
}

export function PortalPlansView() {
  const {
    subscription,
    plans: portalPlans,
    clientProfile,
    portalSettings,
    activeServices,
    session,
  } = useClientPortal()

  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [activePlanId, setActivePlanId] = useState<number | null>(null)

  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutStatus, setCheckoutStatus] = useState<
    "idle" | "processing" | "success"
  >("idle")

  const [cartaoOpen, setCartaoOpen] = useState(false)
  const [assinaturaOpen, setAssinaturaOpen] = useState(false)
  const [suporteOpen, setSuporteOpen] = useState(false)
  const [cartaoFinal, setCartaoFinal] = useState("1234")
  const [cardForm, setCardForm] = useState<CardForm>({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
    document: "",
    brand: "Visa",
  })

  const availablePlans = useMemo(
    () =>
      portalPlans.filter((plan) => plan.status === "Ativo" || plan.status === "Destaque"),
    [portalPlans]
  )

  const activePlan = useMemo(
    () =>
      availablePlans.find((plan) => plan.id === activePlanId) ??
      availablePlans.find((plan) => plan.name === subscription?.plan) ??
      availablePlans[0],
    [activePlanId, availablePlans, subscription?.plan]
  )

  useEffect(() => {
    const container = carouselRef.current
    if (!container || !availablePlans.length) return

    const syncActiveFromScroll = () => {
      const cards = Array.from(
        container.querySelectorAll<HTMLElement>("[data-plan-card='true']")
      )
      if (!cards.length) return

      const center = container.scrollLeft + container.clientWidth / 2
      let bestId = activePlan?.id ?? availablePlans[0].id
      let bestDistance = Number.POSITIVE_INFINITY

      for (const card of cards) {
        const id = Number(card.dataset.planId)
        if (!id) continue
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(center - cardCenter)
        if (distance < bestDistance) {
          bestDistance = distance
          bestId = id
        }
      }

      if (bestId !== activePlanId) setActivePlanId(bestId)
    }

    const onScroll = () => window.requestAnimationFrame(syncActiveFromScroll)
    syncActiveFromScroll()
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [activePlan?.id, activePlanId, availablePlans])

  const planServiceIds = useMemo(
    () => getPlanServiceIds(activeServices, activePlan?.name),
    [activeServices, activePlan?.name]
  )

  const usedPlanCredits = useMemo(
    () =>
      getUsedPlanCredits(
        planServiceIds,
        activeServices,
        clientProfile?.name || portalCustomer?.name,
        database.agendaEvents,
        session.extraAppointments
      ),
    [activeServices, clientProfile?.name, planServiceIds, session.extraAppointments]
  )

  const servicesLimit = activePlan?.servicesLimit ?? 0
  const usedPercent =
    servicesLimit > 0 ? Math.min((usedPlanCredits / servicesLimit) * 100, 100) : 0
  const extrasPercent = subscription ? Math.min(usedPercent * 0.55, 100) : 0

  const renovacao = subscription?.nextCharge ?? formatSubscriptionDate(addMonths(new Date(), 1))
  const faturaValor = subscription?.value ?? activePlan?.price ?? 0
  const metodoPagamento = `Cartao final ${cartaoFinal}`

  const financeLog = useMemo<FinanceLog[]>(
    () => [
      {
        id: "FAT-2026-05",
        status: "Pago",
        date: formatSubscriptionDate(new Date()),
        value: faturaValor,
      },
      {
        id: "FAT-2026-04",
        status: "Pago",
        date: formatSubscriptionDate(addMonths(new Date(), -1)),
        value: faturaValor,
      },
      {
        id: "FAT-2026-03",
        status: "Pendente",
        date: formatSubscriptionDate(addMonths(new Date(), -2)),
        value: faturaValor,
      },
    ],
    [faturaValor]
  )

  const suporteHref = portalSettings.social?.whatsapp
    ? `https://wa.me/55${portalSettings.social.whatsapp.replace(/\D/g, "")}`
    : undefined

  function focusPlan(planId: number) {
    setActivePlanId(planId)
    const container = carouselRef.current
    if (!container) return
    const target = container.querySelector<HTMLElement>(`[data-plan-id='${planId}']`)
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }

  function openCheckout(plan: Plan) {
    setCheckoutPlan(plan)
    setCheckoutStatus("idle")
    setCheckoutOpen(true)
  }

  function confirmCheckout() {
    if (!checkoutPlan || !clientProfile) return
    setCheckoutStatus("processing")

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
      setCheckoutStatus("success")
    }, 900)
  }

  function downloadInvoice(log: FinanceLog) {
    const content = [
      "Comprovante de fatura",
      `ID: ${log.id}`,
      `Status: ${log.status}`,
      `Data: ${log.date}`,
      `Valor: ${formatCurrency(log.value)}`,
      `Cliente: ${clientProfile?.name ?? "Cliente"}`,
    ].join("\n")

    const blob = new Blob([content], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${log.id}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  function salvarCartao() {
    const digits = cardForm.number.replace(/\D/g, "")
    if (digits.length < 16) return
    setCartaoFinal(digits.slice(-4))
    setCartaoOpen(false)
    setCardForm({
      holder: "",
      number: "",
      expiry: "",
      cvv: "",
      document: "",
      brand: "Visa",
    })
  }

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  function formatDocument(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-6 sm:pb-10 sm:pt-10">
      <SectionTitle
        eyebrow="Faturamento"
        title="Planos e assinatura"
        description="Gestao completa do seu plano, consumo e faturas."
      />

      {availablePlans.length === 0 ? (
        <section className="client-card p-5 text-sm text-muted-foreground">
          Nenhum plano disponivel no momento.
        </section>
      ) : (
        <>
          <section className="mb-6 overflow-visible py-1">
            <div
              ref={carouselRef}
              className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pt-2 [scrollbar-width:none]"
            >
              {availablePlans.map((plan, index) => {
                const current = subscription?.plan === plan.name
                const active = activePlan?.id === plan.id
                const benefits = getPlanBenefits(plan)
                const theme = PLAN_THEMES[index % PLAN_THEMES.length]

                return (
                  <article
                    key={plan.id}
                    data-plan-card="true"
                    data-plan-id={plan.id}
                    onClick={() => focusPlan(plan.id)}
                    className={cn(
                      "min-w-[86%] snap-center rounded-2xl border border-primary/55 p-5 text-[oklch(0.24_0.04_145)] shadow-none transition-all duration-300 sm:min-w-[48%] lg:min-w-[31%]",
                      active ? "ring-2 ring-primary/35 md:scale-[1.03]" : "opacity-95"
                    )}
                    style={{ background: theme.gradient, boxShadow: "none" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {current ? (
                          <span className="rounded-full bg-[oklch(0.857_0.1698_134.5554)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.2869_0.0839_135.0504)]">
                            Plano atual
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.34_0.03_150)]">
                            {plan.status}
                          </span>
                        )}
                        <h3 className="mt-2 text-xl font-semibold">{plan.name}</h3>
                      </div>
                      <span className="flex size-10 items-center justify-center rounded-xl bg-white/40 text-[oklch(0.29_0.08_135)]">
                        <HugeiconsIcon icon={CrownIcon} size={19} />
                      </span>
                    </div>

                    <p className="mt-3 text-3xl font-semibold text-[oklch(0.22_0.03_145)]">
                      {formatCurrency(plan.price)}
                      <span className="ml-1 text-sm font-medium text-[oklch(0.35_0.03_150)]">
                        /mes
                      </span>
                    </p>

                    <ul className="mt-4 space-y-1.5">
                      {benefits.slice(0, 4).map((benefit) => (
                        <li key={benefit} className="flex gap-2 text-xs">
                          <HugeiconsIcon
                            icon={CheckmarkCircle01Icon}
                            size={15}
                            className="mt-0.5 shrink-0 text-[oklch(0.33_0.11_136)]"
                          />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5">
                      <Button
                        type="button"
                        className="h-10 w-full gap-2 shadow-none [box-shadow:none] hover:[box-shadow:none]"
                        variant={current ? "secondary" : "default"}
                        onClick={() => openCheckout(plan)}
                      >
                        {current ? "Gerenciar plano" : "Escolher plano"}
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="mb-5 grid gap-4 lg:grid-cols-2">
            <article className="client-card p-5 shadow-none">
              <p className="text-sm font-semibold">Consumo do plano</p>

              <div className="mt-4 space-y-4">
                <UsageBar
                  label="Servicos incluidos"
                  meta={`${usedPlanCredits}/${servicesLimit || 0} usados`}
                  percent={usedPercent}
                />
                <UsageBar
                  label="Uso de extras"
                  meta={subscription ? "Desconto ativo em extras" : "Sem desconto"}
                  percent={extrasPercent}
                />
              </div>
            </article>

            <article className="client-card p-5 shadow-none">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Resumo de cobranca</p>
                <HugeiconsIcon icon={Wallet02Icon} size={18} className="text-primary" />
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                <p className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Renovacao</span>
                  <span className="font-medium">{renovacao}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Valor da fatura</span>
                  <span className="font-medium">{formatCurrency(faturaValor)}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Metodo</span>
                  <span className="font-medium">{metodoPagamento}</span>
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button type="button" variant="outline" className="h-10" onClick={() => setCartaoOpen(true)}>
                  Adicionar cartao
                </Button>
                <Button type="button" variant="outline" className="h-10" onClick={() => setAssinaturaOpen(true)}>
                  Assinatura
                </Button>
                <Button type="button" variant="outline" className="h-10" onClick={() => setSuporteOpen(true)}>
                  Suporte
                </Button>
              </div>
            </article>
          </section>

          <section className="client-card p-5 shadow-none">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Historico financeiro</p>
              <span className="text-xs text-muted-foreground">Ultimas faturas</span>
            </div>

            <ul className="space-y-2">
              {financeLog.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-3 py-3 shadow-none"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <StatusPill status={log.status} />
                      <span className="truncate text-xs text-muted-foreground">{log.id}</span>
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {log.date}
                    </span>
                  </span>

                  <span className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatCurrency(log.value)}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1"
                      onClick={() => downloadInvoice(log)}
                    >
                      <HugeiconsIcon icon={File01Icon} size={14} />
                      Baixar
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="client-dialog max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Finalizar assinatura</DialogTitle>
            <DialogDescription>
              Confira os dados do plano e confirme o pagamento recorrente.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4 border-y border-[oklch(0.857_0.1698_134.5554_/_0.35)] py-4">
            {checkoutStatus === "success" ? (
              <section className="rounded-2xl border border-primary/35 bg-primary/10 p-5 text-center shadow-none">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={24} />
                </span>
                <p className="mt-3 text-lg font-semibold">Assinatura confirmada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pagamento aprovado e plano atualizado com sucesso.
                </p>
              </section>
            ) : (
              <>
                <section
                  className="rounded-2xl border border-primary/55 p-4 shadow-none"
                  style={{
                    background:
                      "linear-gradient(150deg, oklch(0.968 0.018 138) 0%, oklch(0.944 0.088 134) 56%, oklch(0.918 0.136 103) 100%)",
                  }}
                >
                  <p className="text-xs text-[oklch(0.38_0.04_145)]">Plano escolhido</p>
                  <p className="mt-1 text-xl font-semibold text-[oklch(0.24_0.05_145)]">
                    {checkoutPlan?.name ?? "-"}
                  </p>
                  <p className="mt-1 text-sm text-[oklch(0.34_0.03_150)]">
                    {checkoutPlan?.benefit ?? "Sem beneficios"}
                  </p>
                  <p className="mt-4 border-t border-primary/25 pt-3 text-2xl font-semibold text-[oklch(0.22_0.03_145)]">
                    {formatCurrency(checkoutPlan?.price ?? 0)}
                    <span className="text-sm font-medium text-[oklch(0.36_0.03_145)]">
                      /mes
                    </span>
                  </p>
                </section>

                <section className="rounded-xl border border-border/75 bg-muted/15 p-4 shadow-none">
                  <p className="text-sm font-semibold">Resumo da cobranca</p>
                  <div className="mt-3 grid gap-2 text-sm">
                    <p className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Renovacao</span>
                      <span className="font-medium">{renovacao}</span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Metodo</span>
                      <span className="font-medium">{metodoPagamento}</span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">E-mail</span>
                      <span className="font-medium">{clientProfile?.email ?? "-"}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 h-9 w-full"
                    onClick={() => setCartaoOpen(true)}
                  >
                    Alterar cartao
                  </Button>
                </section>
              </>
            )}
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={checkoutStatus === "processing"}
              onClick={() => setCheckoutOpen(false)}
            >
              Voltar
            </Button>
            <Button
              type="button"
              className="green-shine"
              disabled={checkoutStatus === "processing" || !checkoutPlan}
              onClick={
                checkoutStatus === "success"
                  ? () => setCheckoutOpen(false)
                  : confirmCheckout
              }
            >
              {checkoutStatus === "processing"
                ? "Processando..."
                : checkoutStatus === "success"
                  ? "Concluir"
                  : "Confirmar assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cartaoOpen} onOpenChange={setCartaoOpen}>
        <DialogContent className="client-dialog max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar cartao</DialogTitle>
            <DialogDescription>
              Cadastre um novo cartao para as proximas renovacoes.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4 shadow-none">
              <p className="text-xs text-muted-foreground">Metodo atual</p>
              <p className="mt-1 flex items-center gap-2 font-medium">
                <HugeiconsIcon icon={CreditCardIcon} size={16} />
                {metodoPagamento}
              </p>
            </div>

            <label className="grid gap-1 text-xs">
              Nome no cartao
              <Input
                value={cardForm.holder}
                onChange={(event) =>
                  setCardForm((prev) => ({ ...prev, holder: event.target.value }))
                }
              />
            </label>

            <label className="grid gap-1 text-xs">
              Numero do cartao
              <Input
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={cardForm.number}
                onChange={(event) =>
                  setCardForm((prev) => ({
                    ...prev,
                    number: formatCardNumber(event.target.value),
                  }))
                }
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1 text-xs">
                Validade
                <Input
                  placeholder="12/30"
                  value={cardForm.expiry}
                  onChange={(event) =>
                    setCardForm((prev) => ({
                      ...prev,
                      expiry: formatExpiry(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="grid gap-1 text-xs">
                CVV
                <Input
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="123"
                  value={cardForm.cvv}
                  onChange={(event) =>
                    setCardForm((prev) => ({
                      ...prev,
                      cvv: event.target.value.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="grid gap-1 text-xs">
                CPF do titular
                <Input
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cardForm.document}
                  onChange={(event) =>
                    setCardForm((prev) => ({
                      ...prev,
                      document: formatDocument(event.target.value),
                    }))
                  }
                />
              </label>

              <label className="grid gap-1 text-xs">
                Bandeira
                <select
                  value={cardForm.brand}
                  onChange={(event) =>
                    setCardForm((prev) => ({ ...prev, brand: event.target.value }))
                  }
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Elo">Elo</option>
                  <option value="American Express">American Express</option>
                </select>
              </label>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCartaoOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={salvarCartao}
              disabled={
                !cardForm.holder.trim() ||
                !cardForm.number.trim() ||
                !cardForm.expiry.trim() ||
                !cardForm.cvv.trim() ||
                !cardForm.document.trim() ||
                cardForm.number.replace(/\D/g, "").length < 16 ||
                cardForm.cvv.length < 3 ||
                cardForm.expiry.length < 5
              }
            >
              Salvar cartao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assinaturaOpen} onOpenChange={setAssinaturaOpen}>
        <DialogContent className="client-dialog sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gerenciar assinatura</DialogTitle>
            <DialogDescription>
              Controle troca de plano e datas de renovacao.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3 text-sm">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">Plano atual</p>
              <p className="mt-1 font-semibold">{subscription?.plan ?? activePlan?.name ?? "-"}</p>
              <p className="mt-1 text-xs text-muted-foreground">Renovacao em {renovacao}</p>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAssinaturaOpen(false)}>
              Fechar
            </Button>
            <Button type="button" onClick={() => setAssinaturaOpen(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suporteOpen} onOpenChange={setSuporteOpen}>
        <DialogContent className="client-dialog sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Suporte</DialogTitle>
            <DialogDescription>Precisa de ajuda com sua cobranca?</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3 text-sm">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="font-medium">Atendimento financeiro</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Fale com nosso time para ajuste de assinatura, estorno e faturas.
              </p>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSuporteOpen(false)}>
              Fechar
            </Button>
            {suporteHref ? (
              <Button type="button" asChild>
                <a href={suporteHref} target="_blank" rel="noreferrer">
                  Abrir suporte
                </a>
              </Button>
            ) : (
              <Button type="button" onClick={() => setSuporteOpen(false)}>
                Ok
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function UsageBar({
  label,
  meta,
  percent,
}: {
  label: string
  meta: string
  percent: number
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{meta}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
        />
      </div>
      <p className="mt-1 text-right text-[11px] text-muted-foreground">
        {Math.round(percent)}%
      </p>
    </div>
  )
}

function StatusPill({ status }: { status: FinanceLog["status"] }) {
  const tone =
    status === "Pago"
      ? "border-primary/35 bg-primary/10 text-primary"
      : status === "Pendente"
        ? "border-amber-400/45 bg-amber-300/10 text-amber-500"
        : "border-destructive/45 bg-destructive/10 text-destructive"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        tone
      )}
    >
      {status}
    </span>
  )
}
