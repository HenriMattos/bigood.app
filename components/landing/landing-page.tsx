import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight01Icon,
  Building01Icon,
  ChartBarLineIcon,
  CheckmarkCircle02Icon,
  Download01Icon,
  Store01Icon,
  Target02Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import {
  comparisonRows,
  dashboardMetrics,
  faqs,
  features,
  flowSteps,
  painPoints,
  plans,
  productPillars,
  trustItems,
  valueMetrics,
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

const lightButtonClass =
  "h-11 rounded-full border-white/30 bg-white/8 px-5 text-[15px] font-bold text-white hover:bg-white/16"

const darkButtonClass =
  "h-11 rounded-full border-[var(--landing-primary-dark)] bg-[var(--landing-primary)] px-5 text-[15px] font-extrabold text-white hover:bg-[var(--landing-primary-dark)]"

const outlineButtonClass =
  "h-11 rounded-full border-[var(--landing-border-strong)] bg-transparent px-5 text-[15px] font-bold text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)]"

const flowVisualSlides = [
  {
    title: "Escolha o plano",
    description:
      "O barbeiro compara Mensal, Anual e Personalizado e entra no cadastro com o plano selecionado.",
    image: LANDING_IMAGES.hero,
    tags: ["Planos", "CTA", "Oferta"],
  },
  {
    title: "Cadastro comercial",
    description:
      "Dados da barbearia, unidades, responsavel e observacoes chegam antes do checkout.",
    image: LANDING_IMAGES.aboutInterior,
    tags: ["Dados", "Unidades", "Contato"],
  },
  {
    title: "Checkout do plano",
    description:
      "Resumo de preco, pagamento e transicao de sistema antes da confirmacao.",
    image: LANDING_IMAGES.previewBarbershop,
    tags: ["Pagamento", "Plano", "Confirmacao"],
  },
  {
    title: "Login do painel",
    description:
      "Apos confirmar, o barbeiro acessa o painel pela landing em Conta > Meu painel.",
    image: LANDING_IMAGES.aboutClient,
    tags: ["Painel", "Agenda", "Caixa"],
  },
]

export function LandingPage() {
  return (
    <main className="landing-page h-dvh overflow-x-hidden overflow-y-auto bg-background text-foreground">
      <LandingHeader />
      <HeroSection />
      <TrustSection />
      <ProblemSection />
      <AboutSection />
      <FeaturesSection />
      <PreviewSection />
      <MultiUnitSection />
      <FlowSection />
      <PricingSection />
      <ComparisonSection />
      <InsightSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="px-3 pt-3 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative min-h-[720px] overflow-hidden rounded-[32px] rounded-b-[36px] bg-[var(--landing-primary-dark)] shadow-[0_24px_60px_rgba(11,51,36,0.18)]">
          <Image
            src={LANDING_IMAGES.hero}
            alt="Barbearia moderna com atendimento premium"
            fill
            loading="eager"
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,63,40,0.86),rgba(10,63,40,0.56),rgba(10,63,40,0.36))]" />

          <div className="pointer-events-none absolute top-24 -left-10 h-60 w-80 rotate-[-16deg] rounded-[999px] border-[8px] border-[var(--landing-accent)] border-r-transparent border-b-transparent opacity-80" />
          <div className="pointer-events-none absolute top-12 right-[-40px] h-48 w-64 rotate-[22deg] rounded-[999px] border-[8px] border-[var(--landing-accent)] border-r-transparent border-b-transparent opacity-55" />
          <div className="pointer-events-none absolute bottom-6 left-6 text-[clamp(76px,15vw,210px)] font-black tracking-[-0.08em] text-white/12 uppercase">
            BIGOOD
          </div>

          <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1200px] items-center px-5 py-16 sm:px-8 lg:px-10">
            <div className="max-w-[720px]">
              <SectionPill className="border-white/18 bg-white/10 text-white">
                Sistema premium para barbearias
              </SectionPill>
              <h1 className="mt-6 max-w-[720px] text-[clamp(42px,6vw,76px)] leading-[0.95] font-extrabold tracking-[-0.05em] text-balance text-white">
                Cabelo, barba e gestao para o seu negocio crescer.
              </h1>
              <p className="mt-6 max-w-[620px] text-base leading-7 text-white/82 md:text-lg">
                O Bigood organiza agenda, clientes, profissionais, caixa,
                financeiro, planos e assinaturas em uma plataforma completa para
                barbearias que querem crescer com mais controle.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LandingLinkButton href="#planos" className={limeButtonClass}>
                  Ver planos
                </LandingLinkButton>
                <LandingLinkButton href="/login" className={lightButtonClass}>
                  Entrar no painel
                </LandingLinkButton>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-white/78 sm:grid-cols-2">
                <HeroCheck text="Planos a partir de R$ 220 por mes" />
                <HeroCheck text="Ate 3 unidades no Plano Pro" />
                <HeroCheck text="Transicao de sistema gratis no anual" />
                <HeroCheck text="Sem plano gratuito" />
              </div>

              <div className="mt-8 grid gap-3 sm:max-w-[640px] sm:grid-cols-3">
                {[
                  ["Agenda de hoje", "32 horarios"],
                  ["Receita mensal", "R$ 18.420"],
                  ["Assinaturas ativas", "86 clientes"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[24px] border border-white/16 bg-white/12 p-4 backdrop-blur-xl"
                  >
                    <p className="text-xs font-semibold tracking-[0.08em] text-white/58 uppercase">
                      {label}
                    </p>
                    <p className="mt-2 text-xl font-extrabold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute right-5 bottom-5 z-10 hidden w-[320px] rounded-[24px] border border-white/16 bg-white/92 p-5 text-[var(--landing-primary-dark)] shadow-[0_18px_45px_rgba(11,51,36,0.16)] backdrop-blur sm:block">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-[var(--landing-foreground-soft)] uppercase">
                  Plano recomendado
                </p>
                <p className="mt-1 text-[28px] leading-none font-extrabold">
                  Pro Anual
                </p>
              </div>
              <span className="rounded-full border border-[var(--landing-border)] bg-[var(--landing-accent-soft)] px-3 py-1 text-xs font-bold">
                R$ 175/mes
              </span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-[var(--landing-foreground-soft)]">
              <HeroCheck text="Economia de R$ 540 por ano" dark />
              <HeroCheck text="Pix, boleto, transferencia ou contrato" dark />
              <HeroCheck text="Transicao sem custo adicional" dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section className="py-6">
      <Container>
        <div className="grid gap-4 rounded-[28px] border border-[var(--landing-border)] bg-white px-5 py-5 shadow-[var(--landing-shadow-soft)] md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <SectionPill>Bigood para operacao real</SectionPill>
            <p className="mt-3 max-w-[430px] text-base font-semibold text-[var(--landing-primary-dark)]">
              Tudo que a barbearia precisa para agendar, vender, cobrar e
              crescer no mesmo sistema.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {trustItems.map((item) => (
              <SectionPill
                key={item}
                className="bg-[var(--landing-primary-soft)]"
              >
                {item}
              </SectionPill>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="section-space bg-[var(--landing-background-soft)]">
      <Container>
        <SplitSectionHeader
          badge="Problemas da operacao"
          title="Sua barbearia nao precisa depender de WhatsApp, caderno e planilhas."
          description="Quando agenda, clientes, caixa e assinaturas ficam espalhados, a operacao perde controle, tempo e oportunidades de venda."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {painPoints.map((item, index) => (
            <article
              key={item.title}
              className="group relative min-h-[260px] overflow-hidden rounded-[24px] border border-[var(--landing-border)] bg-white p-8 shadow-[var(--landing-shadow-soft)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[var(--landing-shadow-card)]"
            >
              <IconCircle icon={item.icon} />
              <h3 className="mt-6 max-w-[220px] text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[var(--landing-primary-dark)]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[var(--landing-muted)]">
                {item.description}
              </p>
              <span className="absolute right-6 bottom-5 text-[34px] font-black text-[rgba(11,51,36,0.14)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="produto" className="section-space">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative min-h-[520px]">
            <div className="absolute top-0 left-0 h-[420px] w-[72%] overflow-hidden rounded-[24px] shadow-[var(--landing-shadow-card)]">
              <Image
                src={LANDING_IMAGES.aboutClient}
                alt="Cliente em atendimento na barbearia"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover object-left"
              />
            </div>
            <div className="absolute right-0 bottom-0 h-[340px] w-[72%] overflow-hidden rounded-[24px] shadow-[var(--landing-shadow-card)]">
              <Image
                src={LANDING_IMAGES.aboutInterior}
                alt="Barbearia organizada com ambiente premium"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,63,40,0.08),rgba(10,63,40,0.38))]" />
            </div>
            <div className="absolute top-[130px] right-[10%] rounded-[20px] bg-white px-8 py-7 text-center shadow-[var(--landing-shadow-soft)]">
              <strong className="block text-[52px] leading-none font-black text-[var(--landing-primary)]">
                R$ 540
              </strong>
              <span className="mt-2 block text-sm font-medium text-[var(--landing-muted)]">
                de economia no plano anual
              </span>
            </div>
            <div className="pointer-events-none absolute bottom-[70px] left-[26%] h-44 w-56 rotate-[10deg] rounded-[999px] border-[8px] border-[var(--landing-accent)] border-r-transparent border-b-transparent opacity-80" />
          </div>

          <div className="min-w-0">
            <SectionPill>Sobre o produto</SectionPill>
            <h2 className="mt-5 text-[clamp(32px,4vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-[var(--landing-primary-dark)]">
              Bigood organiza a rotina da barbearia sem pesar a operacao.
            </h2>
            <p className="mt-5 max-w-[560px] text-base leading-7 text-[var(--landing-muted)]">
              Do primeiro agendamento ao fechamento do caixa, o sistema conecta
              agenda, clientes, equipe, vendas recorrentes e caixa em um painel
              claro e pronto para escalar.
            </p>

            <div className="mt-8 grid gap-4">
              {productPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="grid gap-4 rounded-[24px] border border-[var(--landing-border)] bg-white p-5 shadow-[var(--landing-shadow-soft)] sm:grid-cols-[auto_1fr]"
                >
                  <IconCircle icon={pillar.icon} />
                  <div>
                    <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--landing-primary-dark)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--landing-muted)]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LandingLinkButton href="#fluxo" className={darkButtonClass}>
                Ver fluxo de contratacao
              </LandingLinkButton>
              <LandingLinkButton
                href="/cadastro?plan=pro-anual"
                className={outlineButtonClass}
              >
                Comecar agora
              </LandingLinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section
      id="recursos"
      className="section-space bg-[var(--landing-background-soft)]"
    >
      <Container>
        <SplitSectionHeader
          badge="Recursos"
          title="Funcionalidades pensadas para barbearias modernas."
          description="Agenda, clientes, equipe, caixa e assinaturas em uma linguagem visual leve, organizada e pronta para o uso diario."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.slice(0, 6).map((feature, index) => (
            <article
              key={feature.title}
              className="group relative min-h-[260px] overflow-hidden rounded-[24px] border border-[var(--landing-border)] bg-white p-8 shadow-[var(--landing-shadow-soft)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[var(--landing-shadow-card)]"
            >
              <IconCircle icon={feature.icon} />
              <h3 className="mt-6 max-w-[240px] text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[var(--landing-primary-dark)]">
                {feature.title}
              </h3>
              <p className="mt-4 max-w-[280px] text-sm leading-6 text-[var(--landing-muted)]">
                {feature.description}
              </p>
              <span className="absolute right-6 bottom-5 text-[34px] font-black text-[rgba(11,51,36,0.14)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function PreviewSection() {
  return (
    <section className="section-space">
      <Container>
        <SplitSectionHeader
          badge="Preview do sistema"
          title="Gestao visual, organizada e pronta para o ritmo da barbearia."
          description="A linguagem do produto combina leitura rapida, cards objetivos e feedback visual claro para desktop e mobile."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="overflow-hidden rounded-[28px] bg-[var(--landing-primary-dark)] p-6 text-white shadow-[0_24px_55px_rgba(11,51,36,0.16)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SectionPill className="border-white/12 bg-white/10 text-white">
                  Painel do barbeiro
                </SectionPill>
                <h3 className="mt-4 text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em]">
                  Tudo importante a vista logo no primeiro bloco.
                </h3>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {dashboardMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold tracking-[0.08em] text-white/56 uppercase">
                      {metric.label}
                    </p>
                    <IconCircle
                      icon={metric.icon}
                      className="size-10 bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]"
                    />
                  </div>
                  <p className="mt-4 text-2xl font-extrabold">{metric.value}</p>
                  <p className="mt-2 text-sm text-white/70">{metric.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="project-card relative min-h-[320px] overflow-hidden rounded-[24px] bg-[var(--landing-primary-soft)] shadow-[var(--landing-shadow-card)]">
              <Image
                src={LANDING_IMAGES.previewBarbershop}
                alt="Cliente acessando experiencia premium da barbearia"
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover object-right"
              />
              <div className="absolute right-6 bottom-6 left-6 rounded-[18px] bg-white p-5 text-center shadow-[var(--landing-shadow-soft)]">
                <span className="absolute -top-6 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full border border-[rgba(11,51,36,0.16)] bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]">
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={20}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[var(--landing-primary-dark)]">
                  Agenda online para clientes
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">
                  Uma experiencia limpa para o cliente agendar, consultar
                  horarios e acompanhar seus planos.
                </p>
              </div>
            </article>

            <article className="rounded-[24px] border border-[var(--landing-border)] bg-white p-6 shadow-[var(--landing-shadow-soft)]">
              <SectionPill className="bg-[var(--landing-primary-soft)]">
                Assinaturas e multiunidades
              </SectionPill>
              <h3 className="mt-4 text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[var(--landing-primary-dark)]">
                Controle de recorrencia com visao clara de operacao.
              </h3>
              <div className="mt-5 grid gap-3">
                {[
                  "Plano Pro inclui ate 3 unidades.",
                  "Plano anual aceita cartao, Pix, boleto e transferencia.",
                  "Transicao de sistema pode ficar gratis no anual.",
                ].map((item) => (
                  <HeroCheck key={item} text={item} dark />
                ))}
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  )
}

function MultiUnitSection() {
  return (
    <section className="section-space overflow-hidden">
      <Container>
        <div className="relative overflow-hidden rounded-[40px] border border-[var(--landing-border)] bg-[#f7faf6] px-6 py-12 md:px-12 md:py-20 lg:px-16">
          {/* Decorative Background Elements */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            {/* Top-left curve */}
            <svg
              className="absolute -top-16 -left-16 h-64 w-64 text-[var(--landing-accent)]"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 80 Q 50 10 120 60 T 190 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 100 Q 60 30 130 80 T 180 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.5"
              />
            </svg>

            {/* Bottom-center curve */}
            <svg
              className="absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 text-[var(--landing-accent)]"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 100 Q 100 20 190 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Corner Icons */}
          <div className="pointer-events-none absolute top-8 left-8 flex gap-3 text-[var(--landing-accent)]/30 sm:top-12 sm:left-12">
            <HugeiconsIcon icon={ThumbsUpIcon} size={42} />
            <HugeiconsIcon icon={ThumbsDownIcon} size={42} />
          </div>
          <div className="pointer-events-none absolute top-8 right-8 text-[var(--landing-accent)]/30 sm:top-12 sm:right-12">
            <HugeiconsIcon icon={Download01Icon} size={42} />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="relative z-10">
              <SectionPill className="bg-white/80">Multiunidades</SectionPill>
              <h2 className="mt-8 text-[clamp(40px,5.2vw,68px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-[var(--landing-primary-dark)]">
                Feito de barbeiro <br />
                para{" "}
                <span className="inline-block rounded-[22px] bg-[var(--landing-accent)] px-5 py-1.5 shadow-[0_4px_0_rgba(11,51,36,0.1)]">
                  barbeiro
                </span>
              </h2>
              <p className="mt-8 max-w-[540px] text-lg leading-relaxed text-[var(--landing-foreground-soft)] lg:text-xl">
                Gestao criada por quem vive a rotina da barbearia, com foco em
                operacao real, equipe e crescimento.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)] shadow-sm">
                    <HugeiconsIcon icon={Store01Icon} size={22} />
                  </div>
                  <span className="text-base font-bold text-[var(--landing-primary-dark)]">
                    Operacao real
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)] shadow-sm">
                    <HugeiconsIcon icon={Target02Icon} size={22} />
                  </div>
                  <span className="text-base font-bold text-[var(--landing-primary-dark)]">
                    Visao de dono
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)] shadow-sm">
                    <HugeiconsIcon icon={ChartBarLineIcon} size={22} />
                  </div>
                  <span className="text-base font-bold text-[var(--landing-primary-dark)]">
                    Crescimento
                  </span>
                </div>
              </div>

              <div className="mt-14">
                <LandingLinkButton
                  href="/cadastro?plan=personalizado"
                  className={cn(darkButtonClass, "h-14 px-10 text-lg")}
                >
                  Falar com especialista
                </LandingLinkButton>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              {/* Main Image Container */}
              <div className="relative mx-auto w-full max-w-[540px]">
                {/* Lime background block */}
                <div className="absolute top-0 right-0 bottom-0 left-16 rounded-[40px] bg-[var(--landing-accent)]" />

                <div className="relative -ml-12">
                  <Image
                    src={LANDING_IMAGES.barber}
                    alt="Barbeiro especialista"
                    width={900}
                    height={1100}
                    className="relative z-10 w-full"
                    priority
                  />
                  {/* Decorative curve over lime background */}
                  <svg
                    className="absolute top-16 left-24 z-0 h-48 w-48 text-white/30"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <path
                      d="M10 30 Q 50 10 90 50"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 50 Q 60 30 80 70"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {/* Floating Card: +86 barbearias */}
                <div className="absolute top-[22%] -right-4 z-20 rounded-[24px] bg-white p-5 shadow-[0_24px_48px_rgba(11,51,36,0.12)] transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="grid size-12 place-items-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]">
                      <HugeiconsIcon icon={Building01Icon} size={24} />
                    </div>
                    <div>
                      <p className="text-2xl leading-none font-black text-[var(--landing-primary-dark)]">
                        +86
                      </p>
                      <p className="mt-1 text-[11px] font-bold tracking-wider text-[var(--landing-muted)] uppercase">
                        barbearias <br /> gerenciadas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Card: Rotina da barbearia */}
                <div className="absolute -bottom-8 -left-16 z-20 max-w-[280px] rounded-[28px] bg-white p-6 shadow-[0_24px_48px_rgba(11,51,36,0.12)] transition-transform hover:-translate-y-1">
                  <div className="flex gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--landing-primary-dark)] text-[var(--landing-accent)]">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />
                    </div>
                    <div>
                      <p className="text-base leading-tight font-extrabold text-[var(--landing-primary-dark)]">
                        Feito para a rotina da barbearia
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-[var(--landing-muted)]">
                        Mais controle, menos burocracia.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dots pattern bottom-right */}
                <div className="absolute -right-8 -bottom-8 grid grid-cols-5 gap-3 opacity-20">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="size-1.5 rounded-full bg-[var(--landing-primary-dark)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function FlowSection() {
  return (
    <section id="fluxo" className="section-space">
      <Container>
        <SplitSectionHeader
          badge="Fluxo comercial"
          title="Da escolha do plano ao painel, sem etapas soltas."
          description="A landing agora funciona como porta de entrada comercial do SaaS: apresenta, converte, coleta os dados, confirma o plano e entrega o acesso."
        />

        <div className="mt-12 overflow-hidden rounded-[32px] border border-[var(--landing-border)] bg-white p-4 shadow-[var(--landing-shadow-soft)]">
          <div className="landing-carousel-track flex w-max gap-4 [--duration:32s]">
            {[...flowVisualSlides, ...flowVisualSlides].map((slide, index) => {
              const step = flowSteps[index % flowSteps.length]

              return (
                <article
                  key={`${slide.title}-${index}`}
                  className="grid w-[min(86vw,760px)] shrink-0 overflow-hidden rounded-[28px] border border-[var(--landing-border)] bg-[var(--landing-card-soft)] md:grid-cols-[0.9fr_1.1fr]"
                >
                  <div className="relative min-h-[360px] overflow-hidden bg-[var(--landing-primary-dark)]">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="(min-width: 768px) 320px, 86vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,47,34,0.1),rgba(8,47,34,0.72))]" />
                    <div className="absolute top-5 left-5 grid size-14 place-items-center rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]">
                      <HugeiconsIcon
                        icon={step.icon}
                        size={24}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="absolute right-5 bottom-5 text-[86px] leading-none font-black tracking-[-0.08em] text-white/16">
                      {String((index % flowSteps.length) + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex min-h-[360px] flex-col justify-between p-6 sm:p-8">
                    <div>
                      <SectionPill>{slide.tags[0]}</SectionPill>
                      <h3 className="mt-5 text-[34px] leading-[1.03] font-extrabold tracking-[-0.04em] text-[var(--landing-primary-dark)]">
                        {slide.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-[var(--landing-muted)] md:text-base md:leading-7">
                        {slide.description}
                      </p>
                    </div>

                    <div className="mt-7 grid gap-3">
                      <div className="rounded-[22px] border border-[var(--landing-border)] bg-white p-4">
                        <div className="mb-4 h-2 w-24 rounded-full bg-[var(--landing-accent)]" />
                        <div className="grid gap-2">
                          <span className="h-3 rounded-full bg-[var(--landing-primary-soft)]" />
                          <span className="h-3 w-4/5 rounded-full bg-[var(--landing-primary-soft)]" />
                          <span className="h-3 w-2/3 rounded-full bg-[var(--landing-primary-soft)]" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slide.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--landing-border)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--landing-primary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="planos" className="section-space">
      <Container>
        <SplitSectionHeader
          badge="Planos"
          title="Planos simples para barbearias que querem crescer com controle."
          description="O Plano Pro cobre ate 3 unidades. Operacoes com 4 ou mais unidades entram no Plano Personalizado."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={cn(
                "rounded-[24px] border p-7 shadow-[var(--landing-shadow-soft)]",
                plan.highlighted
                  ? "border-[rgba(216,242,58,0.35)] bg-[var(--landing-primary-dark)] text-white shadow-[0_24px_55px_rgba(11,51,36,0.18)]"
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

              <h3 className="mt-5 text-[30px] font-extrabold tracking-[-0.03em]">
                {plan.name}
              </h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-[44px] leading-none font-black">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span
                    className={cn(
                      "pb-1 text-sm font-bold",
                      plan.highlighted
                        ? "text-white/72"
                        : "text-[var(--landing-muted)]"
                    )}
                  >
                    {plan.period}
                  </span>
                ) : null}
              </div>

              {plan.key === "pro-anual" ? (
                <p className="mt-3 text-sm font-extrabold text-[var(--landing-accent)]">
                  Equivalente a R$ 175 por mes
                </p>
              ) : null}

              <p
                className={cn(
                  "mt-4 min-h-[96px] text-sm leading-6",
                  plan.highlighted
                    ? "text-white/76"
                    : "text-[var(--landing-muted)]"
                )}
              >
                {plan.description}
              </p>

              <div
                className={cn(
                  "mt-5 rounded-[20px] border p-4 text-sm leading-6",
                  plan.highlighted
                    ? "border-white/12 bg-white/8 text-white/80"
                    : "border-[var(--landing-border)] bg-[var(--landing-card-soft)] text-[var(--landing-foreground-soft)]"
                )}
              >
                <p>{plan.payment}</p>
                <p className="mt-2 font-bold">{plan.transition}</p>
              </div>

              <ul className="mt-6 grid gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      className={cn(
                        "mt-0.5 shrink-0",
                        plan.highlighted
                          ? "text-[var(--landing-accent)]"
                          : "text-[var(--landing-primary)]"
                      )}
                      aria-hidden="true"
                    />
                    <span className={plan.highlighted ? "text-white/82" : ""}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <LandingLinkButton
                  href={`/cadastro?plan=${plan.key}`}
                  className={
                    plan.highlighted ? limeButtonClass : darkButtonClass
                  }
                >
                  {plan.cta}
                </LandingLinkButton>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function ComparisonSection() {
  return (
    <section className="pb-20">
      <Container>
        <div className="rounded-[28px] border border-[var(--landing-border)] bg-white p-4 shadow-[var(--landing-shadow-soft)] sm:p-6">
          <div className="hidden overflow-hidden rounded-[24px] border border-[var(--landing-border)] lg:block">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[var(--landing-background-soft)] text-left">
                <tr>
                  <th className="p-4 font-extrabold text-[var(--landing-primary-dark)]">
                    Recurso
                  </th>
                  <th className="p-4 font-extrabold text-[var(--landing-primary-dark)]">
                    Pro Mensal
                  </th>
                  <th className="p-4 font-extrabold text-[var(--landing-primary-dark)]">
                    Pro Anual
                  </th>
                  <th className="p-4 font-extrabold text-[var(--landing-primary-dark)]">
                    Personalizado
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([resource, monthly, annual, custom]) => (
                  <tr
                    key={resource}
                    className="border-t border-[var(--landing-border)]"
                  >
                    <td className="p-4 font-semibold text-[var(--landing-primary-dark)]">
                      {resource}
                    </td>
                    <td className="p-4 text-[var(--landing-muted)]">
                      {monthly}
                    </td>
                    <td className="p-4 text-[var(--landing-muted)]">
                      {annual}
                    </td>
                    <td className="p-4 text-[var(--landing-muted)]">
                      {custom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {comparisonRows.map(([resource, monthly, annual, custom]) => (
              <article
                key={resource}
                className="rounded-[24px] border border-[var(--landing-border)] bg-[var(--landing-card-soft)] p-4"
              >
                <h3 className="font-extrabold text-[var(--landing-primary-dark)]">
                  {resource}
                </h3>
                <dl className="mt-3 grid gap-2 text-sm">
                  <ComparisonLine label="Pro Mensal" value={monthly} />
                  <ComparisonLine label="Pro Anual" value={annual} />
                  <ComparisonLine label="Personalizado" value={custom} />
                </dl>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function InsightSection() {
  return (
    <section className="section-space bg-[var(--landing-background-soft)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <SectionPill>Valor do produto</SectionPill>
            <h2 className="mt-5 text-[clamp(32px,4vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-[var(--landing-primary-dark)]">
              Menos operacao manual. Mais previsibilidade para crescer.
            </h2>
            <p className="mt-5 max-w-[520px] text-[clamp(22px,3vw,34px)] leading-[1.28] font-semibold text-[var(--landing-foreground-soft)]">
              Quando agenda, caixa, clientes e assinaturas param de viver em
              lugares diferentes, o dono da barbearia volta a enxergar o
              negocio.
            </p>
            <p className="mt-6 max-w-[520px] text-base leading-7 text-[var(--landing-muted)]">
              O Bigood foi desenhado para reduzir atrito no atendimento, clarear
              o financeiro e tornar o crescimento mais organizado.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-[28px] bg-white p-6 shadow-[var(--landing-shadow-card)]">
              <div className="grid gap-4 sm:grid-cols-2">
                {valueMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[24px] border border-[var(--landing-border)] bg-[var(--landing-card-soft)] p-5"
                  >
                    <p className="text-[34px] leading-none font-black text-[var(--landing-primary-dark)]">
                      {metric.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-6 right-4 rounded-[22px] border border-[var(--landing-border)] bg-[var(--landing-accent)] px-5 py-4 text-[var(--landing-primary-dark)] shadow-[var(--landing-shadow-soft)]">
              <p className="text-xs font-extrabold tracking-[0.08em] uppercase">
                Crescimento com controle
              </p>
              <p className="mt-1 text-sm font-semibold">
                Agenda, recorrencia e caixa no mesmo painel.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function FaqSection() {
  return (
    <section id="duvidas" className="section-space">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div>
            <SectionPill>FAQ</SectionPill>
            <h2 className="mt-5 text-[clamp(32px,4vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-[var(--landing-primary-dark)]">
              Respostas rapidas para a contratacao do Bigood.
            </h2>
            <p className="mt-5 max-w-[520px] text-base leading-7 text-[var(--landing-muted)]">
              As regras comerciais ja estao refletidas aqui: sem plano gratuito,
              sem taxa de implantacao e com transicao de sistema gratuita no
              anual.
            </p>

            <Accordion type="single" collapsible className="mt-8 grid gap-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="group overflow-hidden rounded-[20px] border border-[var(--landing-border)] bg-white px-0 shadow-[var(--landing-shadow-soft)] transition-all data-[state=open]:border-[var(--landing-border-strong)] data-[state=open]:shadow-[var(--landing-shadow-card)]"
                >
                  <AccordionTrigger className="px-5 py-5 text-[var(--landing-primary-dark)] hover:text-[var(--landing-primary)] sm:px-6 [&>span]:border-[var(--landing-border)] [&>span]:bg-[var(--landing-card-soft)] group-data-[state=open]:[&>span]:bg-white">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--landing-primary-soft)] text-sm font-black text-[var(--landing-primary)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-left text-base font-extrabold tracking-[-0.02em]">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-0 pb-6 text-[var(--landing-foreground-soft)] sm:px-6">
                    <div className="ml-0 leading-7 sm:ml-[52px]">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px] shadow-[var(--landing-shadow-card)]">
              <Image
                src={LANDING_IMAGES.faqBarber}
                alt="Equipe em ambiente de barbearia moderna"
                width={900}
                height={1100}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,63,40,0.08),rgba(10,63,40,0.32))]" />
            </div>
            <div className="absolute right-6 bottom-6 left-6 rounded-[24px] border border-white/20 bg-white/88 p-5 shadow-[var(--landing-shadow-soft)] backdrop-blur">
              <SectionPill className="bg-[var(--landing-accent-soft)]">
                Transicao e onboarding
              </SectionPill>
              <p className="mt-4 text-sm leading-6 text-[var(--landing-foreground-soft)]">
                No Plano Anual, a transicao de sistema pode entrar sem custo
                adicional. No Personalizado, ela e ajustada ao tamanho da
                operacao.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="overflow-hidden rounded-[32px] bg-[var(--landing-primary-dark)] px-6 py-10 text-white shadow-[0_24px_60px_rgba(11,51,36,0.18)] sm:px-10 lg:px-14 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionPill className="border-white/10 bg-white/10 text-white">
                Bigood para barbearias
              </SectionPill>
              <h2 className="mt-5 text-[clamp(32px,4vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em]">
                Pronto para profissionalizar a gestao da sua barbearia?
              </h2>
            </div>

            <div>
              <p className="max-w-[560px] text-base leading-7 text-white/76 md:text-lg">
                Escolha o plano, avance para o cadastro, confirme o checkout e
                siga para o painel com uma experiencia comercial clara do inicio
                ao fim.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <LandingLinkButton href="#planos" className={limeButtonClass}>
                  Ver planos
                </LandingLinkButton>
                <LandingLinkButton
                  href="/cadastro?plan=personalizado"
                  className={lightButtonClass}
                >
                  Falar com especialista
                </LandingLinkButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LandingFooter() {
  const columns = [
    {
      title: "Produto",
      links: [
        { label: "Produto", href: "#produto" },
        { label: "Recursos", href: "#recursos" },
        { label: "Planos", href: "#planos" },
      ],
    },
    {
      title: "Comercial",
      links: [
        { label: "Fluxo de assinatura", href: "#fluxo" },
        { label: "Plano Personalizado", href: "/cadastro?plan=personalizado" },
        { label: "Checkout", href: "/checkout?plan=pro-anual" },
        { label: "Meu painel", href: "/login" },
      ],
    },
    {
      title: "Regras",
      links: [
        { label: "Ate 3 unidades no Pro", href: "#planos" },
        { label: "Transicao gratis no anual", href: "#duvidas" },
        { label: "Sem plano gratuito", href: "#duvidas" },
        { label: "Outras formas de pagamento", href: "#duvidas" },
      ],
    },
    {
      title: "Acesso",
      links: [
        { label: "Entrar no painel", href: "/login" },
        { label: "Cadastro comercial", href: "/cadastro?plan=pro-anual" },
        { label: "Checkout anual", href: "/checkout?plan=pro-anual" },
      ],
    },
  ]

  return (
    <footer className="bg-[var(--landing-primary-dark)] text-white">
      <Container className="py-16">
        <div className="grid gap-8 rounded-[28px] border border-white/10 bg-white/4 p-6 backdrop-blur sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 px-5 py-5">
            <p className="text-sm font-semibold text-white/70">
              Comercial orientado para conversao
            </p>
            <p className="mt-3 text-lg font-extrabold">
              Escolha o plano, confirme o fluxo e entre no painel.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 px-5 py-5">
            <p className="text-sm font-semibold text-white/70">
              Formas de pagamento
            </p>
            <p className="mt-3 text-lg font-extrabold">
              Cartao no mensal. Pix, boleto e transferencia no anual.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 px-5 py-5">
            <p className="text-sm font-semibold text-white/70">Multiunidades</p>
            <p className="mt-3 text-lg font-extrabold">
              Ate 3 unidades no Pro. 4 ou mais entram no Personalizado.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 px-5 py-5">
            <p className="text-sm font-semibold text-white/70">
              Transicao de sistema
            </p>
            <p className="mt-3 text-lg font-extrabold">
              Gratis no anual e ajustada por operacao no Personalizado.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <BrandMark inverse />
            <p className="mt-5 max-w-[360px] text-sm leading-6 text-white/68">
              Sistema de gestao para barbearias que querem organizar agenda,
              recorrencia, caixa, clientes e crescimento em um unico lugar.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-base font-extrabold">{column.title}</h3>
                <ul className="mt-4 grid gap-3 text-sm text-white/68">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-[var(--landing-accent)] focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/54">
          (c) 2026 Bigood. Sistema de gestao para barbearias.
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
      className={cn(
        "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  )
}

function SplitSectionHeader({
  badge,
  title,
  description,
}: {
  badge: string
  title: string
  description: string
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-end">
      <div>
        <SectionPill>{badge}</SectionPill>
        <h2 className="mt-5 max-w-[620px] text-[clamp(32px,4vw,52px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-[var(--landing-primary-dark)]">
          {title}
        </h2>
      </div>
      <p className="max-w-[460px] text-base leading-7 text-[var(--landing-muted)]">
        {description}
      </p>
    </div>
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
        "inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-primary-soft)] px-[14px] py-2 text-sm font-bold text-[var(--landing-primary)]",
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
  variant = "default",
}: {
  href: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
}) {
  return (
    <Button
      size="lg"
      variant={variant}
      className={cn("w-fit rounded-full", className)}
      asChild
    >
      <Link href={href}>
        {children}
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
      </Link>
    </Button>
  )
}

function IconCircle({
  icon,
  className,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  className?: string
}) {
  return (
    <span
      className={cn(
        "grid size-[52px] place-items-center rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]",
        className
      )}
    >
      <HugeiconsIcon icon={icon} size={22} aria-hidden="true" />
    </span>
  )
}

function HeroCheck({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "flex gap-2 text-sm leading-6",
        dark ? "text-[var(--landing-foreground-soft)]" : "text-white/82"
      )}
    >
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={18}
        className={cn(
          "mt-1 shrink-0",
          dark
            ? "text-[var(--landing-primary)]"
            : "text-[var(--landing-accent)]"
        )}
        aria-hidden="true"
      />
      <span>{text}</span>
    </span>
  )
}

function ComparisonLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-[18px] bg-white px-3 py-2">
      <dt className="font-semibold text-[var(--landing-primary-dark)]">
        {label}
      </dt>
      <dd className="text-right text-[var(--landing-muted)]">{value}</dd>
    </div>
  )
}
