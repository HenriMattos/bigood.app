import type { Metadata } from "next"

import { LandingPage } from "@/components/landing/landing-page"
import { JsonLd } from "@/components/landing/json-ld"

export const metadata: Metadata = {
  title: {
    absolute: "Bigood | Sistema de Gestão para Barbearias",
  },
  description:
    "Conheça o Bigood: sistema para gerenciar agenda, clientes, caixa, profissionais, planos e portal da sua barbearia.",
  keywords: [
    "sistema para barbearia",
    "software para barbearia",
    "gestão de barbearia",
    "agenda online para barbearia",
    "sistema de agendamento para barbeiros",
    "SaaS para barbearia",
    "plano de assinatura para barbearia",
    "Bigood",
  ],
  openGraph: {
    title: "Bigood | Cabelo, barba e gestão para o seu negócio crescer",
    description:
      "Agenda, clientes, caixa, planos e portal em um único painel para barbearias.",
    type: "website",
    locale: "pt_BR",
    siteName: "Bigood",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Page() {
  return (
    <>
      <JsonLd />
      <LandingPage />
    </>
  )
}
