"use client"

import { PortalBookingView } from "@/components/client-portal/portal-booking-view"
import { useClientPortal } from "@/components/client-portal/portal-provider"

export default function ClienteAgendarPage() {
  const { subscription, currentPlan } = useClientPortal()

  return (
    <PortalBookingView
      key={`${subscription?.plan ?? "noplan"}-${currentPlan?.id ?? 0}`}
    />
  )
}
