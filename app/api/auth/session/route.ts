import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME, getAuthSession } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const session = await getAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value)

  if (!session) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({
    user: {
      email: session.email,
      name: session.name,
      companyName: session.companyName,
      hasActivePlan: session.hasActivePlan,
      planKey: session.planKey,
    },
  })
}
