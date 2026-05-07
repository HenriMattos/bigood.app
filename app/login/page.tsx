import Link from "next/link"
import { Suspense } from "react"
import Image from "next/image"
import {
  Calendar03Icon,
  CreditCardIcon,
  DashboardBrowsingIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import { AuthCard } from "@/components/login/auth-card"
import { Button } from "@/components/ui/button"
import { LANDING_IMAGES } from "@/lib/marketing-assets"

export default function LoginPage() {
  return (
    <main className="organic-auth h-dvh overflow-y-auto bg-[var(--landing-background)] text-[var(--landing-primary-dark)]">
      <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex shrink-0 items-center justify-between gap-4 py-2">
          <BrandMark />
          <Button
            variant="outline"
            className="h-10 rounded-full border-[var(--landing-border-strong)] px-4 text-sm font-bold text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)]"
            asChild
          >
            <Link href="/">Voltar</Link>
          </Button>
        </header>

        <section className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="relative hidden min-h-[560px] overflow-hidden rounded-[32px] bg-[var(--landing-primary-dark)] shadow-[var(--landing-shadow-card)] lg:block">
            <Image
              src={LANDING_IMAGES.previewBarbershop}
              alt="Barbearia moderna usando gestao Bigood"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,47,34,0.9),rgba(8,47,34,0.62),rgba(8,47,34,0.28))]" />
            <div className="pointer-events-none absolute top-24 -left-10 h-56 w-80 rotate-[-16deg] rounded-full border-[8px] border-[var(--landing-accent)] border-r-transparent border-b-transparent opacity-80" />
            <div className="pointer-events-none absolute bottom-4 left-6 text-[clamp(74px,13vw,170px)] font-black tracking-[-0.08em] text-white/10 uppercase">
              Bigood
            </div>

            <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-8 text-white lg:p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                <HugeiconsIcon
                  icon={DashboardBrowsingIcon}
                  size={17}
                  aria-hidden
                />
                Painel do barbeiro
              </div>

              <div className="max-w-[650px]">
                <h1 className="text-[clamp(42px,6vw,76px)] leading-[0.95] font-extrabold tracking-[-0.05em] text-balance">
                  Sua conta, plano e dashboard em um so lugar.
                </h1>
                <p className="mt-5 max-w-[560px] text-base leading-7 text-white/80 md:text-lg">
                  Entre, assine um plano e acesse o painel da sua barbearia sem
                  trocar de sistema.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <LoginPill icon={Calendar03Icon} title="Agenda e caixa" />
                <LoginPill icon={CreditCardIcon} title="Assinatura ativa" />
                <LoginPill icon={DashboardBrowsingIcon} title="Painel unico" />
              </div>
            </div>
          </aside>

          <section className="rounded-[32px] border border-[var(--landing-border)] bg-white p-5 shadow-[var(--landing-shadow-card)] sm:p-8 lg:p-10">
            <Suspense fallback={null}>
              <AuthCard />
            </Suspense>
          </section>
        </section>
      </div>
    </main>
  )
}

function LoginPill({
  icon,
  title,
}: {
  icon: typeof Calendar03Icon
  title: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/16 bg-white/12 px-3 py-2.5 shadow-sm backdrop-blur">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]">
        <HugeiconsIcon icon={icon} size={16} aria-hidden="true" />
      </span>
      <span className="truncate text-sm font-bold text-white">{title}</span>
    </div>
  )
}
