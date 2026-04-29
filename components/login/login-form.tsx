"use client"

import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight01Icon,
  LockPasswordIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    router.push("/dashboard")
  }

  return (
    <form onSubmit={submitLogin} className="w-full">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Acesso ao sistema</p>
        <h2 className="mt-2 text-2xl font-semibold">Entrar no painel</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use suas credenciais administrativas para continuar.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={17}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@empresa.com"
              className="h-11 rounded-xl pl-10"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Senha</Label>
            <button
              type="button"
              className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="relative">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={17}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              className="h-11 rounded-xl pl-10"
              required
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm leading-5 text-muted-foreground">
          <input
            type="checkbox"
            name="remember"
            className="mt-0.5 size-4 rounded border-border accent-primary"
          />
          <span>Manter conectado neste dispositivo</span>
        </label>

        <Button type="submit" size="lg" className="h-11 w-full">
          Entrar agora
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </Button>
      </div>

      <p className="mt-5 rounded-xl border bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">
        Acesso restrito a usuários autorizados pela empresa.
      </p>
    </form>
  )
}
