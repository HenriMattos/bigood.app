"use client"

import { FormEvent, useState } from "react"
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  EyeIcon,
  LockPasswordIcon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useClientAuth } from "@/hooks/use-client-auth"
import {
  validateLogin,
  validateRegister,
  type ValidationErrors,
} from "@/schemas/client-auth"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "register"

export function ClientAuthModal({
  slug,
  open,
  onClose,
  onSuccess,
  initialMode,
}: {
  slug: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
  initialMode?: AuthMode
}) {
  const { login, register } = useClientAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode ?? "login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const [identifier, setIdentifier] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [regName, setRegName] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")

  if (!open) return null

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    setError("")
    setErrors({})

    const validation = validateLogin({ identifier, password: loginPassword })

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setLoading(true)

    try {
      await login(slug, identifier, loginPassword)
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 600)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault()
    setError("")
    setErrors({})

    const validation = validateRegister({
      name: regName,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
    })

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setLoading(true)

    try {
      await register(slug, {
        name: regName,
        phone: regPhone,
        email: regEmail,
        password: regPassword,
        confirmPassword: regConfirmPassword,
      })
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 600)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-y-0 left-1/2 z-[90] w-full max-w-[430px] -translate-x-1/2 border-x border-[var(--client-border,#d6e2db)] bg-[var(--client-bg,#f7faf6)]">
        <div className="flex min-h-dvh items-center justify-center px-5">
          <div className="text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--client-accent,#d8f23a)]">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={32}
                aria-hidden
              />
            </span>
            <h2 className="mt-5 text-2xl font-black">
              {mode === "login" ? "Bem-vindo de volta!" : "Conta criada!"}
            </h2>
            <p className="mt-2 text-sm leading-6 font-medium text-[#6f8178]">
              {mode === "login"
                ? "Entrando na sua conta..."
                : "Preparando seu acesso..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-y-0 left-1/2 z-[90] w-full max-w-[430px] -translate-x-1/2 border-x border-[var(--client-border,#d6e2db)] bg-[var(--client-bg,#f7faf6)]">
      <div className="flex h-dvh w-full flex-col bg-[var(--client-bg,#f7faf6)]">
        <div className="flex items-center justify-between border-b border-[rgba(11,51,36,0.10)] bg-white/90 px-5 py-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full border border-[rgba(11,51,36,0.12)] bg-white text-[#0a3f28] transition active:scale-95"
            aria-label="Voltar"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} aria-hidden />
          </button>
          <div className="text-center">
            <p className="text-[11px] font-black tracking-[0.08em] text-[#6f8178] uppercase">
              Acesso
            </p>
            <h2 className="text-base font-black">
              {mode === "login" ? "Entrar" : "Criar conta"}
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-6 flex gap-2 rounded-full border border-[rgba(11,51,36,0.10)] bg-white p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login")
                setError("")
                setErrors({})
              }}
              className={cn(
                "h-10 flex-1 rounded-full text-sm font-black transition",
                mode === "login"
                  ? "bg-[var(--client-accent,#d8f23a)] text-[var(--client-primary-dark,#0a3f28)]"
                  : "text-[#6f8178]"
              )}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register")
                setError("")
                setErrors({})
              }}
              className={cn(
                "h-10 flex-1 rounded-full text-sm font-black transition",
                mode === "register"
                  ? "bg-[var(--client-accent,#d8f23a)] text-[var(--client-primary-dark,#0a3f28)]"
                  : "text-[#6f8178]"
              )}
            >
              Criar conta
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
              {error}
            </p>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="grid gap-4">
              <Field
                id="login-identifier"
                label="WhatsApp ou e-mail"
                placeholder="(00) 00000-0000 ou seu@email.com"
                icon={Mail01Icon}
                value={identifier}
                onChange={(v) => setIdentifier(v)}
                error={errors.identifier}
              />
              <Field
                id="login-password"
                label="Senha"
                type="password"
                placeholder="Sua senha"
                icon={LockPasswordIcon}
                value={loginPassword}
                onChange={(v) => setLoginPassword(v)}
                error={errors.password}
              />
              <button
                type="submit"
                disabled={loading}
                className="client-button-lime mt-2 h-14 w-full uppercase"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="grid gap-4">
              <Field
                id="reg-name"
                label="Nome completo"
                placeholder="Seu nome"
                icon={UserIcon}
                value={regName}
                onChange={(v) => setRegName(v)}
                error={errors.name}
              />
              <Field
                id="reg-phone"
                label="WhatsApp"
                placeholder="(00) 00000-0000"
                icon={SmartPhone01Icon}
                value={regPhone}
                onChange={(v) => setRegPhone(v)}
                error={errors.phone}
              />
              <Field
                id="reg-email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                icon={Mail01Icon}
                value={regEmail}
                onChange={(v) => setRegEmail(v)}
                error={errors.email}
              />
              <Field
                id="reg-password"
                label="Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                icon={LockPasswordIcon}
                value={regPassword}
                onChange={(v) => setRegPassword(v)}
                error={errors.password}
              />
              <Field
                id="reg-confirm-password"
                label="Confirmar senha"
                type="password"
                placeholder="Repita a senha"
                icon={EyeIcon}
                value={regConfirmPassword}
                onChange={(v) => setRegConfirmPassword(v)}
                error={errors.confirmPassword}
              />
              <button
                type="submit"
                disabled={loading}
                className="client-button-lime mt-2 h-14 w-full uppercase"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  error,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> & {
  id: string
  label: string
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <div className="grid gap-1.5">
      <Label
        htmlFor={id}
        className="ml-1 text-sm font-bold text-[var(--client-primary-dark,#0a3f28)]"
      >
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#6f8178]"
          />
        )}
        <Input
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-12 w-full rounded-full border border-[rgba(11,51,36,0.12)] bg-white pl-11 text-sm text-[var(--client-primary-dark,#0a3f28)] outline-none focus-visible:ring-2 focus-visible:ring-[#d8f23a]/40",
            error ? "border-red-400" : ""
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="ml-1 text-xs font-bold text-red-600">{error}</p>
      )}
    </div>
  )
}
