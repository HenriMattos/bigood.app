import { NextResponse } from "next/server"

import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE,
  createAuthSession,
  getAdminCredentials,
} from "@/lib/auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const password = typeof body?.password === "string" ? body.password : ""
  const credentials = getAdminCredentials()

  if (email !== credentials.email || password.trim() !== credentials.password) {
    return NextResponse.json(
      { message: "Credenciais administrativas invalidas." },
      { status: 401 }
    )
  }

  const user = {
    email,
    name: "Administrador Bigood",
    companyName: "Bigood",
    hasActivePlan: true,
    planKey: "pro-anual",
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
