import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE_NAME, verifyAuthSession } from "@/lib/auth"

const protectedPrefixes = [
  "/agenda",
  "/assinaturas",
  "/caixa",
  "/clientes",
  "/dashboard",
  "/empresa",
  "/financeiro",
  "/planos",
  "/profissionais",
  "/servicos",
]

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  const isAuthenticated = await verifyAuthSession(
    request.cookies.get(AUTH_COOKIE_NAME)?.value
  )

  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isProtected || isAuthenticated) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/", request.url)
  loginUrl.searchParams.set("next", pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
