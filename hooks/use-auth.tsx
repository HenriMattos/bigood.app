"use client"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  email: string
  name?: string
  companyName?: string
  hasActivePlan: boolean
  planKey?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  refresh: () => Promise<User | null>
  setAuthenticatedUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function readSession() {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
    credentials: "include",
  }).catch(() => null)

  if (!response?.ok) {
    return null
  }

  const payload = (await response.json().catch(() => null)) as {
    user?: User | null
  } | null

  return payload?.user ?? null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function refresh() {
    const nextUser = await readSession()
    setUser(nextUser)
    setIsLoading(false)
    return nextUser
  }

  useEffect(() => {
    let isMounted = true

    void readSession().then((nextUser) => {
      if (!isMounted) {
        return
      }

      setUser(nextUser)
      setIsLoading(false)
    })

    function syncAuth() {
      void refresh()
    }

    window.addEventListener("storage", syncAuth)
    window.addEventListener("bigood_auth_sync", syncAuth)

    return () => {
      isMounted = false
      window.removeEventListener("storage", syncAuth)
      window.removeEventListener("bigood_auth_sync", syncAuth)
    }
  }, [])

  function setAuthenticatedUser(nextUser: User | null) {
    setUser(nextUser)
    window.dispatchEvent(new Event("bigood_auth_sync"))
  }

  async function logout() {
    setUser(null)
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null)
    window.dispatchEvent(new Event("bigood_auth_sync"))
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refresh, setAuthenticatedUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
