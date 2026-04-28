import { CrownIcon } from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

const plans = [
  ["Corte Mensal", "1 corte por mes", "R$ 79,90", "84 assinantes", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
  ["Barba Club", "4 barbas por mes", "R$ 119,90", "37 assinantes", <StatusBadge key="active2" tone="green">Ativo</StatusBadge>],
  ["Premium", "Corte + barba semanal", "R$ 249,90", "21 assinantes", <StatusBadge key="featured" tone="amber">Destaque</StatusBadge>],
  ["Kids", "2 cortes infantis", "R$ 99,90", "12 assinantes", <StatusBadge key="draft" tone="neutral">Rascunho</StatusBadge>],
]

export default function PlanosPage() {
  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Assinantes ativos"
          value="154"
          change="+18 no mes atual"
          icon={CrownIcon}
          tone="green"
        />
        <MetricCard
          title="MRR estimado"
          value="R$ 18.930"
          change="Receita recorrente mensal"
          icon={CrownIcon}
          tone="blue"
        />
        <MetricCard
          title="Cancelamentos"
          value="6"
          change="Churn de 3,7%"
          icon={CrownIcon}
          tone="amber"
        />
      </div>

      <SectionCard
        title="Planos de assinatura"
        description="Produtos recorrentes da barbearia"
        action={<Button size="sm">Novo plano</Button>}
      >
        <SimpleTable
          columns={["Plano", "Beneficio", "Preco", "Base", "Status"]}
          rows={plans}
        />
      </SectionCard>
    </>
  )
}
