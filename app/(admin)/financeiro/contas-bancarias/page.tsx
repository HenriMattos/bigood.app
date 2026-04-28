import {
  Bank02Icon,
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
  CircleCheckIcon,
  CircleXIcon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const bankAccounts = [
  ["Conta Corrente - Bradesco", "1234-5", "R$ 15.420,00", <StatusBadge key="active" tone="green">Ativa</StatusBadge>],
  ["Conta Poupança - Itaú", "6789-0", "R$ 8.750,50", <StatusBadge key="active" tone="green">Ativa</StatusBadge>],
  ["Conta Salário - Santander", "3456-2", "R$ 3.210,75", <StatusBadge key="active" tone="green">Ativa</StatusBadge>],
  ["Cartão Corporativo", "****-1234", "R$ -1.250,00 (limite: R$ 10.000)", <StatusBadge key="warning" tone="amber">Em uso</StatusBadge>],
]

const recentTransactions = [
  ["28/04/2026", "Recebimento - Corte João Silva", "R$ 45,00", <StatusBadge key="income" tone="green">Entrada</StatusBadge>],
  ["28/04/2026", "Pagamento - Conta de Luz", "R$ 120,00", <StatusBadge key="expense" tone="red">Saída</StatusBadge>],
  ["27/04/2026", "Recebimento - Corte Maria Oliveira", "R$ 35,00", <StatusBadge key="income" tone="green">Entrada</StatusBadge>],
  ["27/04/2026", "Transferência - Conta Poupança", "R$ 500,00", <StatusBadge key="transfer" tone="blue">Transferência</StatusBadge>],
  ["26/04/2026", "Recebimento - Pacote Barba", "R$ 80,00", <StatusBadge key="income" tone="green">Entrada</StatusBadge>],
]

export default function ContasBancariasPage() {
  const [selectedAccount, setSelectedAccount] = useState(null)

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Saldo Total"
          value="R$ 26.130,50"
          change="+12% vs mês anterior"
          icon={Bank02Icon}
          tone="green"
        />
        <MetricCard
          title="Entradas Este Mês"
          value="R$ 8.450,00"
          change="+18% vs mês anterior"
          icon={MoneyReceiveCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Saídas Este Mês"
          value="R$ 5.230,00"
          change="+5% vs mês anterior"
          icon={MoneySendCircleIcon}
          tone="red"
        />
      </div>

      <SectionCard
        title="Contas Bancárias Cadastradas"
        description="Gerencie todas as contas da sua barbearia"
        action={<Button size="sm">Nova Conta</Button>}
      >
        <SimpleTable
          columns={["Banco/Agência", "Conta", "Saldo", "Status"]}
          rows={bankAccounts}
        />
      </SectionCard>

      <SectionCard
        title="Transações Recentes"
        description="Últimas movimentações financeiras"
      >
        <SimpleTable
          columns={["Data", "Descrição", "Valor", "Tipo"]}
          rows={recentTransactions}
        />
      </SectionCard>
    </>
  )
}