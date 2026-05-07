"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight01Icon,
  Building03Icon,
  LockPasswordIcon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"

export function AuthCard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = (searchParams.get("mode") as AuthMode) || "login"
  const nextPath = searchParams.get("next") || "/"
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const { setAuthenticatedUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string

    const response = await fetch(
      mode === "login" ? "/api/auth/login" : "/api/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: formData.get("password"),
          name: formData.get("ownerName"),
          companyName: formData.get("companyName"),
        }),
      }
    )

    setLoading(false)

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        message?: string
      } | null
      setError(payload?.message ?? "Nao foi possivel continuar.")
      return
    }

    const payload = (await response.json().catch(() => null)) as {
      user?: {
        email: string
        name?: string
        companyName?: string
        hasActivePlan: boolean
        planKey?: string
      }
    } | null
    const user = payload?.user ?? null

    if (user) {
      setAuthenticatedUser(user)
    }

    if (user?.hasActivePlan) {
      router.replace(nextPath === "/escolher-plano" ? "/dashboard" : nextPath)
      router.refresh()
      return
    }

    router.replace(
      nextPath.startsWith("/checkout") ? nextPath : "/escolher-plano"
    )
    router.refresh()
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-7">
        <p className="inline-flex rounded-full border border-[var(--landing-border)] bg-[var(--landing-primary-soft)] px-3 py-1.5 text-sm font-bold text-[var(--landing-primary)]">
          {mode === "login" ? "Acesso do barbeiro" : "Nova conta Bigood"}
        </p>
        <h2 className="mt-4 text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] text-[var(--landing-primary-dark)]">
          {mode === "login" ? "Entrar no painel." : "Criar conta comercial."}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">
          {mode === "login"
            ? "Use sua conta Bigood para acessar o dashboard da barbearia."
            : "Cadastre a barbearia para escolher o plano e seguir para o checkout."}
        </p>
      </div>

      <div className="mb-5 rounded-full border border-[var(--landing-border)] bg-[var(--landing-card-soft)] p-1">
        <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => {
            setMode("login")
            setError("")
          }}
          className={cn(
            "h-11 rounded-full text-sm font-bold transition-colors",
            mode === "login"
              ? "bg-white text-[var(--landing-primary-dark)] shadow-[var(--landing-shadow-soft)]"
              : "text-[var(--landing-muted)] hover:text-[var(--landing-primary-dark)]"
          )}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup")
            setError("")
          }}
          className={cn(
            "h-11 rounded-full text-sm font-bold transition-colors",
            mode === "signup"
              ? "bg-white text-[var(--landing-primary-dark)] shadow-[var(--landing-shadow-soft)]"
              : "text-[var(--landing-muted)] hover:text-[var(--landing-primary-dark)]"
          )}
        >
          Cadastrar
        </button>
        </div>
      </div>

      <form onSubmit={handleAuth} className="space-y-3">
        {mode === "signup" && (
          <>
            <Field
              id="ownerName"
              label="Seu nome"
              placeholder="Nome completo"
              icon={UserIcon}
              required
            />
            <Field
              id="companyName"
              label="Barbearia"
              placeholder="Nome da barbearia"
              icon={Building03Icon}
              required
            />
          </>
        )}

        <Field
          id="email"
          label="E-mail"
          type="email"
          placeholder="contato@exemplo.com"
          icon={Mail01Icon}
          required
        />

        {mode === "signup" && (
          <Field
            id="phone"
            label="WhatsApp"
            type="tel"
            placeholder="(00) 00000-0000"
            icon={SmartPhone01Icon}
            required
          />
        )}

        <Field
          id="password"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          icon={LockPasswordIcon}
          required
        />

        {error && (
          <p className="text-xs font-bold text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)] mt-2"
          disabled={loading}
        >
          {loading
            ? "Processando..."
            : mode === "login"
              ? "Entrar agora"
              : "Continuar para assinatura"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </Button>
      </form>

      <p className="mt-5 rounded-[20px] border border-[var(--landing-border)] bg-[var(--landing-card-soft)] p-4 text-sm leading-6 text-[var(--landing-muted)]">
        {mode === "login"
          ? "O dashboard so fica liberado para contas com plano ativo."
          : "Depois do cadastro, voce escolhe o plano e confirma o pagamento para liberar o painel."}
      </p>
    </div>
  )
}

function Field({
  id,
  label,
  icon,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string
  label: string
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
}) {
  return (
    <div className="grid gap-1.5">
      <Label
        htmlFor={id}
        className="ml-1 text-sm font-bold text-[var(--landing-primary-dark)]"
      >
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--landing-muted)]"
          />
        )}
        <Input
          id={id}
          name={id}
          className={cn(
            "h-12 rounded-full border-[var(--landing-border)] bg-white text-sm",
            icon ? "pl-11" : "px-4"
          )}
          {...props}
        />
      </div>
    </div>
  )
}
