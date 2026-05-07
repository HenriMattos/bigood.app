import type { Metadata } from "next"

import { ClientPortalShell } from "@/components/client-portal/client-portal-shell"

type BarberPortalPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const metadata: Metadata = {
  title: "Portal do Cliente",
  description:
    "Portal mobile para agendamento, planos e perfil do cliente da barbearia.",
}

export default async function BarberPortalPage({
  params,
}: BarberPortalPageProps) {
  const { slug } = await params

  return <ClientPortalShell slug={slug} />
}
