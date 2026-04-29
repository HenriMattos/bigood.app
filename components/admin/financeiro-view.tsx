"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeftRightIcon,
  BankIcon,
  CancelCircleIcon,
  ChartDecreaseIcon,
  ChartIncreaseIcon,
  CheckmarkCircle01Icon,
  CreditCardIcon,
  Delete02Icon,
  DollarCircleIcon,
  File01Icon,
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
  PlusSignCircleIcon,
  ShieldCheck,
  TrendingUp,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Tone = "green" | "amber" | "red" | "blue" | "neutral"
type FinancialType = "Receita" | "Despesa"
type AccountStatus = "Ativa" | "Em uso" | "Inativa"
type PaymentStatus = "Ativo" | "Inativo"
type ModalMode = "create" | "edit"

type FinancialMovement = {
  id: number
  date: string
  description: string
  category: string
  account: string
  amount: number
  type: FinancialType
}

type BankAccount = {
  id: number
  name: string
  agency: string
  account: string
  type: string
  balance: number
  status: AccountStatus
}

type FinancialCategory = {
  id: number
  name: string
  description: string
  type: FinancialType
  monthlyAmount: number
  trend: number
}

type PaymentMethod = {
  id: number
  name: string
  description: string
  status: PaymentStatus
  fee: number
  settlement: string
  amount: number
  transactions: number
}

const dialogPanelClass =
  "bottom-0 left-0 top-auto grid h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)_auto] rounded-b-none rounded-t-xl border-x-0 border-b-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:h-[min(40rem,calc(100dvh-1rem))] sm:w-[calc(100vw-2rem)] sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md sm:border"

const initialMovements: FinancialMovement[] = [
  {
    id: 1,
    date: "28/04/2026",
    description: "Recebimento - Corte João Silva",
    category: "Receitas de Serviços",
    account: "Conta Corrente - Bradesco",
    amount: 45,
    type: "Receita",
  },
  {
    id: 2,
    date: "28/04/2026",
    description: "Pagamento - Conta de luz",
    category: "Aluguel e Utilidades",
    account: "Conta Corrente - Bradesco",
    amount: 120,
    type: "Despesa",
  },
  {
    id: 3,
    date: "27/04/2026",
    description: "Recebimento - Corte Maria Oliveira",
    category: "Receitas de Serviços",
    account: "Pix",
    amount: 35,
    type: "Receita",
  },
  {
    id: 4,
    date: "27/04/2026",
    description: "Transferência - Conta poupança",
    category: "Transferências",
    account: "Conta Poupança - Itaú",
    amount: 500,
    type: "Receita",
  },
]

const initialAccounts: BankAccount[] = [
  {
    id: 1,
    name: "Conta Corrente - Bradesco",
    agency: "1234-5",
    account: "98765-0",
    type: "Conta corrente",
    balance: 15420,
    status: "Ativa",
  },
  {
    id: 2,
    name: "Conta Poupança - Itaú",
    agency: "6789-0",
    account: "22334-9",
    type: "Poupança",
    balance: 8750.5,
    status: "Ativa",
  },
  {
    id: 3,
    name: "Conta Salário - Santander",
    agency: "3456-2",
    account: "44221-7",
    type: "Conta salário",
    balance: 3210.75,
    status: "Ativa",
  },
  {
    id: 4,
    name: "Cartão Corporativo",
    agency: "0001",
    account: "****-1234",
    type: "Cartão de crédito",
    balance: -1250,
    status: "Em uso",
  },
]

const initialCategories: FinancialCategory[] = [
  {
    id: 1,
    name: "Receitas de Serviços",
    description: "Cortes, barba, pacotes e recorrências",
    type: "Receita",
    monthlyAmount: 32480,
    trend: 12,
  },
  {
    id: 2,
    name: "Receitas de Produtos",
    description: "Pomadas, shampoos e acessórios",
    type: "Receita",
    monthlyAmount: 4260,
    trend: 5,
  },
  {
    id: 3,
    name: "Folha de Pagamento",
    description: "Salários, comissões e benefícios",
    type: "Despesa",
    monthlyAmount: 14900,
    trend: 2,
  },
  {
    id: 4,
    name: "Aluguel e Utilidades",
    description: "Locação, energia, água e internet",
    type: "Despesa",
    monthlyAmount: 3800,
    trend: 0,
  },
  {
    id: 5,
    name: "Marketing e Publicidade",
    description: "Anúncios, redes sociais e materiais",
    type: "Despesa",
    monthlyAmount: 1200,
    trend: 18,
  },
  {
    id: 6,
    name: "Estoques e Insumos",
    description: "Produtos para revenda e uso interno",
    type: "Despesa",
    monthlyAmount: 1800,
    trend: -5,
  },
]

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Dinheiro",
    description: "Pagamento em espécie no balcão",
    status: "Ativo",
    fee: 0,
    settlement: "Imediato",
    amount: 16533,
    transactions: 120,
  },
  {
    id: 2,
    name: "Cartão de Débito",
    description: "Visa, Mastercard e Elo",
    status: "Ativo",
    fee: 1.39,
    settlement: "1 dia útil",
    amount: 9185,
    transactions: 65,
  },
  {
    id: 3,
    name: "Cartão de Crédito",
    description: "Visa, Mastercard e Elo",
    status: "Ativo",
    fee: 3.19,
    settlement: "30 dias",
    amount: 7348,
    transactions: 52,
  },
  {
    id: 4,
    name: "Pix",
    description: "Chave: (11) 99999-9999",
    status: "Ativo",
    fee: 0.49,
    settlement: "Imediato",
    amount: 2939,
    transactions: 22,
  },
  {
    id: 5,
    name: "Vale Refeição",
    description: "VR, Alelo e Sodexo",
    status: "Ativo",
    fee: 4.5,
    settlement: "2 dias úteis",
    amount: 551,
    transactions: 8,
  },
]

export function FinanceiroOverview() {
  const [movements, setMovements] = useState(initialMovements)
  const [movementModalType, setMovementModalType] =
    useState<FinancialType | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [feedback, setFeedback] = useState("Nenhuma ação executada nesta sessão.")

  const totals = useMemo(() => summarizeMovements(movements), [movements])
  const grossRevenue = 48200 + totals.income
  const expenses = 28250 + totals.expense
  const operatingProfit = grossRevenue - expenses
  const netRevenue = grossRevenue * 0.888
  const margin = operatingProfit / netRevenue

  const overviewRows = [
    ["Receita Bruta", formatCurrency(grossRevenue), "+12,5% vs mês anterior"],
    ["Receita Líquida", formatCurrency(netRevenue), "+10,8% vs mês anterior"],
    ["Despesas Totais", formatCurrency(expenses), "+8,2% vs mês anterior"],
    ["Lucro Operacional", formatCurrency(operatingProfit), "+8,2% vs mês anterior"],
    ["Margem Líquida", formatPercent(margin), "+1,2 pp vs mês anterior"],
  ]

  const cashFlowRows = [
    ["Entradas", formatCurrency(42800 + totals.income), <Trend key="income" tone="green" value="+10,8%" />],
    ["Saídas", formatCurrency(expenses), <Trend key="expense" tone="red" value="+8,2%" />],
    ["Saldo Inicial", formatCurrency(15600), <Trend key="initial" tone="blue" value="+5,1%" />],
    ["Saldo Final", formatCurrency(30150 + totals.income - totals.expense), <Trend key="final" tone="green" value="+93,3%" />],
  ]

  function addMovement(draft: MovementDraft) {
    const next: FinancialMovement = {
      id: Date.now(),
      date: draft.date,
      description: draft.description,
      category: draft.category,
      account: draft.account,
      amount: parseAmount(draft.amount),
      type: draft.type,
    }

    setMovements((current) => [next, ...current])
    setFeedback(`${draft.type} registrada: ${draft.description}.`)
    setMovementModalType(null)
  }

  function exportReport() {
    setFeedback("Relatório financeiro de abril/2026 preparado para exportação.")
    setReportOpen(false)
  }

  return (
    <>
      <div className="admin-metric-grid" data-columns="4">
        <MetricCard
          title="Receita Bruta"
          value={formatCurrency(grossRevenue)}
          change="+12,5% vs mês anterior"
          icon={TrendingUp}
          tone="green"
        />
        <MetricCard
          title="Receita Líquida"
          value={formatCurrency(netRevenue)}
          change="+10,8% vs mês anterior"
          icon={DollarCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Despesas Totais"
          value={formatCurrency(expenses)}
          change="+8,2% vs mês anterior"
          icon={ChartDecreaseIcon}
          tone="red"
        />
        <MetricCard
          title="Lucro Operacional"
          value={formatCurrency(operatingProfit)}
          change="+8,2% vs mês anterior"
          icon={ShieldCheck}
          tone="blue"
        />
      </div>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <SectionCard
          title="Visão Geral Financeira"
          description="Indicadores-chave de desempenho da barbearia"
        >
          <ResponsiveFinancialRows
            columns={["Indicador", "Valor", "Variação"]}
            rows={overviewRows}
            primaryLabel="Indicador"
            secondaryLabel="Valor"
            tertiaryLabel="Variação"
          />
        </SectionCard>

        <SectionCard
          title="Fluxo de Caixa"
          description="Entradas, saídas e saldo do período"
        >
          <ResponsiveFinancialRows
            columns={["Categoria", "Valor", "Variação"]}
            rows={cashFlowRows}
            primaryLabel="Categoria"
            secondaryLabel="Valor"
            tertiaryLabel="Variação"
          />
        </SectionCard>
      </section>

      <SectionCard
        title="Ações financeiras"
        description="Lançamentos rápidos e rotinas operacionais"
        action={
          <Button size="sm" onClick={() => setReportOpen(true)}>
            <HugeiconsIcon icon={File01Icon} size={16} />
            Relatório
          </Button>
        }
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(14rem,auto)] xl:items-center">
          <Button
            className="h-10 w-full"
            onClick={() => setMovementModalType("Receita")}
          >
            <HugeiconsIcon icon={MoneyReceiveCircleIcon} size={17} />
            Registrar receita
          </Button>
          <Button
            className="h-10 w-full"
            variant="outline"
            onClick={() => setMovementModalType("Despesa")}
          >
            <HugeiconsIcon icon={MoneySendCircleIcon} size={17} />
            Registrar despesa
          </Button>
          <p className="min-w-0 rounded-md bg-muted/50 px-3 py-2 text-xs leading-snug text-muted-foreground md:col-span-2 xl:col-span-1 xl:min-w-56">
            {feedback}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Acesso rápido aos módulos financeiros"
        description="Configure bases e acompanhe operações por área"
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ModuleLink
            href="/financeiro/contas-bancarias"
            icon={<HugeiconsIcon icon={BankIcon} size={22} />}
            title="Contas bancárias"
            description="Saldos, contas, cartão corporativo e movimentações"
          />
          <ModuleLink
            href="/financeiro/categorias"
            icon={<HugeiconsIcon icon={File01Icon} size={22} />}
            title="Categorias financeiras"
            description="Receitas, despesas, metas e performance por grupo"
          />
          <ModuleLink
            href="/financeiro/formas-pagamento"
            icon={<HugeiconsIcon icon={CreditCardIcon} size={22} />}
            title="Formas de pagamento"
            description="Taxas, prazos, status e distribuição das vendas"
          />
        </div>
      </SectionCard>

      <MovementModal
        key={`overview-movement-${movementModalType ?? "closed"}`}
        type={movementModalType ?? "Receita"}
        open={Boolean(movementModalType)}
        onOpenChange={(open) => {
          if (!open) setMovementModalType(null)
        }}
        onSubmit={addMovement}
      />

      <ReportModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={exportReport}
      />
    </>
  )
}

export function ContasBancariasView() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [movements, setMovements] = useState(initialMovements)
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [draft, setDraft] = useState<BankAccount | null>(null)
  const [movementAccount, setMovementAccount] = useState<BankAccount | null>(null)

  const activeBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthIncome = movements
    .filter((movement) => movement.type === "Receita")
    .reduce((sum, movement) => sum + movement.amount, 8450)
  const monthExpense = movements
    .filter((movement) => movement.type === "Despesa")
    .reduce((sum, movement) => sum + movement.amount, 5230)

  function openCreate() {
    setDraft({
      id: Date.now(),
      name: "",
      agency: "",
      account: "",
      type: "Conta corrente",
      balance: 0,
      status: "Ativa",
    })
    setModalMode("create")
  }

  function openEdit(account: BankAccount) {
    setDraft({ ...account })
    setModalMode("edit")
  }

  function saveAccount() {
    if (!draft) return
    setAccounts((current) =>
      modalMode === "create"
        ? [draft, ...current]
        : current.map((account) => (account.id === draft.id ? draft : account))
    )
    closeAccountModal()
  }

  function removeAccount() {
    if (!draft) return
    setAccounts((current) => current.filter((account) => account.id !== draft.id))
    closeAccountModal()
  }

  function closeAccountModal() {
    setDraft(null)
    setModalMode(null)
  }

  function saveMovement(data: MovementDraft) {
    if (!movementAccount) return
    const amount = parseAmount(data.amount)
    const signedAmount = data.type === "Receita" ? amount : -amount

    setAccounts((current) =>
      current.map((account) =>
        account.id === movementAccount.id
          ? { ...account, balance: account.balance + signedAmount }
          : account
      )
    )
    setMovements((current) => [
      {
        id: Date.now(),
        date: data.date,
        description: data.description,
        category: data.category,
        account: movementAccount.name,
        amount,
        type: data.type,
      },
      ...current,
    ])
    setMovementAccount(null)
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Saldo Total"
          value={formatCurrency(activeBalance)}
          change="+12% vs mês anterior"
          icon={BankIcon}
          tone="green"
        />
        <MetricCard
          title="Entradas Este Mês"
          value={formatCurrency(monthIncome)}
          change="+18% vs mês anterior"
          icon={MoneyReceiveCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Saídas Este Mês"
          value={formatCurrency(monthExpense)}
          change="+5% vs mês anterior"
          icon={MoneySendCircleIcon}
          tone="red"
        />
      </div>

      <SectionCard
        title="Contas Bancárias Cadastradas"
        description="Gerencie contas, saldos e movimentações da barbearia"
        action={
          <Button size="sm" onClick={openCreate}>
            <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
            Nova conta
          </Button>
        }
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {accounts.map((account) => (
            <FinanceCard key={account.id}>
                <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="min-w-0 break-words font-semibold">
                        {account.name}
                      </h3>
                      <StatusBadge tone={getAccountTone(account.status)}>
                        {account.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 break-words text-sm text-muted-foreground">
                      Agência {account.agency} · Conta {account.account}
                    </p>
                  </div>
                  <strong className="text-lg sm:text-right">
                    {formatCurrency(account.balance)}
                  </strong>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <InfoPill label="Tipo" value={account.type} />
                <InfoPill label="Saldo" value={formatCurrency(account.balance)} />
                <InfoPill label="Status" value={account.status} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end [&_[data-slot=button]]:w-full sm:[&_[data-slot=button]]:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMovementAccount(account)}
                >
                  <HugeiconsIcon icon={ArrowLeftRightIcon} size={16} />
                  Movimentar
                </Button>
                <Button size="sm" onClick={() => openEdit(account)}>
                  <HugeiconsIcon icon={File01Icon} size={16} />
                  Editar
                </Button>
              </div>
            </FinanceCard>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Transações Recentes"
        description="Últimas movimentações registradas nesta sessão"
      >
        <SimpleTable
          columns={["Data", "Descrição", "Valor", "Tipo"]}
          rows={movements.map((movement) => [
            movement.date,
            movement.description,
            formatCurrency(movement.amount),
            <StatusBadge key={movement.id} tone={movement.type === "Receita" ? "green" : "red"}>
              {movement.type === "Receita" ? "Entrada" : "Saída"}
            </StatusBadge>,
          ])}
        />
      </SectionCard>

      <AccountModal
        mode={modalMode ?? "create"}
        draft={draft}
        open={Boolean(modalMode)}
        onOpenChange={(open) => {
          if (!open) closeAccountModal()
        }}
        onChange={setDraft}
        onSave={saveAccount}
        onRemove={modalMode === "edit" ? removeAccount : undefined}
      />

      <MovementModal
        key={`account-movement-${movementAccount?.id ?? "closed"}`}
        type="Receita"
        account={movementAccount?.name}
        open={Boolean(movementAccount)}
        onOpenChange={(open) => {
          if (!open) setMovementAccount(null)
        }}
        onSubmit={saveMovement}
      />
    </>
  )
}

export function CategoriasFinanceirasView() {
  const [categories, setCategories] = useState(initialCategories)
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [draft, setDraft] = useState<FinancialCategory | null>(null)

  const revenue = categories
    .filter((category) => category.type === "Receita")
    .reduce((sum, category) => sum + category.monthlyAmount, 0)
  const expenses = categories
    .filter((category) => category.type === "Despesa")
    .reduce((sum, category) => sum + category.monthlyAmount, 0)
  const margin = revenue > 0 ? (revenue - expenses) / revenue : 0

  function openCreate() {
    setDraft({
      id: Date.now(),
      name: "",
      description: "",
      type: "Receita",
      monthlyAmount: 0,
      trend: 0,
    })
    setModalMode("create")
  }

  function openEdit(category: FinancialCategory) {
    setDraft({ ...category })
    setModalMode("edit")
  }

  function duplicateCategory(category: FinancialCategory) {
    setCategories((current) => [
      {
        ...category,
        id: Date.now(),
        name: `${category.name} - cópia`,
      },
      ...current,
    ])
  }

  function saveCategory() {
    if (!draft) return
    setCategories((current) =>
      modalMode === "create"
        ? [draft, ...current]
        : current.map((category) => (category.id === draft.id ? draft : category))
    )
    closeModal()
  }

  function removeCategory() {
    if (!draft) return
    setCategories((current) =>
      current.filter((category) => category.id !== draft.id)
    )
    closeModal()
  }

  function closeModal() {
    setDraft(null)
    setModalMode(null)
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Total Receitas"
          value={formatCurrency(revenue)}
          change="+9% vs mês anterior"
          icon={ChartIncreaseIcon}
          tone="green"
        />
        <MetricCard
          title="Total Despesas"
          value={formatCurrency(expenses)}
          change="+4% vs mês anterior"
          icon={ChartDecreaseIcon}
          tone="red"
        />
        <MetricCard
          title="Margem Líquida"
          value={formatPercent(margin)}
          change="+2,3 pp vs mês anterior"
          icon={File01Icon}
          tone="blue"
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <SectionCard
          title="Categorias Financeiras"
          description="Organize receitas e despesas para relatórios e metas"
          action={
            <Button size="sm" onClick={openCreate}>
              <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
              Nova categoria
            </Button>
          }
        >
          <div className="grid gap-3">
            {categories.map((category) => (
              <FinanceCard key={category.id}>
                <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="min-w-0 break-words font-semibold">
                        {category.name}
                      </h3>
                      <StatusBadge tone={category.type === "Receita" ? "green" : "red"}>
                        {category.type}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 break-words text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <strong className="text-lg md:text-right">
                    {formatCurrency(category.monthlyAmount)}
                  </strong>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end [&_[data-slot=button]]:w-full sm:[&_[data-slot=button]]:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateCategory(category)}
                  >
                    Duplicar
                  </Button>
                  <Button size="sm" onClick={() => openEdit(category)}>
                    <HugeiconsIcon icon={File01Icon} size={16} />
                    Editar
                  </Button>
                </div>
              </FinanceCard>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Performance por Categoria"
          description="Variação percentual das categorias por período"
        >
          <SimpleTable
            columns={["Categoria", "Mensal", "Trimestral", "Semestral"]}
            rows={categories.map((category) => [
              category.name,
              <Trend key="m" tone={category.trend >= 0 ? "green" : "red"} value={`${category.trend}%`} />,
              <Trend key="t" tone={category.trend >= 0 ? "green" : "red"} value={`${category.trend + 2}%`} />,
              <Trend key="s" tone={category.trend >= 0 ? "green" : "red"} value={`${category.trend + 5}%`} />,
            ])}
          />
        </SectionCard>
      </section>

      <CategoryModal
        mode={modalMode ?? "create"}
        draft={draft}
        open={Boolean(modalMode)}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
        onChange={setDraft}
        onSave={saveCategory}
        onRemove={modalMode === "edit" ? removeCategory : undefined}
      />
    </>
  )
}

export function FormasPagamentoView() {
  const [methods, setMethods] = useState(initialPaymentMethods)
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [draft, setDraft] = useState<PaymentMethod | null>(null)
  const [simulationOpen, setSimulationOpen] = useState(false)

  const totalAmount = methods.reduce((sum, method) => sum + method.amount, 0)
  const totalTransactions = methods.reduce(
    (sum, method) => sum + method.transactions,
    0
  )
  const averageTicket = totalTransactions > 0 ? totalAmount / totalTransactions : 0
  const activeMethods = methods.filter((method) => method.status === "Ativo")

  function openCreate() {
    setDraft({
      id: Date.now(),
      name: "",
      description: "",
      status: "Ativo",
      fee: 0,
      settlement: "Imediato",
      amount: 0,
      transactions: 0,
    })
    setModalMode("create")
  }

  function openEdit(method: PaymentMethod) {
    setDraft({ ...method })
    setModalMode("edit")
  }

  function toggleStatus(method: PaymentMethod) {
    setMethods((current) =>
      current.map((item) =>
        item.id === method.id
          ? { ...item, status: item.status === "Ativo" ? "Inativo" : "Ativo" }
          : item
      )
    )
  }

  function saveMethod() {
    if (!draft) return
    setMethods((current) =>
      modalMode === "create"
        ? [draft, ...current]
        : current.map((method) => (method.id === draft.id ? draft : method))
    )
    closeModal()
  }

  function removeMethod() {
    if (!draft) return
    setMethods((current) => current.filter((method) => method.id !== draft.id))
    closeModal()
  }

  function closeModal() {
    setDraft(null)
    setModalMode(null)
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Transações Hoje"
          value={formatCurrency(1240)}
          change="+15% vs ontem"
          icon={Wallet02Icon}
          tone="green"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(averageTicket)}
          change="+3% vs mês anterior"
          icon={ArrowLeftRightIcon}
          tone="blue"
        />
        <MetricCard
          title="Formas Ativas"
          value={String(activeMethods.length)}
          change="98,5% de aprovação"
          icon={CheckmarkCircle01Icon}
          tone="green"
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <SectionCard
          title="Formas de Pagamento Cadastradas"
          description="Gerencie as formas aceitas, taxas e prazos de liquidação"
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSimulationOpen(true)}
              >
                Simular taxa
              </Button>
              <Button size="sm" onClick={openCreate}>
                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                Nova forma
              </Button>
            </div>
          }
        >
          <div className="grid gap-3">
            {methods.map((method) => (
              <FinanceCard key={method.id}>
                <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="min-w-0 break-words font-semibold">
                        {method.name}
                      </h3>
                      <StatusBadge tone={method.status === "Ativo" ? "green" : "neutral"}>
                        {method.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 break-words text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                  <strong className="text-lg md:text-right">
                    {formatCurrency(method.amount)}
                  </strong>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <InfoPill label="Taxa" value={`${method.fee.toFixed(2)}%`} />
                  <InfoPill label="Liquidação" value={method.settlement} />
                  <InfoPill
                    label="Transações"
                    value={String(method.transactions)}
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end [&_[data-slot=button]]:w-full sm:[&_[data-slot=button]]:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(method)}
                  >
                    <HugeiconsIcon
                      icon={
                        method.status === "Ativo"
                          ? CancelCircleIcon
                          : CheckmarkCircle01Icon
                      }
                      size={16}
                    />
                    {method.status === "Ativo" ? "Desativar" : "Ativar"}
                  </Button>
                  <Button size="sm" onClick={() => openEdit(method)}>
                    <HugeiconsIcon icon={File01Icon} size={16} />
                    Editar
                  </Button>
                </div>
              </FinanceCard>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Distribuição por Forma de Pagamento"
          description="Percentual de uso de cada forma no mês"
        >
          <SimpleTable
            columns={["Forma", "% do total", "Valor", "Transações"]}
            rows={methods.map((method) => [
              method.name,
              formatPercent(totalAmount > 0 ? method.amount / totalAmount : 0),
              formatCurrency(method.amount),
              `${method.transactions} transações`,
            ])}
          />
        </SectionCard>
      </section>

      <PaymentMethodModal
        mode={modalMode ?? "create"}
        draft={draft}
        open={Boolean(modalMode)}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
        onChange={setDraft}
        onSave={saveMethod}
        onRemove={modalMode === "edit" ? removeMethod : undefined}
      />

      <FeeSimulationModal
        open={simulationOpen}
        methods={methods}
        onOpenChange={setSimulationOpen}
      />
    </>
  )
}

type MovementDraft = {
  type: FinancialType
  date: string
  description: string
  category: string
  account: string
  amount: string
}

function MovementModal({
  type,
  account,
  open,
  onOpenChange,
  onSubmit,
}: {
  type: FinancialType
  account?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (draft: MovementDraft) => void
}) {
  const [draft, setDraft] = useState<MovementDraft>(() => ({
    type,
    date: "28/04/2026",
    description: "",
    category: type === "Receita" ? "Receitas de Serviços" : "Aluguel e Utilidades",
    account: account ?? "Conta Corrente - Bradesco",
    amount: "",
  }))

  function update<Key extends keyof MovementDraft>(
    key: Key,
    value: MovementDraft[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function submit() {
    if (!draft.description.trim() || !draft.amount.trim()) return
    onSubmit({ ...draft, type, account: account ?? draft.account })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {type === "Receita" ? "Registrar receita" : "Registrar despesa"}
          </DialogTitle>
          <DialogDescription>
            O lançamento entra imediatamente nas tabelas desta sessão.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-0">
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <Field label="Data">
              <Input
                value={draft.date}
                onChange={(event) => update("date", event.target.value)}
              />
            </Field>
            <Field label="Valor">
              <Input
                value={draft.amount}
                inputMode="decimal"
                placeholder="0,00"
                onChange={(event) => update("amount", event.target.value)}
              />
            </Field>
            <Field className="sm:col-span-2" label="Descrição">
              <Input
                value={draft.description}
                placeholder={
                  type === "Receita"
                    ? "Ex: Recebimento - corte premium"
                    : "Ex: Pagamento - fornecedor"
                }
                onChange={(event) => update("description", event.target.value)}
              />
            </Field>
            <Field label="Categoria">
              <Select
                value={draft.category}
                onValueChange={(value) => update("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receitas de Serviços">
                    Receitas de Serviços
                  </SelectItem>
                  <SelectItem value="Receitas de Produtos">
                    Receitas de Produtos
                  </SelectItem>
                  <SelectItem value="Folha de Pagamento">
                    Folha de Pagamento
                  </SelectItem>
                  <SelectItem value="Aluguel e Utilidades">
                    Aluguel e Utilidades
                  </SelectItem>
                  <SelectItem value="Marketing e Publicidade">
                    Marketing e Publicidade
                  </SelectItem>
                  <SelectItem value="Transferências">Transferências</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Conta">
              <Select
                value={account ?? draft.account}
                disabled={Boolean(account)}
                onValueChange={(value) => update("account", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conta Corrente - Bradesco">
                    Conta Corrente - Bradesco
                  </SelectItem>
                  <SelectItem value="Conta Poupança - Itaú">
                    Conta Poupança - Itaú
                  </SelectItem>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Cartão Corporativo">
                    Cartão Corporativo
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar lançamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReportModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>Exportar relatório financeiro</DialogTitle>
          <DialogDescription>
            Configure o período e o formato do resumo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid content-start gap-4 p-4 sm:grid-cols-2">
          <Field label="Período">
            <Select defaultValue="abril-2026">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abril-2026">Abril de 2026</SelectItem>
                <SelectItem value="marco-2026">Março de 2026</SelectItem>
                <SelectItem value="trimestre">Último trimestre</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Formato">
            <Select defaultValue="pdf">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF executivo</SelectItem>
                <SelectItem value="csv">CSV detalhado</SelectItem>
                <SelectItem value="xlsx">Planilha XLSX</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="rounded-md bg-muted/60 p-3 text-sm text-muted-foreground sm:col-span-2">
            O fluxo atual prepara o relatório na interface. A integração real de
            download pode ser conectada ao backend depois.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>Preparar relatório</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AccountModal({
  mode,
  draft,
  open,
  onOpenChange,
  onChange,
  onSave,
  onRemove,
}: {
  mode: ModalMode
  draft: BankAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (draft: BankAccount | null) => void
  onSave: () => void
  onRemove?: () => void
}) {
  function update<Key extends keyof BankAccount>(key: Key, value: BankAccount[Key]) {
    onChange(draft ? { ...draft, [key]: value } : draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova conta bancária" : "Editar conta bancária"}
          </DialogTitle>
          <DialogDescription>
            Mantenha os saldos e contas do financeiro organizados.
          </DialogDescription>
        </DialogHeader>
        {draft ? (
          <ScrollArea className="min-h-0">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Nome da conta">
                <Input
                  value={draft.name}
                  placeholder="Ex: Conta Corrente - Banco"
                  onChange={(event) => update("name", event.target.value)}
                />
              </Field>
              <Field label="Agência">
                <Input
                  value={draft.agency}
                  onChange={(event) => update("agency", event.target.value)}
                />
              </Field>
              <Field label="Conta">
                <Input
                  value={draft.account}
                  onChange={(event) => update("account", event.target.value)}
                />
              </Field>
              <Field label="Tipo">
                <Select
                  value={draft.type}
                  onValueChange={(value) => update("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conta corrente">Conta corrente</SelectItem>
                    <SelectItem value="Poupança">Poupança</SelectItem>
                    <SelectItem value="Conta salário">Conta salário</SelectItem>
                    <SelectItem value="Cartão de crédito">
                      Cartão de crédito
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Saldo atual">
                <Input
                  value={String(draft.balance)}
                  inputMode="decimal"
                  onChange={(event) =>
                    update("balance", parseAmount(event.target.value))
                  }
                />
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onValueChange={(value) => update("status", value as AccountStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Em uso">Em uso</SelectItem>
                    <SelectItem value="Inativa">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </ScrollArea>
        ) : null}
        <DialogFooter className="sm:justify-between">
          {onRemove ? (
            <Button variant="destructive" onClick={onRemove}>
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Remover
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Salvar conta</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CategoryModal({
  mode,
  draft,
  open,
  onOpenChange,
  onChange,
  onSave,
  onRemove,
}: {
  mode: ModalMode
  draft: FinancialCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (draft: FinancialCategory | null) => void
  onSave: () => void
  onRemove?: () => void
}) {
  function update<Key extends keyof FinancialCategory>(
    key: Key,
    value: FinancialCategory[Key]
  ) {
    onChange(draft ? { ...draft, [key]: value } : draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova categoria" : "Editar categoria"}
          </DialogTitle>
          <DialogDescription>
            As categorias alimentam relatórios, metas e filtros financeiros.
          </DialogDescription>
        </DialogHeader>
        {draft ? (
          <ScrollArea className="min-h-0">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Nome da categoria">
                <Input
                  value={draft.name}
                  placeholder="Ex: Receitas de coloração"
                  onChange={(event) => update("name", event.target.value)}
                />
              </Field>
              <Field className="sm:col-span-2" label="Descrição">
                <textarea
                  value={draft.description}
                  rows={3}
                  className="min-h-24 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
                  onChange={(event) => update("description", event.target.value)}
                />
              </Field>
              <Field label="Tipo">
                <Select
                  value={draft.type}
                  onValueChange={(value) => update("type", value as FinancialType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receita">Receita</SelectItem>
                    <SelectItem value="Despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Valor mensal">
                <Input
                  value={String(draft.monthlyAmount)}
                  inputMode="decimal"
                  onChange={(event) =>
                    update("monthlyAmount", parseAmount(event.target.value))
                  }
                />
              </Field>
            </div>
          </ScrollArea>
        ) : null}
        <DialogFooter className="sm:justify-between">
          {onRemove ? (
            <Button variant="destructive" onClick={onRemove}>
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Remover
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Salvar categoria</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PaymentMethodModal({
  mode,
  draft,
  open,
  onOpenChange,
  onChange,
  onSave,
  onRemove,
}: {
  mode: ModalMode
  draft: PaymentMethod | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (draft: PaymentMethod | null) => void
  onSave: () => void
  onRemove?: () => void
}) {
  function update<Key extends keyof PaymentMethod>(
    key: Key,
    value: PaymentMethod[Key]
  ) {
    onChange(draft ? { ...draft, [key]: value } : draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova forma de pagamento" : "Editar forma"}
          </DialogTitle>
          <DialogDescription>
            Controle status, taxas, prazos e volume financeiro por forma.
          </DialogDescription>
        </DialogHeader>
        {draft ? (
          <ScrollArea className="min-h-0">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Nome">
                <Input
                  value={draft.name}
                  placeholder="Ex: Pix, cartão, convênio"
                  onChange={(event) => update("name", event.target.value)}
                />
              </Field>
              <Field className="sm:col-span-2" label="Descrição">
                <Input
                  value={draft.description}
                  onChange={(event) => update("description", event.target.value)}
                />
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onValueChange={(value) =>
                    update("status", value as PaymentStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Taxa (%)">
                <Input
                  value={String(draft.fee)}
                  inputMode="decimal"
                  onChange={(event) =>
                    update("fee", parseAmount(event.target.value))
                  }
                />
              </Field>
              <Field label="Liquidação">
                <Input
                  value={draft.settlement}
                  onChange={(event) => update("settlement", event.target.value)}
                />
              </Field>
              <Field label="Valor no mês">
                <Input
                  value={String(draft.amount)}
                  inputMode="decimal"
                  onChange={(event) =>
                    update("amount", parseAmount(event.target.value))
                  }
                />
              </Field>
              <Field label="Transações">
                <Input
                  value={String(draft.transactions)}
                  inputMode="numeric"
                  onChange={(event) =>
                    update("transactions", parseAmount(event.target.value))
                  }
                />
              </Field>
            </div>
          </ScrollArea>
        ) : null}
        <DialogFooter className="sm:justify-between">
          {onRemove ? (
            <Button variant="destructive" onClick={onRemove}>
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Remover
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Salvar forma</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FeeSimulationModal({
  open,
  methods,
  onOpenChange,
}: {
  open: boolean
  methods: PaymentMethod[]
  onOpenChange: (open: boolean) => void
}) {
  const firstMethod = methods[0]?.name ?? ""
  const [methodName, setMethodName] = useState(firstMethod)
  const [amount, setAmount] = useState("100")
  const selectedMethod =
    methods.find((method) => method.name === methodName) ?? methods[0]
  const gross = parseAmount(amount)
  const fee = selectedMethod ? gross * (selectedMethod.fee / 100) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>Simular taxa</DialogTitle>
          <DialogDescription>
            Veja quanto entra líquido em cada forma de pagamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid content-start gap-4 p-4 sm:grid-cols-2">
          <Field label="Forma">
            <Select value={methodName} onValueChange={setMethodName}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {methods.map((method) => (
                  <SelectItem key={method.id} value={method.name}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Valor bruto">
            <Input
              value={amount}
              inputMode="decimal"
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          <div className="rounded-md border bg-background p-4 sm:col-span-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Resultado
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <InfoPill label="Taxa" value={formatCurrency(fee)} />
              <InfoPill label="Líquido" value={formatCurrency(gross - fee)} />
              <InfoPill
                label="Liquidação"
                value={selectedMethod?.settlement ?? "Imediato"}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Concluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ModuleLink({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="premium-card motion-rise grid gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-muted/40"
    >
      <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
        {icon}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  )
}

function ResponsiveFinancialRows({
  columns,
  rows,
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
}: {
  columns: string[]
  rows: Array<Array<ReactNode>>
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
}) {
  return (
    <>
      <div className="grid gap-2 md:hidden">
        {rows.map((row, index) => (
          <div key={index} className="rounded-md border bg-background p-3">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {primaryLabel}
            </p>
            <p className="mt-1 break-words text-sm font-semibold">{row[0]}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-md bg-muted/50 px-3 py-2">
                <p className="text-xs text-muted-foreground">{secondaryLabel}</p>
                <div className="mt-1 break-words text-sm font-semibold">
                  {row[1]}
                </div>
              </div>
              <div className="min-w-0 rounded-md bg-muted/50 px-3 py-2">
                <p className="text-xs text-muted-foreground">{tertiaryLabel}</p>
                <div className="mt-1 break-words text-sm font-semibold">
                  {row[2]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SimpleTable className="hidden md:block" columns={columns} rows={rows} />
    </>
  )
}

function FinanceCard({ children }: { children: ReactNode }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-md border bg-background p-3 shadow-sm sm:p-4">
      {children}
    </article>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-muted/50 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  )
}

function Trend({
  tone,
  value,
}: {
  tone: Extract<Tone, "green" | "red" | "blue">
  value: string
}) {
  const classes = {
    green: "text-primary",
    red: "text-red-600 dark:text-red-400",
    blue: "text-sky-600 dark:text-sky-400",
  }

  return <span className={cn("font-semibold", classes[tone])}>{value}</span>
}

function summarizeMovements(movements: FinancialMovement[]) {
  return movements.reduce(
    (summary, movement) => {
      if (movement.type === "Receita") {
        summary.income += movement.amount
      } else {
        summary.expense += movement.amount
      }

      return summary
    },
    { income: 0, expense: 0 }
  )
}

function getAccountTone(status: AccountStatus): Tone {
  if (status === "Ativa") return "green"
  if (status === "Em uso") return "amber"
  return "neutral"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

function parseAmount(value: string) {
  const normalized = value
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "")

  return Number(normalized) || 0
}
