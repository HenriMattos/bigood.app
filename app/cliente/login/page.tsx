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
  writePortalProfile,
} from "@/components/client-portal/portal-data"
import { useClientPortal } from "@/components/client-portal/portal-provider"

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

const BASE_CAROUSEL_IMAGES = [
  "/1mg/1.png",
  "/1mg/2.png",
  "/1mg/3.png",
] as const

export default function ClienteLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { companyDisplayName, portalSettings, logoUrl } = useClientPortal()
  const [authMode, setAuthMode] = useState<"entrar" | "cadastrar">("entrar")
  const [name, setName] = useState(() => {
    const profile = readPortalProfile() ?? getDefaultPortalProfile()
    return profile?.name ?? ""
  })
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
        image:
          storedAssets.carousel1 ||
          portalSettings.carouselImage1 ||
          BASE_CAROUSEL_IMAGES[0],
        title: portalSettings.introTitle1 || "Atendimento premium",
        subtitle: portalSettings.introSubtitle1 || "Seu horario com praticidade.",
      },
      {
        image:
          storedAssets.carousel2 ||
          portalSettings.carouselImage2 ||
          BASE_CAROUSEL_IMAGES[1],
        title: portalSettings.introTitle2 || "Gestao simples",
        subtitle:
          portalSettings.introSubtitle2 || "Tudo da sua assinatura em um so lugar.",
      },
      {
        image:
          storedAssets.carousel3 ||
          portalSettings.carouselImage3 ||
          BASE_CAROUSEL_IMAGES[2],
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

    if (authMode === "entrar") {
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
    } else {
      const inputName = name.trim()
      const inputEmail = email.trim().toLowerCase()
      const inputPhone = phone.trim()
      const phoneDigits = onlyDigits(inputPhone)
      const defaultProfile = getDefaultPortalProfile()

      if (!inputName || !inputEmail || phoneDigits.length < 10) {
        setLoading(false)
        setError("Preencha nome, e-mail e telefone validos.")
        return
      }

      writePortalProfile({
        id: defaultProfile?.id ?? Date.now(),
        name: inputName,
        email: inputEmail,
        phone: inputPhone,
      })
    }

    setPortalClientAuthenticated(true)
    router.replace(nextPath)
    router.refresh()
  }

  return (
    <main className="client-portal h-dvh overflow-y-auto bg-[linear-gradient(135deg,var(--background)_0%,color-mix(in_oklch,var(--background),var(--primary)_8%)_52%,color-mix(in_oklch,var(--primary),white_42%)_100%)] text-foreground dark:bg-background">
      <section className="flex min-h-full items-center justify-center p-3 sm:p-5 lg:p-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[oklch(0.857_0.1698_134.5554_/_0.45)] bg-background shadow-2xl dark:border-border dark:bg-[oklch(0.1980_0.0300_264.6600)] dark:shadow-none min-[680px]:grid-cols-[minmax(0,0.82fr)_minmax(20rem,1fr)]">
          <aside className="relative min-w-0 overflow-hidden bg-background p-4 dark:bg-[oklch(0.1980_0.0300_264.6600)] sm:p-7 lg:p-10">
            <div className="mx-auto w-full max-w-2xl">
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
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
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(145deg,color-mix(in_oklch,var(--primary),white_62%)_0%,color-mix(in_oklch,var(--background),var(--primary)_10%)_56%,var(--background)_100%)] dark:bg-[linear-gradient(145deg,oklch(0.44_0.05_252)_0%,oklch(0.3_0.05_255)_48%,oklch(0.22_0.03_258)_100%)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-lg font-semibold text-white sm:text-xl">{slide.title}</p>
                    <p className="mt-1 text-xs text-white/90 sm:text-sm">{slide.subtitle}</p>
                  </div>
                </div>
              ))}
                <div className="relative h-[220px] w-full min-[420px]:h-[260px] min-[680px]:h-[420px] lg:h-[520px]" />
                {null}
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 items-center bg-background p-5 sm:p-7 lg:p-10">
            <div className="mx-auto w-full max-w-md">
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
                <p className="text-sm font-medium text-primary">Acesso ao sistema</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {authMode === "entrar" ? "Entrar no portal" : "Cadastrar no portal"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Acesse sua area em {companyDisplayName}.
                </p>
              </div>

              <div className="mb-4 rounded-3xl border border-border bg-muted/35 p-1">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("entrar")
                      setError("")
                    }}
                    className={cn(
                      "h-10 rounded-3xl text-sm font-medium transition-colors",
                      authMode === "entrar"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("cadastrar")
                      setError("")
                    }}
                    className={cn(
                      "h-10 rounded-3xl text-sm font-medium transition-colors",
                      authMode === "cadastrar"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Cadastrar
                  </button>
                </div>
              </div>

              <form className="space-y-3" onSubmit={onSubmit}>
                {authMode === "cadastrar" ? (
                  <label className="grid gap-1 text-xs">
                    Nome completo
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-11 rounded-xl"
                      autoComplete="name"
                      required
                    />
                  </label>
                ) : null}

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
                  {loading
                    ? authMode === "entrar"
                      ? "Entrando..."
                      : "Cadastrando..."
                    : authMode === "entrar"
                      ? "Entrar no portal"
                      : "Cadastrar e entrar"}
                </Button>
              </form>

              <p className="mt-5 rounded-xl border bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">
                {authMode === "entrar"
                  ? "Acesso liberado apenas para clientes cadastrados."
                  : "Crie seu acesso para acompanhar planos e agendamentos."}
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
