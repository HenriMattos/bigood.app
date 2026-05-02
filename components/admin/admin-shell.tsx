"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  DashboardSquare01Icon,
  Logout03Icon,
  Menu01Icon,
  Notification03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { useEffect, useState } from "react"
import { database } from "@/components/admin/database"
import {
  createDefaultClientPortalSettings,
  getStoredClientPortalSettings,
  CLIENT_PORTAL_SYNC_EVENT,
} from "@/components/company/client-portal-config"

import { navItems } from "@/components/admin/nav-items"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [companyData, setCompanyData] = useState({
    tradeName: database.company.tradeName,
    logoUrl: database.company.logoUrl || "",
  })

  useEffect(() => {
    function sync() {
      const settings = getStoredClientPortalSettings(
        createDefaultClientPortalSettings(database.company)
      )
      setCompanyData({
        tradeName: settings.tradeName,
        logoUrl: settings.logoUrl || "",
      })
    }

    sync()
    setMounted(true)
    window.addEventListener("storage", sync)
    window.addEventListener(CLIENT_PORTAL_SYNC_EVENT, sync)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener(CLIENT_PORTAL_SYNC_EVENT, sync)
    }
  }, [])
  const activeItem =
    navItems.find((item) => pathname.startsWith(item.href)) ?? navItems[0]

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/")
    router.refresh()
  }

  if (!mounted) return null

  return (
    <div
      className="h-svh overflow-hidden bg-muted/40 text-foreground"
      onPointerDown={(event) => {
        const target = event.target as HTMLElement
        const shineTarget = target.closest(".green-shine")

        if (!(shineTarget instanceof HTMLElement)) return

        shineTarget.classList.remove("shine-run")
        window.requestAnimationFrame(() =>
          shineTarget.classList.add("shine-run")
        )
      }}
      onAnimationEnd={(event) => {
        const target = event.target as HTMLElement
        if (target.classList.contains("green-shine")) {
          target.classList.remove("shine-run")
        }
      }}
    >
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(18rem,calc(100vw-2rem))] border-r border-sidebar-border bg-sidebar px-4 py-5 shadow-xl">
            <SidebarContent
              key={pathname}
              pathname={pathname}
              companyData={companyData}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="admin-app grid h-svh min-w-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="z-30 hidden h-full min-h-0 border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex lg:flex-col">
          <SidebarContent
            key={pathname}
            pathname={pathname}
            companyData={companyData}
          />
        </aside>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <header className="z-20 shrink-0 border-b bg-background/95 backdrop-blur">
            <div className="admin-container flex h-14 items-center gap-2 px-0 sm:h-16 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Abrir menu"
                onClick={() => setMobileOpen(true)}
              >
                <HugeiconsIcon icon={Menu01Icon} size={20} />
              </Button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-muted-foreground">
                  Painel administrativo
                </p>
                <h1 className="truncate text-base font-semibold md:text-lg">
                  {activeItem.title}
                </h1>
              </div>

              <label className="hidden h-9 w-full max-w-xs items-center gap-2 rounded-full border bg-background px-3 text-sm text-muted-foreground md:flex xl:max-w-sm">
                <HugeiconsIcon icon={Search01Icon} size={17} />
                <input
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  placeholder="Buscar cliente, horario..."
                />
              </label>

              <Button
                variant="outline"
                size="icon"
                className="hidden sm:inline-flex"
                aria-label="Notificacoes"
              >
                <HugeiconsIcon icon={Notification03Icon} size={19} />
              </Button>

              <span className="hidden size-9 items-center justify-center rounded-full border bg-muted text-muted-foreground sm:flex">
                <HugeiconsIcon icon={DashboardSquare01Icon} size={18} />
              </span>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Sair do painel"
                onClick={logout}
              >
                <HugeiconsIcon icon={Logout03Icon} size={19} />
              </Button>
            </div>
          </header>

          <ScrollArea className="min-h-0 flex-1 overflow-x-hidden">
            <main className="admin-container flex min-w-0 flex-col gap-2 overflow-x-hidden py-2 sm:gap-5 sm:py-5 lg:gap-6 lg:py-6">
              {children}
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  companyData,
  onNavigate,
}: {
  pathname: string
  companyData: { tradeName: string; logoUrl: string }
  onNavigate?: () => void
}) {
  const activeParentHref = getParentHref(pathname)
  const [openItems, setOpenItems] = useState<string[]>(
    activeParentHref ? [activeParentHref] : []
  )

  function toggleItem(href: string) {
    setOpenItems((current) => (current.includes(href) ? [] : [href]))
  }

  function handleNavigate(href: string) {
    const nextParentHref = getParentHref(href)

    setOpenItems(nextParentHref ? [nextParentHref] : [])
    onNavigate?.()
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3">
        {companyData.logoUrl ? (
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={companyData.logoUrl}
              alt={companyData.tradeName}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
            <HugeiconsIcon icon={DashboardSquare01Icon} size={20} />
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {companyData.tradeName}
          </span>
          <span className="block truncate text-xs text-sidebar-foreground/60">
            Painel Administrativo
          </span>
        </span>
      </Link>

      <ScrollArea className="min-h-0 flex-1 pr-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const hasChildren = "children" in item && item.children
            const isOpen = openItems.includes(item.href)

            return (
              <div key={item.href}>
                <div
                  className={cn(
                    "group flex items-center rounded-md text-sm font-medium text-sidebar-foreground/75 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={() => handleNavigate(item.href)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5"
                  >
                    <HugeiconsIcon icon={item.icon} size={19} />
                    <span className="min-w-0 flex-1">{item.title}</span>
                  </Link>
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-label={
                        isOpen ? "Fechar subopcoes" : "Abrir subopcoes"
                      }
                      onClick={() => toggleItem(item.href)}
                      className={cn(
                        "mr-2 flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground/70 transition-all duration-200 hover:bg-background/80",
                        isOpen && "rotate-180",
                        isActive &&
                          isOpen &&
                          "rotate-180 bg-background/65 text-sidebar-primary-foreground"
                      )}
                    >
                      <HugeiconsIcon icon={ArrowDown01Icon} size={13} />
                    </button>
                  ) : null}
                </div>

                {hasChildren ? (
                  <div
                    className={cn(
                      "submenu-panel ml-5 grid gap-1 border-l border-sidebar-border pl-3",
                      isOpen
                        ? "submenu-panel-open mt-1"
                        : "submenu-panel-closed"
                    )}
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => handleNavigate(child.href)}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-sidebar-foreground/65 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isChildActive &&
                              "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                          )}
                        >
                          <HugeiconsIcon icon={child.icon} size={16} />
                          <span>{child.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="mt-4 shrink-0 rounded-md border border-sidebar-border bg-background/60 p-3">
        <p className="text-xs font-semibold">Ambiente</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Configuracao generica ativa
        </p>
      </div>
    </div>
  )
}

function getParentHref(pathname: string) {
  return navItems.find(
    (item) =>
      "children" in item && item.children && pathname.startsWith(item.href)
  )?.href
}
