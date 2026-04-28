import {
  File01Icon,
  ChartIncreaseIcon,
  ChartDecreaseIcon,
  CirclePlusIcon,
  CircleCheckIcon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const financialCategories = [
  ["Receitas de Serviços", "Cortes, barba, pacotes", "R$ 32.480", <StatusBadge key="revenue" tone="green">Receita</StatusBadge>],
  ["Receitas de Produtos", "Pomadas, shampoos, acessórios", "R$ 4.260", <StatusBadge key="revenue" tone="green">Receita</StatusBadge>],
  ["Folha de Pagamento", "Salários e comissões da equipe", "R$ 14.900", <StatusBadge key="expense" tone="red">Despesa</StatusBadge>],
  ["Aluguel e Utilidades", "Locação, energia, água, internet", "R$ 3.800", <StatusBadge key="expense" tone="red">Despesa</StatusBadge>],
  ["Marketing e Publicidade", "Ads, redes sociais, materiais", "R$ 1.200", <StatusBadge key="expense" tone="red">Despesa</StatusBadge>],
  ["Estoques e Insumos", "Produtos para revenda e uso", "R$ 1.800", <StatusBadge key="expense" tone="red">Despesa</StatusBadge>],
  ["Manutenção e Equipamentos", "Consertos, afiadeiras, ferramentas", "R$ 840", <StatusBadge key="expense" tone="red">Despesa</StatusBadge>],
]

const categoryPerformance = [
  ["Receitas de Serviços", "+12%", "+8%", "+15%"],
  ["Receitas de Produtos", "+5%", "+3%", "+7%"],
  ["Folha de Pagamento", "+2%", "-1%", "+4%"],
  ["Aluguel e Utilidades", "0%", "0%", "0%"],
  ["Marketing e Publicidade", "+18%", "+10%", "+25%"],
  ["Estoques e Insumos", "-5%", "-8%", "-2%"],
  ["Manutenção e Equipamentos", "+3%", "+1%", "+6%"],
]

export default function CategoriasPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [viewMode, setViewMode] = useState('overview') // overview or detail

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Total Receitas"
          value="R$ 36.740"
          change="+9% vs mês anterior"
          icon={ChartIncreaseIcon}
          tone="green"
        />
        <MetricCard
          title="Total Despesas"
          value="R$ 22.540"
          change="+4% vs mês anterior"
          icon={ChartDecreaseIcon}
          tone="red"
        />
        <MetricCard
          title="Margem Líquida"
          value="38,6%"
          change="+2,3 pp vs mês anterior"
          icon={File01Icon}
          tone="blue"
        />
      </div>

      <section className="grid gap-6">
        <div className="col-span-1 lg:col-span-2">
          <SectionCard
            title="Categorias Financeiras"
            description="Organize suas receitas e despesas para melhor controle"
            action={<Button size="sm" onClick={() => setViewMode('detail')}>+ Nova Categoria</Button>}
          >
            {viewMode === 'overview' ? (
              <SimpleTable
                columns={["Categoria", "Descrição", "Valor Mensal", "Tipo"]}
                rows={financialCategories}
              />
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nova Categoria Financeira</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome da Categoria</label>
                    <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Ex: Receitas de Coloração" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <textarea className="w-full px-3 py-2 border rounded" placeholder="Descreva detalhadamente esta categoria" rows={3}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select className="w-full px-3 py-2 border rounded">
                      <option value="receita">Receita</option>
                      <option value="despesa">Despesa</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setViewMode('overview')}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={() => setViewMode('overview')}>
                      Salvar Categoria
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="col-span-1 lg:col-span-1">
          <SectionCard
            title="Performance por Categoria"
            description="Variação percentual das categorias nos períodos"
          >
            <SimpleTable
              columns={["Categoria", "Mensal", "Trimestral", "Semestral"]}
              rows={categoryPerformance}
            />
          </SectionCard>
        </div>
      </section>
    </>
  )
}