import { NextResponse } from "next/server"

import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE,
  createAuthSession,
} from "@/lib/auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const password = typeof body?.password === "string" ? body.password : ""
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const companyName =
    typeof body?.companyName === "string" ? body.companyName.trim() : ""

  if (!email || !password || !name) {
    return NextResponse.json(
      { message: "Preencha seu nome, e-mail e senha." },
      { status: 400 }
    )
  }

  const user = {
    email,
    name,
    companyName: companyName || "Minha Barbearia",
    hasActivePlan: false,
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
