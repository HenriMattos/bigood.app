import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Container } from "@/components/landing/ui/container"
import { IconBubble } from "@/components/landing/ui/icon-bubble"
import { SectionHeader } from "@/components/landing/ui/section-header"
import { painPoints } from "@/components/landing/landing-data"

export function PainSection() {
  return (
    <section
      className="landing-guide-section landing-scroll-reveal section-space bg-white"
      id="como-funciona"
      aria-labelledby="pain-heading"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeader
            eyebrow="O problema"
            title="Agenda no WhatsApp, caixa no papel, cliente que não volta."
            text="Enquanto a barbearia cresce, o improviso cresce junto. O Bigood centraliza tudo em um painel que qualquer barbeiro usa sem complicação."
          />
          <p className="max-w-[540px] text-base leading-7 text-[var(--landing-muted)] lg:justify-self-end">
            Chega de abrir três telas diferentes para saber se o dia deu lucro.
            O Bigood resolve antes do problema virar dor de cabeça.
          </p>
        </div>

        <div className="stagger-grid landing-clean-tile-grid mt-10 grid gap-0 overflow-hidden rounded-[24px] border border-[var(--landing-border)] bg-white md:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((item, index) => (
            <article
              key={item.title}
              className="group flex min-h-[260px] flex-col border-[var(--landing-border)] p-6 text-[var(--landing-primary-dark)] transition-colors duration-300 hover:bg-[var(--landing-accent)] hover:-translate-y-0.5 md:border-r md:border-b lg:border-b-0"
            >
              <div className="flex items-center justify-between">
                <IconBubble
                  icon={item.icon}
                  className="transition-colors duration-300 group-hover:bg-[rgba(11,51,36,0.1)]"
                />
                <span className="text-lg font-black opacity-30">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-10 text-2xl leading-[1.06] font-black" id={`pain-heading`}>
                {item.title}
              </h3>
              <p className="mt-4 text-[15px] leading-6 opacity-70">
                {item.description}
              </p>

              <div className="mt-auto pt-7">
                <span className="inline-flex items-center gap-2 text-sm font-black">
                  Resolver agora
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
