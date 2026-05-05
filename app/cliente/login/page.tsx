"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  LockPasswordIcon,
  Mail01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY,
  COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY,
  COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY,
  COMPANY_ICON_STORAGE_KEY,
} from "@/components/company/company-assets"
import { cn } from "@/lib/utils"

import {
  getDefaultPortalProfile,
  isPortalClientAuthenticated,
  readPortalProfile,
  setPortalClientAuthenticated,
} from "@/components/client-portal/portal-data"
import { useClientPortal } from "@/components/client-portal/portal-provider"

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

export default function ClienteLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { companyDisplayName, portalSettings, logoUrl } = useClientPortal()
  const [email, setEmail] = useState(() => {
    const profile = readPortalProfile() ?? getDefaultPortalProfile()
    return profile?.email ?? ""
  })
  const [phone, setPhone] = useState(() => {
    const profile = readPortalProfile() ?? getDefaultPortalProfile()
    return profile?.phone ?? ""
  })
  const [activeSlide, setActiveSlide] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const storedAssets = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        icon: "",
        carousel1: "",
        carousel2: "",
        carousel3: "",
      }
    }

    return {
      icon: window.localStorage.getItem(COMPANY_ICON_STORAGE_KEY) || "",
      carousel1:
        window.localStorage.getItem(COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY) || "",
      carousel2:
        window.localStorage.getItem(COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY) || "",
      carousel3:
        window.localStorage.getItem(COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY) || "",
    }
  }, [])

  const iconUrl = storedAssets.icon || portalSettings.iconUrl || ""
  const slides = useMemo(
    () => [
      {
        image: storedAssets.carousel1 || portalSettings.carouselImage1 || "",
        title: portalSettings.introTitle1 || "Atendimento premium",
        subtitle: portalSettings.introSubtitle1 || "Seu horario com praticidade.",
      },
      {
        image: storedAssets.carousel2 || portalSettings.carouselImage2 || "",
        title: portalSettings.introTitle2 || "Gestao simples",
        subtitle: portalSettings.introSubtitle2 || "Tudo da sua assinatura em um so lugar.",
      },
      {
        image: storedAssets.carousel3 || portalSettings.carouselImage3 || "",
        title: portalSettings.introTitle3 || "Plano e beneficios",
        subtitle: portalSettings.introSubtitle3 || "Acompanhe seus extras e descontos.",
      },
    ],
    [
      portalSettings.carouselImage1,
      portalSettings.carouselImage2,
      portalSettings.carouselImage3,
      portalSettings.introSubtitle1,
      portalSettings.introSubtitle2,
      portalSettings.introSubtitle3,
      portalSettings.introTitle1,
      portalSettings.introTitle2,
      portalSettings.introTitle3,
      storedAssets.carousel1,
      storedAssets.carousel2,
      storedAssets.carousel3,
    ]
  )

  const nextPath = useMemo(
    () => searchParams.get("next") || "/cliente",
    [searchParams]
  )

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    if (isPortalClientAuthenticated()) {
      router.replace(nextPath)
    }
  }, [nextPath, router])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const profile = readPortalProfile() ?? getDefaultPortalProfile()
    const expectedEmail = profile?.email?.trim().toLowerCase() ?? ""
    const expectedPhone = onlyDigits(profile?.phone ?? "")
    const inputEmail = email.trim().toLowerCase()
    const inputPhone = onlyDigits(phone)

    const emailOk = inputEmail.length > 0 && inputEmail === expectedEmail
    const phoneOk = inputPhone.length > 0 && inputPhone === expectedPhone

    if (!emailOk || !phoneOk) {
      setLoading(false)
      setError("Dados invalidos. Confira e tente novamente.")
      return
    }

    setPortalClientAuthenticated(true)
    router.replace(nextPath)
    router.refresh()
  }

  return (
    <main className="client-portal min-h-dvh bg-[var(--background)] p-3 sm:p-5">
      <section className="mx-auto grid min-h-[calc(100dvh-1.5rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-[oklch(0.857_0.1698_134.5554_/_0.45)] bg-background shadow-sm md:grid-cols-2">
        <aside className="relative hidden min-h-full md:block">
          {slides.map((slide, index) => (
            <div
              key={`${slide.title}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === activeSlide ? "opacity-100" : "opacity-0"
              )}
            >
              {slide.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(145deg,color-mix(in_oklch,var(--primary),white_62%)_0%,color-mix(in_oklch,var(--background),var(--primary)_10%)_56%,var(--background)_100%)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-2xl font-semibold text-white">{slide.title}</p>
                <p className="mt-1 text-sm text-white/90">{slide.subtitle}</p>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === activeSlide ? "w-6 bg-white" : "w-2 bg-white/55"
                )}
                aria-label={`Ver slide ${index + 1}`}
              />
            ))}
          </div>
        </aside>

        <div className="flex items-center p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                {logoUrl ? (
                  <span className="flex size-11 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt={companyDisplayName} className="h-full w-full object-cover" />
                  </span>
                ) : null}
                {iconUrl ? (
                  <span className="flex size-11 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconUrl} alt="" className="h-full w-full object-cover" />
                  </span>
                ) : null}
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Portal do cliente
              </p>
              <h1 className="mt-1 text-2xl font-semibold">Entrar</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Acesse sua area em {companyDisplayName}.
              </p>
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              <label className="grid gap-1 text-xs">
                E-mail
                <div className="relative">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 rounded-xl pl-9"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="grid gap-1 text-xs">
                Telefone
                <div className="relative">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-11 rounded-xl pl-9"
                    autoComplete="tel"
                    required
                  />
                </div>
              </label>

              {error ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-11 w-full gap-2"
                disabled={loading}
              >
                <HugeiconsIcon icon={LockPasswordIcon} size={16} />
                {loading ? "Entrando..." : "Entrar no portal"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
