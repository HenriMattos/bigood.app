"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  Calendar03Icon,
  ChairBarberIcon,
  Clock01Icon,
  CrownIcon,
  DashboardSquare01Icon,
  Edit02Icon,
  Logout03Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { setPortalClientAuthenticated } from "./portal-data"
import { useClientPortal } from "./portal-provider"

const NAV = [
  {
    href: "/cliente",
    label: "Início",
    icon: DashboardSquare01Icon,
    match: (p: string) => p === "/cliente",
  },
  {
    href: "/cliente/agendar",
    label: "Agendar",
    icon: Calendar03Icon,
    match: (p: string) => p.startsWith("/cliente/agendar"),
  },
  {
    href: "/cliente/agendamentos",
    label: "Horários",
    icon: Clock01Icon,
    match: (p: string) => p.startsWith("/cliente/agendamentos"),
  },
  {
    href: "/cliente/planos",
    label: "Plano",
    icon: CrownIcon,
    match: (p: string) => p.startsWith("/cliente/planos"),
  },
] as const

export function PortalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    mounted,
    portalSettings,
    logoUrl,
    companyDisplayName,
    clientProfile,
    updateClientProfile,
  } = useClientPortal()
  const [editOpen, setEditOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draftName, setDraftName] = useState(clientProfile?.name ?? "")
  const [draftPhone, setDraftPhone] = useState(clientProfile?.phone ?? "")
  const [draftEmail, setDraftEmail] = useState(clientProfile?.email ?? "")

  if (!mounted) {
    return (
      <div
        className="h-dvh bg-[var(--background)]"
        aria-busy="true"
        aria-label="Carregando portal"
      />
    )
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // no-op: even if logout request fails we still send user to login.
    } finally {
      setPortalClientAuthenticated(false)
      router.replace("/cliente/login")
      router.refresh()
    }
  }

  function openProfileEditor() {
    setDraftName(clientProfile?.name ?? "")
    setDraftPhone(clientProfile?.phone ?? "")
    setDraftEmail(clientProfile?.email ?? "")
    setMenuOpen(false)
    setEditOpen(true)
  }

  function saveProfile() {
    if (!clientProfile) return
    setSaving(true)
    updateClientProfile({
      ...clientProfile,
      name: draftName.trim(),
      phone: draftPhone.trim(),
      email: draftEmail.trim(),
    })
    window.setTimeout(() => {
      setSaving(false)
      setEditOpen(false)
    }, 220)
  }

  return (
    <div
      className={cn(
        "client-portal flex h-dvh flex-col overflow-hidden font-sans text-foreground antialiased selection:bg-primary/30",
        portalSettings.mode === "dark" && "dark"
      )}
    >
      <header className="z-40 shrink-0 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-3 px-4 sm:h-16 sm:max-w-3xl lg:max-w-5xl">
          <Link
            href="/cliente"
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            {logoUrl ? (
              <span className="flex size-9 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
            ) : (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <HugeiconsIcon icon={ChairBarberIcon} size={18} />
              </span>
            )}
            <div className="min-w-0 text-left leading-tight">
              <p className="truncate text-sm font-semibold">{companyDisplayName}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                Área do cliente
              </p>
            </div>
          </Link>

          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                <HugeiconsIcon icon={UserMultipleIcon} size={16} />
                Perfil
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
              <div className="border-b border-border px-2 pb-2">
                <p className="truncate text-sm font-semibold">
                  {clientProfile?.name ?? "Cliente"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {clientProfile?.email ?? ""}
                </p>
              </div>
              <div className="grid gap-1 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-full justify-start gap-2"
                  onClick={openProfileEditor}
                >
                  <HugeiconsIcon icon={Edit02Icon} size={16} />
                  Editar perfil
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <HugeiconsIcon icon={Logout03Icon} size={16} />
                  Sair
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <div className="client-portal-main-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <main className="relative w-full min-w-0 overflow-x-hidden pb-24">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 pt-2 sm:max-w-3xl lg:max-w-5xl">
          {NAV.map((item) => {
            const active = item.match(pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition-colors sm:text-xs",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <HugeiconsIcon icon={item.icon} size={22} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="client-dialog">
          <DialogHeader>
            <DialogTitle>Perfil do cliente</DialogTitle>
            <DialogDescription>Atualize seus dados.</DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <label className="grid gap-1.5 text-xs">
              Nome
              <Input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                maxLength={90}
                className="h-10 rounded-xl"
              />
            </label>
            <label className="grid gap-1.5 text-xs">
              Telefone
              <Input
                value={draftPhone}
                onChange={(event) => setDraftPhone(event.target.value)}
                maxLength={20}
                className="h-10 rounded-xl"
              />
            </label>
            <label className="grid gap-1.5 text-xs">
              E-mail
              <Input
                type="email"
                value={draftEmail}
                onChange={(event) => setDraftEmail(event.target.value)}
                maxLength={120}
                className="h-10 rounded-xl"
              />
            </label>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={
                saving ||
                !draftName.trim() ||
                !draftPhone.trim() ||
                !draftEmail.trim()
              }
              onClick={saveProfile}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
