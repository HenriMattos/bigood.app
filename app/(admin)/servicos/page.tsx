import { ScissorIcon } from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

const services = [
  ["Corte social", "35 min", "R$ 55,00", "Todos", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
  ["Degrade", "45 min", "R$ 65,00", "Caio, Bruno", <StatusBadge key="active2" tone="green">Ativo</StatusBadge>],
  ["Barba completa", "30 min", "R$ 45,00", "Bruno", <StatusBadge key="active3" tone="green">Ativo</StatusBadge>],
  ["Corte premium", "60 min", "R$ 110,00", "Diego", <StatusBadge key="premium" tone="amber">Premium</StatusBadge>],
]

export default function ServicosPage() {
  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Servicos ativos"
          value="18"
          change="4 categorias cadastradas"
          icon={ScissorIcon}
          tone="green"
        />
        <MetricCard
          title="Mais vendido"
          value="Degrade"
          change="126 atendimentos no mes"
          icon={ScissorIcon}
          tone="blue"
        />
        <MetricCard
          title="Duracao media"
          value="42 min"
          change="Base dos ultimos 30 dias"
          icon={ScissorIcon}
          tone="amber"
        />
      </div>

      <SectionCard
        title="Catalogo de servicos"
        description="Preco, duracao e profissionais habilitados"
        action={<Button size="sm">Novo servico</Button>}
      >
        <SimpleTable
          columns={["Servico", "Duracao", "Preco", "Profissionais", "Status"]}
          rows={services}
        />
      </SectionCard>
    </>
  )
}
