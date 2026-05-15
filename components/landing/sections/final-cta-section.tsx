import { Container } from "@/components/landing/ui/container"
import { LandingLinkButton } from "@/components/landing/ui/landing-link-button"
import { SectionEyebrow } from "@/components/landing/ui/section-header"

const darkButtonClass =
  "h-10 rounded-full border-[var(--landing-primary-dark)] bg-[var(--landing-primary-dark)] px-4 text-sm font-extrabold text-white hover:bg-[var(--landing-primary)]"

export function FinalCtaSection() {
  return (
    <section
      className="landing-guide-section section-has-glow section-space"
      aria-labelledby="cta-heading"
    >
      <Container>
        <div className="grid gap-6 rounded-[28px] border border-[rgba(11,51,36,0.12)] bg-[var(--landing-accent)] p-7 text-[var(--landing-primary-dark)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <SectionEyebrow>Sistema completo</SectionEyebrow>
            <h2
              id="cta-heading"
              className="mt-4 max-w-[660px] text-[clamp(30px,4vw,50px)] leading-[1] font-black"
            >
              Agende uma demonstração com o time comercial.
            </h2>
          </div>
<LandingLinkButton href="#demonstracao" className={darkButtonClass}>
            Agendar demonstração
          </LandingLinkButton>
        </div>
      </Container>
    </section>
  )
}
