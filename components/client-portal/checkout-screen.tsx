"use client"

import { useState } from "react"
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  Invoice03Icon,
  ShieldCheck,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  formatCurrency,
  type ClientPortalPlan,
  type ClientProfile,
  type PaymentMethod,
} from "@/components/client-portal/client-portal-data"
import { cn } from "@/lib/utils"

const paymentMethods: Array<{
  id: PaymentMethod
  label: string
  description: string
}> = [
  {
    id: "card",
    label: "Cartao",
    description: "Credito com confirmacao simulada.",
  },
  {
    id: "pix",
    label: "Pix",
    description: "Gerar QR Code e copia e cola.",
  },
  {
    id: "boleto",
    label: "Boleto",
    description: "Vencimento em ate 2 dias uteis.",
  },
  {
    id: "barbershop",
    label: "Na barbearia",
    description: "Combine o pagamento no balcao.",
  },
]

export function CheckoutScreen({
  plan,
  profile,
  onClose,
  onConfirm,
  onRequireAuth,
}: {
  plan: ClientPortalPlan | null
  profile: ClientProfile
  onClose: () => void
  onConfirm: (plan: ClientPortalPlan, paymentMethod: PaymentMethod) => void
  onRequireAuth?: () => void
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [success, setSuccess] = useState(false)

  if (!plan) {
    return null
  }

  function confirm() {
    if (onRequireAuth) {
      onRequireAuth()
      return
    }

    onConfirm(plan!, paymentMethod)
    setSuccess(true)
  }

  return (
    <div className="fixed inset-y-0 left-1/2 z-[70] w-full max-w-[430px] -translate-x-1/2 border-x border-[var(--client-border,#d6e2db)] bg-[var(--client-bg,#f7faf6)] text-[var(--client-primary-dark,#0a3f28)]">
      <div className="flex h-dvh w-full flex-col bg-[var(--client-bg,#f7faf6)]">
        <div className="flex items-center justify-between border-b border-[rgba(11,51,36,0.10)] bg-white/90 px-5 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={success ? onClose : onClose}
            className="grid size-10 place-items-center rounded-full border border-[rgba(11,51,36,0.12)] bg-white text-[#0a3f28] transition active:scale-95"
            aria-label="Voltar"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} aria-hidden />
          </button>
          <div className="text-center">
            <p className="text-[11px] font-black tracking-[0.08em] text-[#6f8178] uppercase">
              Checkout
            </p>
            <h2 className="text-base font-black">
              {success ? "Assinatura ativa" : plan.name}
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
          <div className="flex flex-1 flex-col justify-between px-5 py-8">
            <div className="rounded-[32px] border border-[rgba(216,242,58,0.35)] bg-[var(--client-primary-dark,#0a3f28)] p-6 text-white">
              <div className="grid size-14 place-items-center rounded-full bg-[#d8f23a] text-[#0a3f28]">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={28}
                  aria-hidden
                />
              </div>
              <h3 className="mt-5 text-2xl leading-7 font-black">
                Plano contratado!
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Sua assinatura foi ativada neste portal.
              </p>
              <div className="mt-5 rounded-[24px] border border-white/12 bg-white/10 p-4">
                <p className="font-black">{plan.name}</p>
                <p className="mt-1 text-sm text-white/72">
                  {formatCurrency(plan.price)} por mes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="client-button-lime h-14 uppercase"
            >
              Ver meu plano
            </button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <section className="rounded-[32px] border border-[rgba(216,242,58,0.35)] bg-[var(--client-primary-dark,#0a3f28)] p-6 text-white">
                <p className="text-xs font-black tracking-[0.08em] text-[#d8f23a] uppercase">
                  Resumo do plano
                </p>
                <h3 className="mt-3 text-2xl leading-7 font-black">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {plan.description}
                </p>
                <p className="mt-5 text-3xl font-black">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-bold text-white/62">/mes</span>
                </p>
              </section>

              <CheckoutSection title="Dados do cliente">
                <div className="grid gap-3">
                  <ReadonlyField label="Nome" value={profile.name} />
                  <ReadonlyField label="Telefone" value={profile.phone} />
                  <ReadonlyField label="Email" value={profile.email} />
                </div>
              </CheckoutSection>

              <CheckoutSection title="Forma de pagamento">
                <div className="grid gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "rounded-[24px] border border-[rgba(11,51,36,0.10)] bg-white p-4 text-left transition active:scale-[0.98]",
                        paymentMethod === method.id && "client-choice-selected"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-[rgba(11,51,36,0.06)] text-[#0a3f28]">
                          <HugeiconsIcon
                            icon={
                              method.id === "card"
                                ? CreditCardIcon
                                : method.id === "boleto"
                                  ? Invoice03Icon
                                  : Wallet02Icon
                            }
                            size={18}
                            aria-hidden
                          />
                        </span>
                        <span className="min-w-0">
                          <strong className="block text-sm">
                            {method.label}
                          </strong>
                          <small className="mt-1 block text-xs font-semibold text-[#6f8178]">
                            {method.description}
                          </small>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </CheckoutSection>

              {paymentMethod === "card" && (
                <CheckoutSection title="Cartao de credito">
                  <div className="grid gap-3">
                    <CheckoutInput
                      label="Nome no cartao"
                      placeholder="Gabriel Silva"
                    />
                    <CheckoutInput
                      label="Numero do cartao"
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <CheckoutInput label="Validade" placeholder="12/29" />
                      <CheckoutInput
                        label="CVV"
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </div>
                    <CheckoutInput
                      label="CPF do titular"
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                    />
                  </div>
                </CheckoutSection>
              )}

              {paymentMethod === "pix" && (
                <PaymentPlaceholder
                  title="Pix preparado"
                  description="Ao confirmar, o portal exibiria QR Code e codigo copia e cola."
                />
              )}

              {paymentMethod === "boleto" && (
                <PaymentPlaceholder
                  title="Boleto preparado"
                  description="Ao confirmar, o portal exibiria o link do boleto."
                />
              )}

              {paymentMethod === "barbershop" && (
                <PaymentPlaceholder
                  title="Pagamento no balcao"
                  description="A assinatura fica registrada para pagamento direto na barbearia."
                />
              )}
            </div>

            <div className="border-t border-[rgba(11,51,36,0.10)] bg-white px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
              <div className="mb-4 flex items-center gap-2 rounded-[20px] bg-[rgba(11,51,36,0.05)] p-3 text-xs font-bold text-[#6f8178]">
                <HugeiconsIcon icon={ShieldCheck} size={17} aria-hidden />
                Checkout seguro em modo demonstracao local.
              </div>
              <button
                type="button"
                onClick={confirm}
                className="client-button-lime h-14 w-full uppercase"
              >
                Confirmar assinatura
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CheckoutSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-5 rounded-[28px] border border-[rgba(11,51,36,0.12)] bg-white p-5">
      <h3 className="text-[17px] leading-6 font-black">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[rgba(11,51,36,0.04)] px-4 py-3">
      <p className="text-[11px] font-black tracking-[0.06em] text-[#6f8178] uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  )
}

function CheckoutInput({
  label,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-[#6f8178]">{label}</span>
      <input className="client-input" {...props} />
    </label>
  )
}

function PaymentPlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <CheckoutSection title={title}>
      <div className="rounded-[24px] border border-dashed border-[rgba(11,51,36,0.18)] bg-[rgba(11,51,36,0.04)] p-5 text-sm leading-6 font-semibold text-[#6f8178]">
        {description}
      </div>
    </CheckoutSection>
  )
}
