import { Building02Icon } from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

const fields = [
  ["Nome fantasia", "MyDash Barber"],
  ["CNPJ", "00.000.000/0001-00"],
  ["Telefone", "(11) 99999-0000"],
  ["Endereco", "Rua das Navalhas, 120 - Centro"],
  ["Horario", "Seg a sab, 08:00 as 20:00"],
  ["Comissao padrao", "40% por atendimento"],
]

export default function EmpresaPage() {
  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Unidade"
          value="Matriz"
          change="Cadastro principal ativo"
          icon={Building02Icon}
          tone="green"
        />
        <MetricCard
          title="Profissionais"
          value="3"
          change="Todos com agenda habilitada"
          icon={Building02Icon}
          tone="blue"
        />
        <MetricCard
          title="Status fiscal"
          value="Pendente"
          change="Configure dados para notas"
          icon={Building02Icon}
          tone="amber"
        />
      </div>

      <SectionCard
        title="Dados da empresa"
        description="Informacoes usadas em agenda, recibos e relatorios"
        action={<Button size="sm">Editar dados</Button>}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-md border bg-background p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 text-sm font-semibold">{value}</p>
            </div>
          ))}
          <div className="rounded-md border bg-background p-4 md:col-span-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Integracoes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge tone="green">WhatsApp ativo</StatusBadge>
              <StatusBadge tone="amber">Gateway pendente</StatusBadge>
              <StatusBadge tone="neutral">Nota fiscal nao configurada</StatusBadge>
            </div>
          </div>
        </div>
      </SectionCard>
    </>
  )
}
