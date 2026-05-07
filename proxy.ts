import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE_NAME, getAuthSession } from "@/lib/auth"

const dashboardPrefixes = [
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

const subscriptionPrefixes = ["/checkout", "/escolher-plano"]
const accountPrefixes = ["/conta"]

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const session = await getAuthSession(token)
  const isDashboardRoute = dashboardPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  const isSubscriptionRoute = subscriptionPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  const isAccountRoute = accountPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  const requestedPath = `${pathname}${request.nextUrl.search}`

  if (isDashboardRoute) {
    if (!session) {
      return redirectToLogin(request, requestedPath)
    }

    if (!session.hasActivePlan) {
      const planUrl = new URL("/escolher-plano", request.url)
      planUrl.searchParams.set("next", requestedPath)
      return NextResponse.redirect(planUrl)
    }

    return NextResponse.next()
  }

  if ((isSubscriptionRoute || isAccountRoute) && !session) {
    return redirectToLogin(request, requestedPath)
  }

  if (pathname === "/login" && session?.hasActivePlan) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (pathname === "/escolher-plano" && session?.hasActivePlan) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("next", pathname)

  if (pathname.startsWith("/escolher-plano") || pathname.startsWith("/checkout")) {
    loginUrl.searchParams.set("mode", "signup")
  }

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
