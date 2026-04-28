import {
  ChartIncreaseIcon,
  ChartDecreaseIcon,
  CircleDollarSignIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  Bank02Icon,
  File01Icon,
  CreditCard02Icon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Link } from "next/navigation"

const financialOverview = [
  ["Receita Bruta", "R$ 48.200", "+12,5% vs mês anterior"],
  ["Receita Líquida", "R$ 42.800", "+10,8% vs mês anterior"],
  ["Despesas Fixas", "R$ 18.900", "+2,3% vs mês anterior"],
  ["Despesas Variáveis", "R$ 9.350", "+15,7% vs mês anterior"],
  ["Lucro Operacional", "R$ 14.550", "+8,2% vs mês anterior"],
  ["Margem Líquida", "34,0%", "+1,2 pp vs mês anterior"],
]

const cashFlow = [
  ["Entradas", "R$ 42.800", "<span className='text-green-600'>+10,8%</span>"],
  ["Saídas", "R$ 28.250", "<span className='text-red-600'>+8,2%</span>"],
  ["Saldo Inicial", "R$ 15.600", "<span className='text-blue-600'>+5,1%</span>"],
  ["Saldo Final", "R$ 30.150", "<span className='text-green-600'>+93,3%</span>"],
]

export default function FinanceiroPage() {
  return (
    <>
      <div className="admin-metric-grid grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Receita Bruta"
          value="R$ 48.200"
          change="+12,5% vs mês anterior"
          icon={TrendingUpIcon}
          tone="green"
        />
        <MetricCard
          title="Receita Líquida"
          value="R$ 42.800"
          change="+10,8% vs mês anterior"
          icon={CircleDollarSignIcon}
          tone="green"
        />
        <MetricCard
          title="Despesas Totais"
          value="R$ 28.250"
          change="+8,2% vs mês anterior"
          icon={ChartDecreaseIcon}
          tone="red"
        />
        <MetricCard
          title="Lucro Operacional"
          value="R$ 14.550"
          change="+8,2% vs mês anterior"
          icon={ShieldCheckIcon}
          tone="blue"
        />
        <MetricCard
          title="Margem Líquida"
          value="34,0%"
          change="+1,2 pp vs mês anterior"
          icon={ChartIncreaseIcon}
          tone="green"
        />
        <MetricCard
          title="Caixa Disponível"
          value="R$ 30.150"
          change="+93,3% vs mês anterior"
          icon={Bank02Icon}
          tone="green"
        />
      </div>

      <section className="grid gap-6 mt-8">
        <div className="col-span-1 lg:col-span-2">
          <SectionCard
            title="Visão Geral Financeira"
            description="Indicadores-chave de desempenho da barbearia"
          >
            <SimpleTable
              columns={["Indicador", "Valor", "Variação"]}
              rows={financialOverview}
            />
          </SectionCard>
        </div>

        <div className="col-span-1 lg:col-span-1">
          <SectionCard
            title="Fluxo de Caixa"
            description="Entradas e saídas de dinheiro no período"
          >
            <SimpleTable
              columns={["Categoria", "Valor", "Variação"]}
              rows={cashFlow}
            />
          </SectionCard>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Acesso rápido aos módulos financeiros</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/financeiro/contas-bancarias" className="group flex items-center rounded-xl border border-sidebar-border bg-background/60 p-6 hover:bg-sidebar-accent/50 transition-all duration-200">
            <div className="flex items-center justify-center size-10 mb-3">
              <Bank02Icon size={24} className="text-sidebar-primary" />
            </div>
            <h3 className="font-medium text-sidebar-foreground">Contas bancárias</h3>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Gerencie suas contas bancárias e fluxo de caixa</p>
          </Link>

          <Link href="/financeiro/categorias" className="group flex items-center rounded-xl border border-sidebar-border bg-background/60 p-6 hover:bg-sidebar-accent/50 transition-all duration-200">
            <div className="flex items-center justify-center size-10 mb-3">
              <File01Icon size={24} className="text-sidebar-primary" />
            </div>
            <h3 className="font-medium text-sidebar-foreground">Categorias financeiras</h3>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Organize receitas e despesas por categoria</p>
          </Link>

          <Link href="/financeiro/formas-pagamento" className="group flex items-center rounded-xl border border-sidebar-border bg-background/60 p-6 hover:bg-sidebar-accent/50 transition-all duration-200">
            <div className="flex items-center justify-center size-10 mb-3">
              <CreditCard02Icon size={24} className="text-sidebar-primary" />
            </div>
            <h3 className="font-medium text-sidebar-foreground">Formas de pagamento</h3>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Configure e acompanhe as formas de pagamento aceitas</p>
          </Link>
        </div>
      </section>
    </>
  )
}
