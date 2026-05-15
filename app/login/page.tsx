import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

import { AuthCard } from "@/components/login/auth-card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BIGOOD_LOGO } from "@/lib/brand-assets"

const authCoverImage = "/images/landing/devices/login-page-auth.png"

export default function LoginPage() {
  return (
    <main className="landing-page organic-auth h-dvh overflow-hidden bg-[var(--landing-border)] text-[var(--landing-primary-dark)]">
      <ScrollArea className="h-full">
        <div className="flex h-dvh flex-col">
          <header className="flex shrink-0 gap-px border-b border-[var(--landing-border)] bg-[var(--landing-border)]">
            <div className="landing-frame-side hidden rounded-br-lg bg-white lg:block" />
            <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between rounded-b-lg bg-white px-5 sm:px-8 lg:h-[72px] lg:px-10">
              <Link href="/" className="inline-flex min-w-0 flex-col">
                <Image
                  src={BIGOOD_LOGO}
                  alt="Bigood"
                  width={320}
                  height={92}
                  priority
                  className="h-7 w-auto sm:h-8"
                />
              </Link>
              <Button
                variant="outline"
                className="h-9 rounded-full border-[var(--landing-border-strong)] px-4 text-sm font-bold text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)]"
                asChild
              >
                <Link href="/">Voltar</Link>
              </Button>
            </div>
            <div className="landing-frame-side hidden rounded-bl-lg bg-white lg:block" />
          </header>

          <section className="flex min-h-0 flex-1 gap-px border-b border-[var(--landing-border)] bg-[var(--landing-border)]">
            <div className="landing-frame-side hidden rounded-tr-lg bg-white lg:block" />
            <div className="mx-auto grid h-full w-full max-w-[1200px] min-w-0 overflow-hidden rounded-t-lg bg-white lg:grid-cols-[1fr_0.92fr]">
              <div className="relative hidden min-h-0 overflow-hidden bg-white lg:block">
                <div className="absolute top-1/2 left-1/2 h-[64%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,242,58,0.38)_0%,rgba(216,242,58,0.18)_42%,rgba(11,51,36,0.08)_72%,transparent_100%)] blur-2xl" />
                <div className="absolute top-1/2 left-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative h-full w-full motion-safe:animate-[auth-float_5.8s_ease-in-out_infinite]">
                    <Image
                      src={authCoverImage}
                      alt="Tela de acesso Bigood"
                      width={1200}
                      height={900}
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 items-start justify-center bg-white px-5 pt-8 pb-10 sm:px-8 sm:pt-10 lg:items-center lg:px-12 lg:py-6 xl:px-16">
                <Suspense fallback={null}>
                  <AuthCard />
                </Suspense>
              </div>
            </div>
            <div className="landing-frame-side hidden rounded-tl-lg bg-white lg:block" />
          </section>

          <section className="hidden h-[72px] shrink-0 gap-px border-b border-[var(--landing-border)] bg-[var(--landing-border)] lg:flex">
            <div className="landing-frame-side bg-white" />
            <div className="mx-auto h-full w-full max-w-[1200px] bg-white" />
            <div className="landing-frame-side bg-white" />
          </section>
        </div>
      </ScrollArea>
    </main>
  )
}
