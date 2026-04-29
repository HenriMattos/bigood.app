import {
  ChartIncreaseIcon,
  ShieldKeyIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { LoginForm } from "@/components/login/login-form"

export default function Page() {
  return (
    <main className="h-dvh overflow-y-auto bg-[linear-gradient(135deg,var(--background)_0%,color-mix(in_oklch,var(--background),var(--primary)_8%)_52%,color-mix(in_oklch,var(--primary),white_42%)_100%)] text-foreground">
      <section className="flex min-h-full items-center justify-center p-3 sm:p-5 lg:p-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-background shadow-2xl min-[680px]:grid-cols-[minmax(0,0.82fr)_minmax(20rem,1fr)]">
          <aside className="min-w-0 bg-[radial-gradient(circle_at_20%_12%,color-mix(in_oklch,var(--primary),white_70%)_0%,transparent_30%),linear-gradient(145deg,color-mix(in_oklch,var(--background),var(--primary)_10%)_0%,var(--background)_100%)] p-5 sm:p-7 lg:p-10">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-sm sm:text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-foreground">
                <HugeiconsIcon icon={ChartIncreaseIcon} size={15} />
              </span>
              <span className="truncate">Painel operacional seguro</span>
            </div>

            <div className="mt-7 space-y-3 sm:mt-9 lg:mt-12">
              <h1 className="max-w-xl text-3xl leading-none font-semibold tracking-normal text-balance sm:text-4xl lg:text-6xl">
                Entre fácil.
                <span className="block text-primary">Decida melhor.</span>
              </h1>
              <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base lg:text-lg lg:leading-8">
                Acesse clientes, assinaturas, agenda, caixa e indicadores em um
                painel simples para a rotina da empresa.
              </p>
            </div>

            <div className="mt-6 grid gap-2 min-[680px]:grid-cols-1 sm:grid-cols-3 lg:mt-9 lg:grid-cols-3">
              <FeaturePill icon={ZapIcon} title="Rápido" />
              <FeaturePill icon={ShieldKeyIcon} title="Seguro" />
              <FeaturePill icon={ChartIncreaseIcon} title="Claro" />
            </div>
          </aside>

          <section className="flex min-w-0 items-center bg-background p-5 sm:p-7 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <LoginForm />
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function FeaturePill({ icon, title }: { icon: typeof ZapIcon; title: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border bg-background/70 px-3 py-2.5 shadow-sm">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-foreground">
        <HugeiconsIcon icon={icon} size={16} />
      </span>
      <span className="truncate text-sm font-semibold">{title}</span>
    </div>
  )
}
