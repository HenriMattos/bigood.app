import Image from "next/image"
import {
  Calendar03Icon,
  CreditCardIcon,
  SmartPhone01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import { Container } from "@/components/landing/ui/container"
import { IconBubble } from "@/components/landing/ui/icon-bubble"
import { LandingLinkButton } from "@/components/landing/ui/landing-link-button"
import { SectionEyebrow } from "@/components/landing/ui/section-header"
import { LANDING_IMAGES } from "@/lib/marketing-assets"
import { cn } from "@/lib/utils"

const limeButtonClass =
  "h-12 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-6 text-sm font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const portalBenefits = [
  {
    icon: SmartPhone01Icon,
    title: "Serviços visíveis",
    text: "Cliente escolhe o que quer agendar.",
  },
  {
    icon: Calendar03Icon,
    title: "Horário claro",
    text: "Menos troca de mensagem no WhatsApp.",
  },
  {
    icon: CreditCardIcon,
    title: "Planos no portal",
    text: "Assinaturas aparecem no mesmo lugar.",
  },
  {
    icon: UserGroupIcon,
    title: "Visual da barbearia",
    text: "Experiência com cara da sua marca.",
  },
]

function PhoneMockup() {
  return (
    <div className="landing-device-phone mx-auto max-w-[520px]">
      <div className="relative overflow-hidden rounded-[36px]">
        <Image
          src={LANDING_IMAGES.portal}
          alt="Portal do cliente Bigood em mockup de celular"
          width={2500}
          height={3333}
          sizes="(min-width: 1024px) 42vw, 92vw"
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  )
}

export function PortalShowcaseSection() {
  return (
    <section
      className="landing-guide-section landing-scroll-reveal section-space overflow-hidden bg-white"
      id="portal-cliente"
      aria-labelledby="portal-heading"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <PhoneMockup />
          </div>

          <div className="order-1 lg:order-2">
            <SectionEyebrow>Portal do cliente</SectionEyebrow>
            <h2
              id="portal-heading"
              className="mt-5 max-w-[600px] text-[clamp(32px,4vw,52px)] leading-[1] font-black text-[var(--landing-primary-dark)]"
            >
              Cliente agenda pelo celular. Você só confirma.
            </h2>
            <p className="mt-4 max-w-[500px] text-[15px] leading-6 text-[var(--landing-muted)]">
              O cliente escolhe serviço, horário e até plano de assinatura sem
              precisar mandar mensagem. Sua agenda enche sozinha.
            </p>

            <div className="stagger-grid mt-6 grid gap-2 sm:grid-cols-2">
              {portalBenefits.map((item) => (
                <div
                  key={item.title}
                  className="card-hover-lift landing-card flex gap-3 rounded-[18px] border border-[var(--landing-border)] bg-white p-3"
                >
                  <IconBubble icon={item.icon} className="size-8 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-[var(--landing-primary-dark)]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-[var(--landing-muted)]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

<LandingLinkButton
              href="/login"
              className={cn(limeButtonClass, "mt-6")}
            >
              Quero meu portal
            </LandingLinkButton>
          </div>
        </div>
      </Container>
    </section>
  )
}
