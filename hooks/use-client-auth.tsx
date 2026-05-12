"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import type { ClientAuthUser } from "@/types/client-auth"
import * as authService from "@/services/client-auth"

type ClientAuthContextType = {
  user: ClientAuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (slug: string, identifier: string, password: string) => Promise<void>
  register: (
    slug: string,
    input: {
      name: string
      phone: string
      email: string
      password: string
      confirmPassword: string
    }
  ) => Promise<void>
  logout: (slug: string) => Promise<void>
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(
  undefined
)

export function ClientAuthProvider({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const [user, setUser] = useState<ClientAuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    authService.getClientSession(slug).then((session) => {
      if (!mounted) return

      if (session) {
        setUser(session.user)
        setToken(session.token)
      }

      setIsLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [slug])

  const login = useCallback(
    async (loginSlug: string, identifier: string, password: string) => {
      const result = await authService.loginClient(loginSlug, {
        identifier,
        password,
      })
      setUser(result.user)
      setToken(result.token)
    },
    []
  )

  const register = useCallback(
    async (
      registerSlug: string,
      input: {
        name: string
        phone: string
        email: string
        password: string
        confirmPassword: string
      }
    ) => {
      const result = await authService.registerClient(registerSlug, input)
      setUser(result.user)
      setToken(result.token)
    },
    []
  )

  const logout = useCallback(async (logoutSlug: string) => {
    await authService.logoutClient(logoutSlug)
    setUser(null)
    setToken(null)
  }, [])

  return (
    <ClientAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext)

  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider")
  }

  return context
}
