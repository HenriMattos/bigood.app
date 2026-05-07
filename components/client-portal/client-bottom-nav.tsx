"use client"

import {
  Calendar03Icon,
  CreditCardIcon,
  Home01Icon,
  PlusSignIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export type ClientPortalTab = "home" | "appointments" | "plans" | "profile"

const navItems = [
  { id: "home", label: "Inicio", icon: Home01Icon },
  { id: "appointments", label: "Agenda", icon: Calendar03Icon },
  { id: "book", label: "Agendar", icon: PlusSignIcon, isMain: true },
  { id: "plans", label: "Planos", icon: CreditCardIcon },
  { id: "profile", label: "Perfil", icon: UserIcon },
] as const

export function ClientBottomNav({
  activeTab,
  onTabChange,
  onBook,
}: {
  activeTab: ClientPortalTab
  onTabChange: (tab: ClientPortalTab) => void
  onBook: () => void
}) {
  return (
    <nav className="client-bottom-nav" aria-label="Navegacao do portal">
      <div className="flex items-center justify-between rounded-full border border-[rgba(11,51,36,0.14)] bg-white/92 px-3 py-2 backdrop-blur-xl">
        {navItems.map((item) => {
          if (item.id === "book") {
            return (
              <button
                key={item.id}
                type="button"
                onClick={onBook}
                className="-mt-8 grid size-14 place-items-center rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--client-accent,#d8f23a)] text-[var(--client-primary-dark,#0a3f28)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] transition hover:bg-[var(--client-accent-hover,#c7e62f)] active:scale-95"
                aria-label="Agendar"
              >
                <HugeiconsIcon icon={item.icon} size={24} aria-hidden />
              </button>
            )
          }

          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "grid min-h-11 min-w-0 flex-1 place-items-center gap-1 rounded-full px-1 text-[10px] font-black transition active:scale-95",
                isActive
                  ? "text-[var(--client-primary-dark,#0a3f28)]"
                  : "text-[var(--client-muted,#6f8178)]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full",
                  isActive && "bg-[var(--client-accent-soft,#eef8b8)]"
                )}
              >
                <HugeiconsIcon icon={item.icon} size={19} aria-hidden />
              </span>
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
