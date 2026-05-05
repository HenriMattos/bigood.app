"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Clock01Icon,
  CrownIcon,
  MapsLocation01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { toDateInputValue } from "@/components/admin/database"
import { Button } from "@/components/ui/button"
import { COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY } from "@/components/company/company-assets"

import { formatCurrency, formatShortDate } from "./booking-logic"
import { useClientPortal, useMergedAppointments } from "./portal-provider"

function HeroCarousel({
  urls,
  titles,
}: {
  urls: string[]
  titles: string[]
}) {
  const slides = urls
    .map((url, i) => ({ url: url.trim(), title: titles[i] }))
    .filter((s) => s.url)

  if (!slides.length) return null

  return (
    <div className="-mx-1 mb-6 flex gap-3 overflow-x-auto pb-2">
      {slides.map((slide, index) => (
        <div
          key={`${slide.url}-${index}`}
          className="relative h-28 w-[min(78vw,240px)] shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-sm sm:h-32"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.url}
            alt={slide.title || "Destaque"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          {slide.title ? (
            <p className="absolute bottom-2 left-2 right-2 text-xs font-medium text-foreground">
              {slide.title}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function PortalHomeView() {
  const {
    portalSettings,
    subscription,
    currentPlan,
    session,
    companyDisplayName,
  } = useClientPortal()
  const merged = useMergedAppointments()
  const [storedCarousel1, setStoredCarousel1] = useState("")

  useEffect(() => {
    queueMicrotask(() => {
      setStoredCarousel1(
        window.localStorage.getItem(COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY) || ""
      )
    })
  }, [])

  const todayStr = useMemo(() => toDateInputValue(new Date()), [])

  const activeAppointments = useMemo(
    () => merged.filter((a) => !session.canceledIds.includes(a.id)),
    [merged, session.canceledIds]
  )

  const todayAppointments = useMemo(() => {
    return activeAppointments
      .filter((a) => a.date === todayStr)
      .sort((a, b) => a.start.localeCompare(b.start))
  }, [activeAppointments, todayStr])

  const nextAppointment = useMemo(() => {
    const sorted = [...activeAppointments].sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.start.localeCompare(b.start)
    )
    const now = new Date()
    const today = toDateInputValue(now)
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    for (const ev of sorted) {
      if (ev.date > today) return ev
      if (ev.date < today) continue
      const [h, m] = ev.start.split(":").map(Number)
      if (h * 60 + m >= nowMinutes) return ev
    }
    return sorted.find((ev) => ev.date >= today) ?? sorted[0]
  }, [activeAppointments])

  const carouselUrls = [
    storedCarousel1 || portalSettings.carouselImage1 || "",
    portalSettings.carouselImage2 || "",
    portalSettings.carouselImage3 || "",
  ]

  const carouselTitles = [
    portalSettings.introTitle1 || "",
    portalSettings.introTitle2 || "",
    portalSettings.introTitle3 || "",
  ]

  const address = portalSettings.address
  const mapsUrl = address?.mapsUrl

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:max-w-3xl lg:max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {companyDisplayName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo da sua conta na barbeararia
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="client-card p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Hoje
              </p>
              <p className="mt-1 text-lg font-semibold">
                {formatShortDate(todayStr)}
              </p>
            </div>
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={22}
              className="shrink-0 text-primary"
            />
          </div>
          {todayAppointments.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhum horário para hoje.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {todayAppointments.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                >
                  <span className="min-w-0">
                    <span className="font-medium">{ev.detail}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {ev.start} – {ev.end} · {ev.barber}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
            <Link href="/cliente/agendar">Agendar horário</Link>
          </Button>
        </section>

        <section className="client-card p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Assinatura
              </p>
              <p className="mt-1 text-lg font-semibold">
                {subscription ? subscription.plan : "Sem plano"}
              </p>
            </div>
            <HugeiconsIcon
              icon={CrownIcon}
              size={22}
              className="shrink-0 text-primary"
            />
          </div>
          {subscription ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium">{subscription.status}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Valor</dt>
                <dd className="font-medium">
                  {formatCurrency(subscription.value)}/mês
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Próxima cobrança</dt>
                <dd className="font-medium">{subscription.nextCharge}</dd>
              </div>
              {currentPlan ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Limite mensal</dt>
                  <dd className="font-medium">
                    {currentPlan.servicesLimit} serviços
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Você ainda não tem um plano ativo.
            </p>
          )}
          <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
            <Link href="/cliente/planos">
              {subscription ? "Gerenciar plano" : "Ver planos"}
            </Link>
          </Button>
        </section>
      </div>

      <section className="client-card mt-4 p-5">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} size={20} className="text-primary" />
          <h2 className="text-sm font-semibold">Próximo horário</h2>
        </div>
        {nextAppointment ? (
          <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-3 text-sm">
            <p className="font-medium">{nextAppointment.detail}</p>
            <p className="mt-1 text-muted-foreground">
              {formatShortDate(nextAppointment.date)} · {nextAppointment.start}{" "}
              · {nextAppointment.barber}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum agendamento futuro na lista.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" asChild>
            <Link href="/cliente/agendamentos">Ver todos</Link>
          </Button>
        </div>
      </section>

      <section className="client-card mt-4 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Atalhos
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Link href="/cliente/agendar">
            <Button className="green-shine h-auto w-full justify-between gap-2 py-3 text-left text-sm font-semibold">
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar03Icon} size={18} />
                Agendar
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
          <Link href="/cliente/agendamentos">
            <Button
              variant="outline"
              className="h-auto w-full justify-between gap-2 py-3 text-left text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} size={18} />
                Horários
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
          <Link href="/cliente/planos">
            <Button
              variant="outline"
              className="h-auto w-full justify-between gap-2 py-3 text-left text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <HugeiconsIcon icon={CrownIcon} size={18} />
                Plano
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <HeroCarousel urls={carouselUrls} titles={carouselTitles} />

      {address ? (
        <section className="client-card mt-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Endereço</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {address.street}, {address.number} — {address.neighborhood},{" "}
                {address.city}/{address.state} · CEP {address.zip}
              </p>
            </div>
            {mapsUrl ? (
              <Button variant="outline" size="sm" className="shrink-0" asChild>
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  <HugeiconsIcon icon={MapsLocation01Icon} size={16} />
                  Mapa
                </a>
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  )
}
