import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CancelCircleIcon,
  CashierIcon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  DashboardSquare03Icon,
  SmartPhone01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import {
  faqs,
  features,
  painPoints,
  plans,
} from "@/components/landing/landing-data"
import { LandingHeader } from "@/components/landing/landing-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { LANDING_IMAGES } from "@/lib/marketing-assets"
import { cn } from "@/lib/utils"

const limeButtonClass =
  "h-11 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-5 text-[15px] font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const darkButtonClass =
  "h-11 rounded-full border-[var(--landing-primary-dark)] bg-[var(--landing-primary-dark)] px-5 text-[15px] font-extrabold text-white hover:bg-[var(--landing-primary)]"

const lightButtonClass =
  "h-11 rounded-full border-[var(--landing-border-strong)] bg-white px-5 text-[15px] font-extrabold text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)]"

const quickStats = [
  {
    icon: Calendar03Icon,
    title: "Agenda",
    text: "cliente marca sem depender do WhatsApp",
  },
  {
    icon: CreditCardIcon,
    title: "Planos",
    text: "assinaturas para vender todo mês",
  },
  {
    icon: CashierIcon,
    title: "Caixa",
    text: "faturamento claro no fim do dia",
  },
]

const heroProofs = [
  { icon: Calendar03Icon, text: "Agenda online" },
  { icon: CreditCardIcon, text: "Planos de assinatura" },
  { icon: CashierIcon, text: "Caixa e comandas" },
]

const comparisons = [
  {
    label: "Opção 1",
    title: "WhatsApp e planilha",
    icon: CancelCircleIcon,
    bad: [
      "Agenda espalhada",
      "Comanda manual",
      "Assinante esquecido",
      "Caixa sem leitura",
    ],
  },
  {
    label: "Opção 2",
    title: "Sistema complexo",
    icon: DashboardSquare03Icon,
    bad: [
      "Demora para usar",
      "Tela demais",
      "Equipe trava",
      "Pouco foco em barbearia",
    ],
  },
]

export function LandingPage() {
  return (
    <main className="landing-page h-dvh overflow-x-hidden overflow-y-auto bg-background text-foreground">
      <LandingHeader />
      <HeroSection />
      <PainSection />
      <FeaturesSection />
      <CompareSection />
      <DashboardShowcaseSection />
      <PortalShowcaseSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="landing-guide-section landing-clean-grid bg-[var(--landing-background)]">
      <Container className="grid min-h-[calc(100dvh-68px)] gap-8 py-9 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-10 md:py-12 lg:py-16">
        <div className="landing-reveal">
          <SectionEyebrow>Sistema completo para barbearias</SectionEyebrow>
          <h1 className="mt-5 max-w-[680px] text-[clamp(38px,11vw,56px)] leading-[0.98] font-black text-[var(--landing-primary-dark)] md:mt-6 md:text-[clamp(46px,6vw,78px)]">
            Barba, cabelo e gestão para o seu negócio crescer.
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-6 text-[var(--landing-foreground-soft)] md:mt-6 md:text-lg md:leading-7">
            Agenda, caixa, clientes, equipe e planos de assinatura em um painel
            simples para vender mais e perder menos tempo.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
            <LandingLinkButton
              href="/escolher-plano"
              className={limeButtonClass}
            >
              Assinar plano
            </LandingLinkButton>
            <LandingLinkButton href="#dashboard" className={lightButtonClass}>
              Ver dashboard
            </LandingLinkButton>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            {heroProofs.map((proof) => (
              <HeroBadge
                key={proof.text}
                icon={proof.icon}
                label={proof.text}
              />
            ))}
          </div>
        </div>

        <div className="landing-reveal-delayed md:hidden">
          <Image
            src={LANDING_IMAGES.barber2}
            alt="Bigood para barbearias com consultor e rotina real"
            width={815}
            height={815}
            sizes="(max-width: 767px) 100vw"
            className="mx-auto h-auto w-full max-w-[440px] object-contain"
            priority
          />
        </div>

        <div className="landing-reveal-delayed hidden md:block">
          <div className="group relative min-h-[560px] md:min-h-[560px]">
            <div className="landing-hero-glow absolute inset-x-2 top-10 bottom-4 overflow-hidden rounded-[36px] bg-[var(--landing-primary-dark)] md:inset-x-8 md:top-8 md:bottom-0 md:rounded-[44px]">
              <Image
                src={LANDING_IMAGES.hero}
                alt="Barbearia Bigood com ambiente premium"
                fill
                sizes="(min-width: 1024px) 50vw, 92vw"
                className="object-cover opacity-72 transition duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,47,34,0.86),rgba(11,51,36,0.32)_48%,rgba(216,242,58,0.72))]" />
            </div>
            <Image
              src={LANDING_IMAGES.barber}
              alt="Consultor Bigood especialista em rotina de barbearia"
              width={760}
              height={880}
              sizes="(min-width: 1024px) 42vw, 88vw"
              className="absolute inset-x-0 bottom-4 z-10 mx-auto h-[86%] w-auto object-contain drop-shadow-[0_28px_42px_rgba(8,47,34,0.24)] transition duration-500 group-hover:scale-[1.02] md:bottom-0 md:h-[104%]"
              priority
            />
            <FloatingNote
              icon={Calendar03Icon}
              title="Agenda sem caos"
              text="Horário e serviço no lugar certo."
              className="landing-float absolute top-[15%] right-[-18px] z-20 hidden w-[174px] md:top-[21%] md:right-[-34px] md:block md:w-[210px] lg:right-[-44px]"
            />
            <FloatingNote
              icon={CreditCardIcon}
              title="Plano ativo"
              text="Corte + barba renovado."
              className="landing-float-slow absolute bottom-[19%] left-[-18px] z-20 hidden w-[172px] md:bottom-[24%] md:left-[-42px] md:block md:w-[205px] lg:left-[-52px]"
            />
          </div>
        </div>
      </Container>

      <div className="border-y border-[var(--landing-border)] bg-white">
        <Container className="grid gap-8 py-10 md:grid-cols-3">
          {quickStats.map((stat) => (
            <div
              key={stat.title}
              className="landing-scroll-reveal flex gap-4 border-[var(--landing-primary-dark)]/30 md:border-l md:pl-10 md:first:border-l-0 md:first:pl-0"
            >
              <IconBubble icon={stat.icon} className="mt-1 shrink-0" />
              <div>
                <p className="text-[clamp(32px,4vw,46px)] leading-none font-black text-[var(--landing-primary-dark)]">
                  {stat.title}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--landing-foreground-soft)]">
                  {stat.text}
                </p>
              </div>
            </div>
          ))}
        </Container>
      </div>
    </section>
  )
}

function PainSection() {
  return (
    <section
      className="landing-guide-section landing-scroll-reveal section-space bg-white"
      id="como-funciona"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeader
            eyebrow="Problema real"
            title="Quando tudo fica solto, a barbearia perde controle."
            text="O Bigood junta a rotina em um lugar só, sem deixar o dono depender de WhatsApp, caderno e planilha ao mesmo tempo."
          />
          <p className="max-w-[540px] text-base leading-7 text-[var(--landing-muted)] lg:justify-self-end">
            Menos troca de ferramenta, menos conferência manual e mais clareza
            para decidir o que acontece no dia.
          </p>
        </div>

        <div className="landing-clean-tile-grid mt-12 grid gap-0 overflow-hidden rounded-[28px] border border-[var(--landing-border)] bg-white md:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((item, index) => (
            <article
              key={item.title}
              className="group flex min-h-[330px] flex-col border-[var(--landing-border)] p-7 text-[var(--landing-primary-dark)] transition-colors duration-300 hover:bg-[var(--landing-accent)] md:border-r md:border-b lg:border-b-0"
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

              <h3 className="mt-14 text-[30px] leading-[1.06] font-black">
                {item.title}
              </h3>
              <p className="mt-5 text-base leading-7 opacity-70">
                {item.description}
              </p>

              <div className="mt-auto pt-10">
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

function FeaturesSection() {
  return (
    <section
      className="landing-guide-section landing-clean-grid landing-scroll-reveal section-space bg-[var(--landing-background)]"
      id="recursos"
    >
      <Container>
        <SectionHeader
          eyebrow="Recursos"
          title="Menos improviso. Mais decisão."
          text="O essencial para a barbearia funcionar melhor todos os dias."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 6).map((feature, index) => (
            <article
              key={feature.title}
              className="group min-h-[240px] rounded-[24px] border border-[var(--landing-border)] bg-white p-7 transition-colors duration-300 hover:bg-[var(--landing-accent)]"
            >
              <div className="flex items-start justify-between gap-4">
                <IconBubble
                  icon={feature.icon}
                  className="transition-colors duration-300 group-hover:bg-[rgba(11,51,36,0.1)]"
                />
                <span className="text-xs font-black text-[var(--landing-primary-dark)]/28">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-8 text-2xl leading-7 font-black text-[var(--landing-primary-dark)]">
                {feature.title}
              </h3>
              <p className="mt-4 max-w-[300px] text-sm leading-6 text-[var(--landing-foreground-soft)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function CompareSection() {
  return (
    <section className="landing-guide-section landing-scroll-reveal section-space bg-white">
      <Container>
        <SectionHeader
          eyebrow="Comparativo direto"
          title="Enquanto outros complicam, o Bigood organiza."
          text="Não é mais uma ferramenta solta. É o painel da barbearia."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {comparisons.map((item) => (
            <article
              key={item.title}
              className="landing-card landing-scroll-reveal rounded-[24px] border border-[var(--landing-border)] bg-white p-8 transition duration-300 hover:-translate-y-1.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black tracking-[0.12em] text-[var(--landing-muted)] uppercase">
                    {item.label}
                  </p>
                  <h3 className="mt-6 text-3xl font-black text-[var(--landing-primary-dark)]">
                    {item.title}
                  </h3>
                </div>
                <IconBubble icon={item.icon} />
              </div>
              <ul className="mt-8 grid gap-4 text-sm text-[var(--landing-foreground-soft)]">
                {item.bad.map((line) => (
                  <li key={line} className="flex gap-3">
                    <HugeiconsIcon
                      icon={CancelCircleIcon}
                      size={20}
                      className="text-red-400"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="landing-card landing-scroll-reveal landing-dark-gradient rounded-[24px] p-8 text-white transition duration-300 hover:-translate-y-1.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SectionPill className="border-transparent bg-[var(--landing-accent)]">
                  Recomendado
                </SectionPill>
                <h3 className="mt-6 text-3xl font-black">Bigood</h3>
              </div>
              <IconBubble icon={CheckmarkCircle02Icon} />
            </div>
            <ul className="mt-8 grid gap-4 text-sm text-white/72">
              {[
                "Agenda e caixa no mesmo lugar",
                "Planos de assinatura para clientes",
                "Portal do cliente pronto para vender",
                "Rotina pensada para barbearia",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={20}
                    className="text-[var(--landing-accent)]"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  )
}

function DashboardShowcaseSection() {
  const dashboardHighlights = [
    {
      icon: Calendar03Icon,
      title: "Operação do dia",
      text: "Agenda e comandas em tempo real.",
    },
    {
      icon: CreditCardIcon,
      title: "Planos ativos",
      text: "Assinantes e renovações no radar.",
    },
    {
      icon: CashierIcon,
      title: "Financeiro claro",
      text: "Receita, ticket e caixa sem chute.",
    },
    {
      icon: DashboardSquare03Icon,
      title: "Leitura rápida",
      text: "Indicadores importantes em uma tela.",
    },
  ]

  return (
    <section
      className="landing-guide-section landing-clean-grid landing-scroll-reveal overflow-hidden bg-[var(--landing-background)] py-16 md:py-20"
      id="dashboard"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-center">
          <div>
            <SectionEyebrow>Dentro do Bigood</SectionEyebrow>
            <h2 className="mt-6 text-[clamp(38px,5vw,64px)] leading-[1] font-black text-[var(--landing-primary-dark)]">
              O painel que mostra o que importa.
            </h2>
            <p className="mt-5 max-w-[520px] text-lg leading-7 text-[var(--landing-muted)]">
              Abra o dashboard e veja agenda, caixa, clientes e receita sem
              procurar informação em vários lugares.
            </p>
            <div className="mt-8 grid gap-3">
              {dashboardHighlights.slice(0, 3).map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-[18px] border border-[var(--landing-border)] bg-white p-4"
                >
                  <IconBubble icon={item.icon} className="size-9 shrink-0" />
                  <div>
                    <p className="font-black text-[var(--landing-primary-dark)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[var(--landing-muted)]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <LandingLinkButton
              href="/escolher-plano"
              className={cn(darkButtonClass, "mt-8")}
            >
              Quero esse painel
            </LandingLinkButton>
          </div>

          <div className="relative z-10">
            <MacMockup />
          </div>
        </div>
      </Container>
    </section>
  )
}

function MacMockup() {
  return (
    <div className="landing-device landing-reveal-delayed -mx-10 sm:-mx-6 md:mx-0 lg:-ml-8">
      <div className="relative aspect-[1.55] w-full overflow-visible rounded-[28px]">
        <Image
          src={LANDING_IMAGES.dashboard}
          alt="Dashboard administrativo Bigood no notebook"
          fill
          sizes="(min-width: 1280px) 1180px, (min-width: 1024px) 72vw, 122vw"
          className="scale-[1.48] object-cover object-[center_70%] md:scale-[1.32] lg:scale-[1.42]"
          priority={false}
        />
      </div>
    </div>
  )
}

function PortalShowcaseSection() {
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

  return (
    <section
      className="landing-guide-section landing-scroll-reveal section-space overflow-hidden bg-white"
      id="portal-cliente"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <PhoneMockup />
          </div>

          <div className="order-1 lg:order-2">
            <SectionEyebrow>Portal do cliente</SectionEyebrow>
            <h2 className="mt-6 max-w-[640px] text-[clamp(38px,5vw,68px)] leading-[1] font-black text-[var(--landing-primary-dark)]">
              O cliente agenda direto pelo celular.
            </h2>
            <p className="mt-5 max-w-[520px] text-lg leading-7 text-[var(--landing-muted)]">
              Uma experiência simples para escolher serviço, horário e plano sem
              depender de mensagem manual.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {portalBenefits.map((item) => (
                <div
                  key={item.title}
                  className="landing-card landing-scroll-reveal flex gap-3 rounded-[22px] border border-[var(--landing-border)] bg-white p-4"
                >
                  <IconBubble icon={item.icon} className="size-9 shrink-0" />
                  <div>
                    <p className="font-black text-[var(--landing-primary-dark)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[var(--landing-muted)]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <LandingLinkButton
              href="/escolher-plano"
              className={cn(limeButtonClass, "mt-8")}
            >
              Quero meu portal
            </LandingLinkButton>
          </div>
        </div>
      </Container>
    </section>
  )
}

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

function PricingSection() {
  return (
    <section
      className="landing-guide-section landing-clean-grid landing-scroll-reveal section-space"
      id="planos"
    >
      <Container>
        <SectionHeader
          eyebrow="Preço"
          title="Planos simples para usar o Bigood."
          text="Escolha como quer começar. Operações maiores falam com a gente."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={cn(
                "landing-card rounded-[28px] border p-7 transition duration-300 hover:-translate-y-1.5",
                plan.highlighted
                  ? "border-transparent bg-[var(--landing-primary-dark)] text-white"
                  : "border-[var(--landing-border)] bg-white text-[var(--landing-primary-dark)]"
              )}
            >
              <SectionPill
                className={
                  plan.highlighted
                    ? "border-white/10 bg-white/10 text-white"
                    : "bg-[var(--landing-primary-soft)]"
                }
              >
                {plan.badge}
              </SectionPill>
              <IconBubble
                icon={plan.highlighted ? CheckmarkCircle02Icon : CreditCardIcon}
                className={cn(
                  "mt-6",
                  plan.highlighted ? "bg-[var(--landing-accent)]" : ""
                )}
              />
              <h3 className="mt-5 text-3xl font-black">{plan.name}</h3>
              <p className="mt-4">
                <span className="text-5xl font-black">{plan.price}</span>
                <span
                  className={
                    plan.highlighted
                      ? "text-white/60"
                      : "text-[var(--landing-muted)]"
                  }
                >
                  {plan.period}
                </span>
              </p>
              <p
                className={cn(
                  "mt-5 min-h-[72px] text-sm leading-6",
                  plan.highlighted
                    ? "text-white/70"
                    : "text-[var(--landing-muted)]"
                )}
              >
                {plan.description}
              </p>
              <ul className="mt-6 grid gap-3 text-sm">
                {plan.features.slice(0, 5).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className={
                        plan.highlighted
                          ? "text-[var(--landing-accent)]"
                          : "text-[var(--landing-primary)]"
                      }
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <LandingLinkButton
                href={`/cadastro?plan=${plan.key}`}
                className={cn(
                  plan.highlighted ? limeButtonClass : darkButtonClass,
                  "mt-8"
                )}
              >
                {plan.cta}
              </LandingLinkButton>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FaqSection() {
  return (
    <section
      className="landing-guide-section landing-scroll-reveal section-space bg-white"
      id="duvidas"
    >
      <Container className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <SectionHeader
          eyebrow="Dúvidas comuns"
          title="Gestão de barbearia na prática."
          text="Respostas diretas para decidir sem enrolação."
        />

        <Accordion
          type="single"
          collapsible
          className="overflow-hidden rounded-[24px] border border-[var(--landing-border)] bg-white"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="border-b border-[var(--landing-border)] bg-transparent px-5 last:border-b-0"
            >
              <AccordionTrigger className="py-5 text-left text-xl font-black text-[var(--landing-primary-dark)] hover:text-[var(--landing-primary)]">
                <div className="flex items-center gap-3">
                  <IconBubble
                    icon={CheckmarkCircle02Icon}
                    className="size-8 shrink-0"
                  />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="max-w-[760px] pb-6 text-base leading-7 text-[var(--landing-muted)]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="landing-guide-section landing-scroll-reveal section-space">
      <Container>
        <div className="grid gap-8 rounded-[32px] border border-[rgba(11,51,36,0.12)] bg-[var(--landing-accent)] p-8 text-[var(--landing-primary-dark)] md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <SectionEyebrow>Sistema completo</SectionEyebrow>
            <h2 className="mt-5 max-w-[760px] text-[clamp(36px,5vw,64px)] leading-[1] font-black">
              Sua barbearia pronta para agendar, vender planos e crescer.
            </h2>
          </div>
          <LandingLinkButton href="/escolher-plano" className={darkButtonClass}>
            Assinar plano
          </LandingLinkButton>
        </div>
      </Container>
    </section>
  )
}

function LandingFooter() {
  const footerBadges = [
    { icon: Calendar03Icon, label: "Agenda" },
    { icon: CashierIcon, label: "Caixa" },
    { icon: CreditCardIcon, label: "Planos" },
    { icon: SmartPhone01Icon, label: "Portal" },
  ]

  const footerColumns = [
    {
      title: "Produto",
      links: [
        { label: "Como funciona", href: "#como-funciona" },
        { label: "Dashboard", href: "#dashboard" },
        { label: "Recursos", href: "#recursos" },
        { label: "Planos", href: "#planos" },
      ],
    },
    {
      title: "Gestão",
      links: [
        { label: "Agenda online", href: "#recursos" },
        { label: "Caixa e comandas", href: "#recursos" },
        { label: "Assinaturas", href: "#planos" },
        { label: "Portal do cliente", href: "#portal-cliente" },
      ],
    },
    {
      title: "Acesso",
      links: [
        { label: "Entrar", href: "/login" },
        { label: "Assinar plano", href: "/escolher-plano" },
        { label: "Cadastro", href: "/cadastro?plan=pro-anual" },
        { label: "Dúvidas", href: "#duvidas" },
      ],
    },
  ]

  return (
    <footer className="bg-[var(--landing-primary-dark)] text-white">
      <Container className="py-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.1fr_1.4fr_0.9fr]">
          <div>
            <BrandMark inverse />
            <p className="mt-5 max-w-[360px] text-sm leading-6 text-white/64">
              Sistema de gestão para barbearias que querem agenda, caixa,
              clientes e planos de assinatura no mesmo lugar.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {footerBadges.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-black text-white/72"
                >
                  <HugeiconsIcon icon={item.icon} size={14} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-black tracking-[0.12em] text-white/44 uppercase">
                  {column.title}
                </h3>
                <ul className="mt-5 grid gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-semibold text-white/72 transition-colors hover:text-[var(--landing-accent)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
            <p className="text-sm font-black text-white">Pronto para testar?</p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Comece pelo plano Bigood e veja sua barbearia mais organizada.
            </p>
            <LandingLinkButton
              href="/escolher-plano"
              className={cn(limeButtonClass, "mt-6")}
            >
              Assinar plano
            </LandingLinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs font-semibold text-white/44 md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 Bigood. Gestão simples para barbearias.</p>
          <p>Feito para agenda, caixa, clientes e assinaturas.</p>
        </div>
      </Container>
    </footer>
  )
}

function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1320px] px-5 md:px-8", className)}
    >
      {children}
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string
  title: React.ReactNode
  text: string
  dark?: boolean
}) {
  return (
    <div>
      <SectionEyebrow className={dark ? "text-white/54" : ""}>
        {eyebrow}
      </SectionEyebrow>
      <h2
        className={cn(
          "mt-6 max-w-[860px] text-[clamp(36px,4.6vw,64px)] leading-[1] font-black",
          dark ? "text-white" : "text-[var(--landing-primary-dark)]"
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-5 max-w-[560px] text-base leading-7",
          dark ? "text-white/68" : "text-[var(--landing-muted)]"
        )}
      >
        {text}
      </p>
    </div>
  )
}

function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-xs font-black tracking-[0.18em] text-[var(--landing-muted)] uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}

function SectionPill({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-primary-soft)] px-4 py-2 text-sm font-black text-[var(--landing-primary-dark)]",
        className
      )}
    >
      {children}
    </span>
  )
}

function LandingLinkButton({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Button size="lg" className={cn("w-fit rounded-full", className)} asChild>
      <Link href={href}>
        {children}
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
      </Link>
    </Button>
  )
}

function HeroBadge({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <IconBubble icon={icon} className="size-12" />
      <span className="text-sm font-black text-[var(--landing-primary-dark)]">
        {label}
      </span>
    </div>
  )
}

function FloatingNote({
  icon,
  title,
  text,
  className,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  title: string
  text: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/60 bg-white/92 p-3 text-[var(--landing-primary-dark)] shadow-[var(--landing-shadow-card)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-[var(--landing-accent)] md:rounded-[22px] md:p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <IconBubble icon={icon} className="size-8 shrink-0 md:size-9" />
        <div className="min-w-0">
          <p className="text-xs leading-4 font-black text-balance md:text-sm md:leading-5">
            {title}
          </p>
          <p className="mt-1 text-xs leading-5 text-pretty text-[var(--landing-muted)] md:text-sm">
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}

function IconBubble({
  icon,
  className,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  className?: string
}) {
  return (
    <span
      className={cn(
        "grid size-10 place-items-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]",
        className
      )}
    >
      <HugeiconsIcon icon={icon} size={20} aria-hidden="true" />
    </span>
  )
}



