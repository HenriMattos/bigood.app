import {
  ChartIncreaseIcon,
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

const entries = [
  ["Servicos", "Receitas de atendimento", "R$ 32.480", <StatusBadge key="up" tone="green">+12%</StatusBadge>],
  ["Produtos", "Pomadas, shampoos e kits", "R$ 4.260", <StatusBadge key="flat" tone="blue">Estavel</StatusBadge>],
  ["Folha", "Comissoes e salarios", "R$ 14.900", <StatusBadge key="cost" tone="amber">Custo</StatusBadge>],
  ["Operacao", "Aluguel, energia e compras", "R$ 7.640", <StatusBadge key="out" tone="red">Despesa</StatusBadge>],
]

export default function FinanceiroPage() {
  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Receita mensal"
          value="R$ 36.740"
          change="+9% vs mes anterior"
          icon={MoneyReceiveCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Despesas"
          value="R$ 22.540"
          change="61% da receita"
          icon={MoneySendCircleIcon}
          tone="red"
        />
        <MetricCard
          title="Lucro estimado"
          value="R$ 14.200"
          change="Margem de 38,6%"
          icon={ChartIncreaseIcon}
          tone="blue"
        />
      </div>

      <SectionCard
        title="Categorias financeiras"
        description="Resumo para acompanhamento mensal"
        action={<Button size="sm">Lancamento</Button>}
      >
        <SimpleTable
          columns={["Categoria", "Descricao", "Valor", "Status"]}
          rows={entries}
        />
      </SectionCard>
    </>
  )
}
