"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { ClientPortalProvider } from "./portal-provider"
import { isPortalClientAuthenticated } from "./portal-data"
import { PortalChrome } from "./portal-chrome"

export function ClientPortalRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const isLoginRoute = pathname === "/cliente/login"

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!mounted || isLoginRoute) {
      return
    }

    if (!isPortalClientAuthenticated()) {
      const next = encodeURIComponent(pathname || "/cliente")
      router.replace(`/cliente/login?next=${next}`)
      return
    }
  }, [isLoginRoute, mounted, pathname, router])

  if (!mounted) {
    return <div className="h-dvh bg-[var(--background)]" aria-busy="true" />
  }

  if (!isLoginRoute && !isPortalClientAuthenticated()) {
    return <div className="h-dvh bg-[var(--background)]" aria-busy="true" />
  }

  if (isLoginRoute) {
    return <ClientPortalProvider>{children}</ClientPortalProvider>
  }

  return (
    <ClientPortalProvider>
      <PortalChrome>{children}</PortalChrome>
    </ClientPortalProvider>
  )
}
