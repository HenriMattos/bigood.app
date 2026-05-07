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
import { useEffect, useMemo, useRef, useState } from "react"
import { database } from "@/components/admin/database"
import { COMPANY_LOGO_STORAGE_KEY } from "@/components/company/company-assets"

import { navItems } from "@/components/admin/nav-items"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BIGOOD_MARK_DARK } from "@/lib/brand-assets"
import { cn } from "@/lib/utils"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchIndex, setSearchIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const mobileSearchRef = useRef<HTMLDivElement | null>(null)
  const [companyData, setCompanyData] = useState({
    tradeName: database.company.tradeName,
    logoUrl: database.company.logoUrl || "",
  })
  const searchItems = useMemo(() => buildSearchItems(), [])
  const searchResults = useMemo(() => {
    const query = normalizeText(searchQuery)

    if (!query) {
      return searchItems.slice(0, 8)
    }

    return searchItems
      .filter((item) => normalizeText(item.searchBlob).includes(query))
      .slice(0, 8)
  }, [searchItems, searchQuery])
  const activeSearchIndex = searchResults.length
    ? Math.min(searchIndex, searchResults.length - 1)
    : 0

  useEffect(() => {
    function sync() {
      setCompanyData({
        tradeName: database.company.tradeName,
        logoUrl:
          window.localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) ||
          database.company.logoUrl ||
          "",
      })
    }

    window.requestAnimationFrame(() => {
      sync()
      setMounted(true)
    })
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("storage", sync)
    }
  }, [])

  useEffect(() => {
    if (!searchOpen) return

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      const insideDesktop = searchRef.current?.contains(target)
      const insideMobile = mobileSearchRef.current?.contains(target)

      if (!insideDesktop && !insideMobile) {
        setSearchOpen(false)
      }
    }

    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [searchOpen])

  const activeItem =
    navItems.find((item) => pathname.startsWith(item.href)) ?? navItems[0]

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.dispatchEvent(new Event("bigood_auth_sync"))
    router.replace("/")
    router.refresh()
  }

  function navigateFromSearch(href: string) {
    router.push(href)
    setSearchOpen(false)
    setSearchQuery("")
    setSearchIndex(0)
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

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Buscar"
                onClick={() => setSearchOpen((current) => !current)}
              >
                <HugeiconsIcon icon={Search01Icon} size={18} />
              </Button>

              <div
                ref={searchRef}
                className="relative hidden w-full max-w-xs md:block xl:max-w-sm"
              >
                <label className="flex h-9 w-full items-center gap-2 rounded-full border bg-background px-3 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Search01Icon} size={17} />
                  <input
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                      setSearchQuery(event.target.value)
                      setSearchOpen(true)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault()
                        setSearchIndex((current) =>
                          Math.min(
                            current + 1,
                            Math.max(searchResults.length - 1, 0)
                          )
                        )
                        return
                      }
                      if (event.key === "ArrowUp") {
                        event.preventDefault()
                        setSearchIndex((current) => Math.max(current - 1, 0))
                        return
                      }
                      if (event.key === "Escape") {
                        setSearchOpen(false)
                        return
                      }
                      if (event.key === "Enter" && searchResults.length) {
                        event.preventDefault()
                        navigateFromSearch(
                          searchResults[activeSearchIndex]?.href ??
                            searchResults[0].href
                        )
                      }
                    }}
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    placeholder="Buscar cliente, servico, pagina..."
                  />
                </label>

                {searchOpen ? (
                  <div className="absolute top-11 z-40 w-full rounded-xl border bg-background p-1 shadow-lg">
                    {searchResults.length ? (
                      <ul className="max-h-72 overflow-y-auto">
                        {searchResults.map((item, index) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => navigateFromSearch(item.href)}
                              className={cn(
                                "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left",
                                index === activeSearchIndex
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                              )}
                            >
                              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                                <HugeiconsIcon icon={Search01Icon} size={12} />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">
                                  {item.title}
                                </span>
                                <span className="block truncate text-xs">
                                  {item.subtitle}
                                </span>
                              </span>
                              {item.actionLabel ? (
                                <span className="ml-auto inline-flex shrink-0 items-center rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                  {item.actionLabel}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-2 py-3 text-xs text-muted-foreground">
                        Nenhum resultado encontrado.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

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

            {searchOpen ? (
              <div
                ref={mobileSearchRef}
                className="admin-container pb-2 md:hidden"
              >
                <div className="relative">
                  <label className="flex h-10 w-full items-center gap-2 rounded-full border bg-background px-3 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Search01Icon} size={17} />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value)
                        setSearchOpen(true)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault()
                          setSearchIndex((current) =>
                            Math.min(
                              current + 1,
                              Math.max(searchResults.length - 1, 0)
                            )
                          )
                          return
                        }
                        if (event.key === "ArrowUp") {
                          event.preventDefault()
                          setSearchIndex((current) => Math.max(current - 1, 0))
                          return
                        }
                        if (event.key === "Escape") {
                          setSearchOpen(false)
                          return
                        }
                        if (event.key === "Enter" && searchResults.length) {
                          event.preventDefault()
                          navigateFromSearch(
                            searchResults[activeSearchIndex]?.href ??
                              searchResults[0].href
                          )
                        }
                      }}
                      className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                      placeholder="Buscar cliente, servico, pagina..."
                    />
                  </label>

                  <div className="absolute top-11 z-40 w-full rounded-xl border bg-background p-1 shadow-lg">
                    {searchResults.length ? (
                      <ul className="max-h-72 overflow-y-auto">
                        {searchResults.map((item, index) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => navigateFromSearch(item.href)}
                              className={cn(
                                "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left",
                                index === activeSearchIndex
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                              )}
                            >
                              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                                <HugeiconsIcon icon={Search01Icon} size={12} />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">
                                  {item.title}
                                </span>
                                <span className="block truncate text-xs">
                                  {item.subtitle}
                                </span>
                              </span>
                              {item.actionLabel ? (
                                <span className="ml-auto inline-flex shrink-0 items-center rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                  {item.actionLabel}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-2 py-3 text-xs text-muted-foreground">
                        Nenhum resultado encontrado.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
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

type SearchItem = {
  id: string
  title: string
  subtitle: string
  href: string
  searchBlob: string
  actionLabel?: string
  kind?: "acao" | "pagina" | "dado"
}

function buildSearchItems(): SearchItem[] {
  const navigationItems = navItems.flatMap((item) => {
    const parent: SearchItem = {
      id: `nav:${item.href}`,
      title: item.title,
      subtitle: item.description,
      href: item.href,
      searchBlob: `${item.title} ${item.description} ${item.href}`,
      kind: "pagina",
    }

    if (!("children" in item) || !item.children?.length) return [parent]

    const children = item.children.map((child) => ({
      id: `nav:${child.href}`,
      title: child.title,
      subtitle: item.title,
      href: child.href,
      searchBlob: `${child.title} ${item.title} ${child.href}`,
      kind: "pagina" as const,
    }))

    return [parent, ...children]
  })

  const clientItems: SearchItem[] = database.clients
    .slice(0, 20)
    .map((client) => ({
      id: `client:${client.id}`,
      title: client.name,
      subtitle: `Cliente | ${client.phone}`,
      href: "/clientes/listagem",
      searchBlob: `${client.name} ${client.phone} ${client.email ?? ""}`,
      kind: "dado",
    }))

  const serviceItems: SearchItem[] = database.services
    .filter((service) => !service.hidden)
    .slice(0, 20)
    .map((service) => ({
      id: `service:${service.id}`,
      title: service.name,
      subtitle: "Servico",
      href: "/servicos/listagem",
      searchBlob: `${service.name} ${service.category} ${service.professionals}`,
      kind: "dado" as const,
    }))

  const professionalItems: SearchItem[] = database.professionals
    .slice(0, 20)
    .map((pro) => ({
      id: `pro:${pro.id}`,
      title: pro.name,
      subtitle: "Profissional",
      href: "/profissionais/gerenciar",
      searchBlob: `${pro.name} ${pro.role} ${pro.commission}`,
      kind: "dado",
    }))

  const quickActionItems: SearchItem[] = [
    {
      id: "action:new-appointment",
      title: "Novo agendamento",
      subtitle: "Acao rapida | Agenda",
      href: "/agenda",
      searchBlob:
        "novo agendamento agendar agendamento criar agendamento nova reserva agenda",
      actionLabel: "Agendar",
      kind: "acao",
    },
    {
      id: "action:new-client",
      title: "Cadastrar cliente",
      subtitle: "Acao rapida | Clientes",
      href: "/clientes/cadastrar",
      searchBlob: "novo cliente cadastrar cliente criar cliente",
      actionLabel: "Cadastrar",
      kind: "acao",
    },
    {
      id: "action:new-service",
      title: "Cadastrar servico",
      subtitle: "Acao rapida | Servicos",
      href: "/servicos/cadastrar",
      searchBlob: "novo servico cadastrar servico criar servico",
      actionLabel: "Cadastrar",
      kind: "acao",
    },
    {
      id: "action:new-professional",
      title: "Cadastrar profissional",
      subtitle: "Acao rapida | Profissionais",
      href: "/profissionais/cadastrar",
      searchBlob: "novo profissional cadastrar profissional criar profissional",
      actionLabel: "Cadastrar",
      kind: "acao",
    },
    {
      id: "action:new-plan",
      title: "Criar plano",
      subtitle: "Acao rapida | Planos",
      href: "/planos/criar",
      searchBlob: "novo plano criar plano cadastrar plano assinatura",
      actionLabel: "Criar",
      kind: "acao",
    },
    {
      id: "action:open-cash",
      title: "Abrir caixa",
      subtitle: "Acao rapida | Caixa",
      href: "/caixa",
      searchBlob: "abrir caixa iniciar caixa novo caixa",
      actionLabel: "Abrir",
      kind: "acao",
    },
    {
      id: "action:finance",
      title: "Receber pagamento",
      subtitle: "Acao rapida | Financeiro",
      href: "/financeiro",
      searchBlob: "receber pagamento cobrar pagamento nova cobranca",
      actionLabel: "Receber",
      kind: "acao",
    },
    {
      id: "action:comandas",
      title: "Nova comanda",
      subtitle: "Acao rapida | Comandas",
      href: "/caixa/comandas",
      searchBlob: "nova comanda abrir comanda criar comanda",
      actionLabel: "Abrir",
      kind: "acao",
    },
  ]

  return [
    ...quickActionItems,
    ...navigationItems,
    ...clientItems,
    ...serviceItems,
    ...professionalItems,
  ]
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
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
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BIGOOD_MARK_DARK}
              alt="Bigood"
              className="h-full w-full object-contain"
            />
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
