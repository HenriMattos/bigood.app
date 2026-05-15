export type PlanKey = "pro-mensal" | "pro-anual" | "personalizado"

export type LandingPlan = {
  key: PlanKey
  name: string
  badge: string
  price: string
  period: string
  description: string
  highlighted: boolean
  cta: string
  payment: string
  transition: string
  features: string[]
}
