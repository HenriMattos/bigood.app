import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE,
  createAuthSession,
  getAuthSession,
} from "@/lib/auth"

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const session = await getAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value)

  if (!session) {
    return NextResponse.json(
      { message: "Faca login antes de assinar um plano." },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)
  const planKey =
    typeof body?.planKey === "string" && body.planKey
      ? body.planKey
      : "pro-anual"

  const user = {
    email: session.email,
    name: session.name,
    companyName: session.companyName,
    hasActivePlan: true,
    planKey,
  }

  const response = NextResponse.json({ ok: true, user })

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: await createAuthSession(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE,
  })

  return response
}
