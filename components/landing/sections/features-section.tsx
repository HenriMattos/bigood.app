import { Container } from "@/components/landing/ui/container"
import { features } from "@/components/landing/landing-data"
import { HugeiconsIcon } from "@hugeicons/react"

export function FeaturesSection() {
  return (
    <section className="section-space bg-white" id="recursos" aria-labelledby="features-heading">
      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <h2 id="features-heading" className="text-[clamp(24px,3vw,36px)] leading-[1.15] font-bold text-[var(--landing-primary-dark)]">
            Tudo que sua barbearia precisa
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-[var(--landing-muted)]">
            Cada recurso foi pensado para resolver um problema real. Nada de tela inútil.
          </p>
        </div>

        <div className="stagger-grid mx-auto mt-10 grid max-w-[960px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 6).map((feature) => (
            <div
              key={feature.title}
              className="shadow-card rounded-xl border border-[var(--landing-border)]/50 bg-white p-5"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-[var(--landing-accent)]/20 text-[var(--landing-primary)]">
                <HugeiconsIcon icon={feature.icon} size={20} />
              </div>
              <h3 className="mt-4 text-sm font-bold text-[var(--landing-primary-dark)]">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-5 text-[var(--landing-muted)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
