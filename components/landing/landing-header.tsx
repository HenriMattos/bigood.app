"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import { navLinks } from "@/components/landing/landing-data"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const limeButtonClass =
  "h-10 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-4 text-sm font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const darkOutlineButtonClass =
  "h-10 rounded-full border-[var(--landing-border-strong)] bg-white text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)]"

export function LandingHeader() {
  const [open, setOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-[var(--landing-border)] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[68px] lg:px-8">
          <Link
            href="/"
            className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            aria-label="Bigood, inicio"
          >
            <BrandMark compact />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navegacao principal"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--landing-foreground-soft)] transition-colors hover:bg-[var(--landing-primary-soft)] hover:text-[var(--landing-primary-dark)] focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Button size="lg" className={limeButtonClass} asChild>
              <Link href="/login">
                Entrar agora
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            </Button>

            {!isLoading && user ? (
              <div className="group relative">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(darkOutlineButtonClass, "size-10 rounded-full")}
                  aria-haspopup="true"
                  aria-label="Minha conta"
                >
                  <HugeiconsIcon icon={UserIcon} size={20} />
                </Button>
                <div className="invisible absolute top-full right-0 z-50 mt-3 w-56 rounded-[24px] border border-[var(--landing-border)] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(11,51,36,0.1)] transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="mb-1 border-b border-[var(--landing-border)] px-4 py-2">
                    <p className="text-[11px] font-bold tracking-wider text-[var(--landing-muted)] uppercase">
                      Usuario
                    </p>
                    <p className="truncate text-sm font-extrabold text-[var(--landing-primary-dark)]">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/conta"
                    className="block rounded-[18px] px-4 py-3 text-sm font-semibold text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)] focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                  >
                    Configurar conta
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full rounded-[18px] px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-destructive/10 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : !isLoading ? (
              <Button
                variant="ghost"
                className="h-10 text-sm font-bold text-[var(--landing-primary-dark)]"
                asChild
              >
                <Link href="/login">Entrar</Link>
              </Button>
            ) : null}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              darkOutlineButtonClass,
              "size-10 rounded-full p-0 lg:hidden"
            )}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <HugeiconsIcon
              icon={open ? Cancel01Icon : Menu01Icon}
              size={20}
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-b border-[var(--landing-border)] bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav
            className="mx-auto grid max-w-[1200px] gap-2"
            aria-label="Menu mobile"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[18px] px-4 py-3 text-sm font-semibold text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)] focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t border-[var(--landing-border)] pt-4">
              <Button className={limeButtonClass} asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Entrar agora
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
              </Button>

              {!isLoading && user ? (
                <>
                  <div className="px-4 py-2 text-sm">
                    <p className="font-bold text-[var(--landing-muted)]">
                      Logado como:
                    </p>
                    <p className="truncate font-extrabold">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    className={darkOutlineButtonClass}
                    asChild
                  >
                    <Link href="/conta" onClick={() => setOpen(false)}>
                      Configurar conta
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : !isLoading ? (
                <Button
                  variant="outline"
                  className={darkOutlineButtonClass}
                  asChild
                >
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Entrar
                  </Link>
                </Button>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
