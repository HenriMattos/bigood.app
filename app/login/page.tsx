import Link from "next/link"
import { Suspense } from "react"
import Image from "next/image"
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

        <div className="flex flex-1 items-center justify-center py-6">
          <section className="w-full max-w-md rounded-[32px] border border-[var(--landing-border)] bg-white p-5 shadow-[var(--landing-shadow-card)] sm:p-8 lg:p-10">
            <Suspense fallback={null}>
              <AuthCard />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}
