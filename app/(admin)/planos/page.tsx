import { CrownIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

import { MetricCard } from "@/components/admin/metric-card"
import { database } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
import { Button } from "@/components/ui/button"

export default function PlanosPage() {
  const activeSubscriptions = database.subscriptions.filter(
    (subscription) => subscription.status === "Ativa"
  )
  const canceledOrPaused = database.subscriptions.filter(
    (subscription) => subscription.status === "Pausada"
  ).length
  const planRows = database.plans.map((plan) => {
    const subscribers = database.subscriptions.filter(
      (subscription) => subscription.plan === plan.name
    ).length

    return [
      plan.name,
      plan.benefit,
      formatCurrency(plan.price),
      `${subscribers} assinantes`,
      <StatusBadge
        key={plan.id}
        tone={plan.status === "Destaque" ? "amber" : "green"}
      >
        {plan.status}
      </StatusBadge>,
    ]
  })

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Assinantes ativos"
          value={String(activeSubscriptions.length)}
          change={`${database.analytics.newClientsThisMonth} novos clientes no mes`}
          icon={CrownIcon}
          tone="green"
        />
        <MetricCard
          title="MRR estimado"
          value={formatCurrency(database.analytics.monthlyRecurringRevenue)}
          change="Receita recorrente mensal"
          icon={CrownIcon}
          tone="blue"
        />
        <MetricCard
          title="Pausadas"
          value={String(canceledOrPaused)}
          change="Assinaturas sem cobranca ativa"
          icon={CrownIcon}
          tone="amber"
        />
      </div>

      <SectionCard
        title="Planos de assinatura"
        description="Produtos recorrentes da barbearia"
        action={
          <Button size="sm" asChild>
            <Link href="/planos/criar">Novo plano</Link>
          </Button>
        }
      >
        {database.plans.length === 0 ? (
          <EmptyState
            icon={SparklesIcon}
            title="Nenhum plano criado"
            description="Crie planos de assinatura para fidelizar seus clientes e garantir receita recorrente."
            actionLabel="Criar meu primeiro plano"
            href="/planos/criar"
          />
        ) : (
          <SimpleTable
            columns={["Plano", "Beneficio", "Preco", "Base", "Status"]}
            rows={planRows}
          />
        )}
      </SectionCard>
    </>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
