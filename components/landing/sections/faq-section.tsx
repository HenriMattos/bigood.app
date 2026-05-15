"use client"

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

import { Container } from "@/components/landing/ui/container"
import { IconBubble } from "@/components/landing/ui/icon-bubble"
import { SectionHeader } from "@/components/landing/ui/section-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/components/landing/landing-data"

export function FaqSection() {
  return (
    <section
      className="landing-guide-section landing-scroll-reveal section-space bg-white"
      id="duvidas"
      aria-labelledby="faq-heading"
    >
      <Container className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
        <SectionHeader
          eyebrow="Dúvidas frequentes"
          title="Antes da demonstração, tire suas dúvidas."
          text="Respostas diretas sem enrolação. Se ficar alguma pergunta, o time comercial continua a conversa."
        />

        <Accordion
          type="single"
          collapsible
          className="overflow-hidden rounded-[20px] border border-[var(--landing-border)] bg-white"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="border-b border-[var(--landing-border)] bg-transparent px-5 last:border-b-0"
            >
              <AccordionTrigger className="py-4 text-left text-lg font-black text-[var(--landing-primary-dark)] hover:text-[var(--landing-primary)]">
                <div className="flex items-center gap-3">
                  <IconBubble
                    icon={CheckmarkCircle02Icon}
                    className="size-8 shrink-0"
                  />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="max-w-[720px] pb-5 text-[15px] leading-6 text-[var(--landing-muted)]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
