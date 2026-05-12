"use client"

import {
  InstagramIcon,
  Location01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { BarberCompany } from "@/components/client-portal/client-portal-data"
import { useDragScroll } from "@/components/client-portal/use-drag-scroll"

export function ClientPortalHeader({
  company,
  userName,
  onAuthClick,
}: {
  company: BarberCompany
  userName?: string
  onAuthClick?: () => void
}) {
  const infoCarousel = useDragScroll<HTMLDivElement>()
  const initials = company.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header>
      <div className="client-portal-banner">
        {company.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={company.bannerUrl}
            alt={`Banner ${company.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_10%,rgba(216,242,58,0.34),transparent_34%),linear-gradient(135deg,#0a3f28_0%,#0f5a35_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-[#0a3f28]/70" />
        <div className="absolute right-5 bottom-5 flex justify-end gap-2">
          {userName ? (
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 backdrop-blur">
              <span className="size-5 rounded-full bg-[var(--client-accent,#d8f23a)] text-center text-[10px] font-black leading-5 text-[var(--client-primary-dark,#0a3f28)]">
                {userName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[100px] truncate text-[11px] font-black tracking-[0.08em] text-white uppercase">
                {userName.split(" ")[0]}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAuthClick}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[11px] font-black tracking-[0.08em] text-white uppercase backdrop-blur transition hover:bg-white/20 active:scale-95"
            >
              Entrar
            </button>
          )}
          <p className="inline-flex rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[11px] font-black tracking-[0.08em] text-white uppercase backdrop-blur">
            Portal do cliente
          </p>
        </div>
      </div>

      <div className="relative -mt-12 px-5">
        <div className="client-portal-logo">
          {company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>

      <div className="px-5 pt-4">
        <h1 className="text-2xl leading-7 font-black text-[var(--client-primary-dark,#0a3f28)]">
          {company.name}
        </h1>
        <p className="pt-1 text-sm leading-5 font-medium text-[#6f8178]">
          {company.slogan}
        </p>

        <div className="client-scroll-frame mt-4">
          <div
            {...infoCarousel}
            className="client-carousel flex gap-2 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {company.address && (
              <InfoPill icon={Location01Icon} label={company.address} />
            )}
            {company.whatsapp && (
              <InfoPill icon={SmartPhone01Icon} label={company.whatsapp} />
            )}
            {company.instagram && (
              <InfoPill icon={InstagramIcon} label={`@${company.instagram}`} />
            )}
            {company.openingHours && (
              <InfoPill icon={SmartPhone01Icon} label={company.openingHours} />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function InfoPill({
  icon,
  label,
}: {
  icon: typeof Location01Icon
  label: string
}) {
  return (
    <span className="inline-flex min-w-max items-center gap-1.5 rounded-full border border-[var(--client-border,#d6e2db)] bg-white px-3 py-2 text-xs font-bold text-[var(--client-primary-dark,#0a3f28)]">
      <HugeiconsIcon icon={icon} size={15} aria-hidden />
      {label}
    </span>
  )
}
