import {
  CreditCard02Icon,
  ArrowLeftRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const paymentMethods = [
  ["Dinheiro", "Pagamento em espécie", "Ativo", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
  ["Cartão de Débito", "Visa, Mastercard, Elo", "Ativo", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
  ["Cartão de Crédito", "Visa, Mastercard, Elo", "Ativo", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
  ["Pix", "Chave: (11) 99999-9999", "Ativo", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
  ["Vale Refeição", "VR, Alelo, Sodexo", "Ativo", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
  ["Vale Transporte", "ET", "Ativo", <StatusBadge key="active" tone="green">Ativo</StatusBadge>],
]

const transactionByMethod = [
  ["Dinheiro", "45%", "R$ 16.533", "120 transações"],
  ["Cartão de Débito", "25%", "R$ 9.185", "65 transações"],
  ["Cartão de Crédito", "20%", "R$ 7.348", "52 transações"],
  ["Pix", "8%", "R$ 2.939", "22 transações"],
  ["Vale Refeição", "1,5%", "R$ 551", "8 transações"],
  ["Vale Transporte", "0,5%", "R$ 184", "3 transações"],
]

export default function FormasPagamentoPage() {
  const [selectedMethod, setSelectedMethod] = useState(null)

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Transações Hoje"
          value="R$ 1.240"
          change="+15% vs ontem"
          icon={Wallet02Icon}
          tone="green"
        />
        <MetricCard
          title="Ticket Médio"
          value="R$ 42,50"
          change="+3% vs mês anterior"
          icon={ArrowLeftRightIcon}
          tone="blue"
        />
        <MetricCard
          title="Taxa de Aprovação"
          value="98,5%"
          change="+0,5 pp vs mês anterior"
          icon={CircleCheckIcon}
          tone="green"
        />
      </div>

      <section className="grid gap-6">
        <div className="col-span-1 lg:col-span-2">
          <SectionCard
            title="Formas de Pagamento Cadastradas"
            description="Gerencie as formas de pagamento aceitas na sua barbearia"
            action={<Button size="sm">+ Nova Forma</Button>}
          >
            <SimpleTable
              columns={["Forma", "Descrição", "Status", "Ação"]}
              rows={paymentMethods}
            />
          </SectionCard>
        </div>

        <div className="col-span-1 lg:col-span-1">
          <SectionCard
            title="Distribuição por Forma de Pagamento"
            description="Percentual de uso de cada forma de pagamento no mês"
          >
            <SimpleTable
              columns={["Forma", "% do Total", "Valor (R$)", "Qtd. Transações"]}
              rows={transactionByMethod}
            />
          </SectionCard>
        </div>
      </section>
    </>
  )
}