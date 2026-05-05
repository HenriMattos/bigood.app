import type { Metadata } from "next"

import { ClientPortalRoot } from "@/components/client-portal/client-portal-root"

export const metadata: Metadata = {
  title: "Área do cliente",
  description: "Agende horários e acompanhe seu plano na barbeararia.",
}

export default function ClienteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientPortalRoot>{children}</ClientPortalRoot>
}
