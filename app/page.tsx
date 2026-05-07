import type { Metadata } from "next"

import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: {
    absolute: "Bigood | Sistema de Gestao para Barbearias",
  },
  description:
    "Gerencie agenda, clientes, caixa, financeiro, profissionais, servicos, planos e assinaturas da sua barbearia com o Bigood.",
  keywords: [
    "sistema para barbearia",
    "software para barbearia",
    "gestao de barbearia",
    "agenda online para barbearia",
    "sistema de agendamento para barbeiros",
    "SaaS para barbearia",
    "plano de assinatura para barbearia",
    "Bigood",
  ],
  openGraph: {
    title: "Bigood | Cabelo, barba e gestao para o seu negocio crescer",
    description:
      "Agenda, clientes, caixa, financeiro, planos e recorrencia em um unico painel para barbearias.",
    type: "website",
    locale: "pt_BR",
  },
}

export default function Page() {
  return <LandingPage />
}
