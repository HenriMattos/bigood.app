"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Add01Icon,
  CashierIcon,
  Delete02Icon,
  Edit02Icon,
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
  PaymentSuccess02Icon,
  ReceiptTextIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  type CashMovement,
  type CashMovementType,
  type Comanda,
  type ComandaItem,
  type ComandaStatus,
  cashMovements as initialCashMovements,
  comandas as initialComandas,
  formatCurrency,
  getComandaTotal,
} from "@/components/admin/caixa-data"
import { clients as registeredClients } from "@/components/admin/clientes-data"
import { LatestComandaCard } from "@/components/admin/comanda-card"
import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
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

const appointments = [
  {
    id: "ag-0900",
    label: "09:00 - Rafael Lima",
    client: "Rafael Lima",
    barber: "Bruno",
    chair: "Cadeira 1",
    service: "Corte + barba",
    price: 95,
  },
  {
    id: "ag-1030",
    label: "10:30 - Mateus Alves",
    client: "Mateus Alves",
    barber: "Caio",
    chair: "Cadeira 2",
    service: "Degrade",
    price: 65,
  },
  {
    id: "ag-1530",
    label: "15:30 - Lucas Rocha",
    client: "Lucas Rocha",
    barber: "Diego",
    chair: "Cadeira 3",
    service: "Corte premium",
    price: 110,
  },
]

const products = [
  { name: "Pomada modeladora", category: "Finalizadores", price: 42 },
  { name: "Oleo para barba", category: "Barba", price: 36 },
  { name: "Shampoo antiqueda", category: "Cabelo", price: 58 },
  { name: "Balm pos-barba", category: "Barba", price: 34 },
]

const services = [
  { name: "Corte social", category: "Cabelo", price: 55 },
  { name: "Degrade", category: "Cabelo", price: 65 },
  { name: "Barba completa", category: "Barba", price: 40 },
  { name: "Corte + barba", category: "Combo", price: 95 },
  { name: "Sobrancelha", category: "Acabamento", price: 25 },
]

export function CaixaView() {
  const [comandas, setComandas] = useState<Comanda[]>(initialComandas)
  const [cashMovements, setCashMovements] =
    useState<CashMovement[]>(initialCashMovements)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingComanda, setEditingComanda] = useState<Comanda | null>(null)
  const [movementModalType, setMovementModalType] =
    useState<CashMovementType | null>(null)

  const latestComanda = comandas[comandas.length - 1]
  const paidTotal = comandas
    .filter((comanda) => comanda.status === "paga")
    .reduce((sum, comanda) => sum + getComandaTotal(comanda), 0)
  const openTotal = comandas
    .filter((comanda) => comanda.status === "aberta")
    .reduce((sum, comanda) => sum + getComandaTotal(comanda), 0)
  const partialTotal = comandas
    .filter((comanda) => comanda.status === "parcial")
    .reduce((sum, comanda) => sum + getComandaTotal(comanda), 0)
  const manualIncomeTotal = cashMovements
    .filter((movement) => movement.type === "entrada")
    .reduce((sum, movement) => sum + movement.value, 0)
  const expenseTotal = cashMovements
    .filter((movement) => movement.type === "saida")
    .reduce((sum, movement) => sum + movement.value, 0)
  const cashBalance = paidTotal + manualIncomeTotal - expenseTotal

  function saveComanda(comanda: Comanda) {
    setComandas((current) =>
      current.some((item) => item.id === comanda.id)
        ? current.map((item) => (item.id === comanda.id ? comanda : item))
        : [...current, comanda]
    )
    setEditingComanda(null)
    setModalOpen(false)
  }

  function openCreateModal() {
    setEditingComanda(null)
    setModalOpen(true)
  }

  function openEditModal(comanda: Comanda) {
    setEditingComanda(comanda)
    setModalOpen(true)
  }

  function addCashMovement(movement: CashMovement) {
    setCashMovements((current) => [movement, ...current])
    setMovementModalType(null)
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Saldo do caixa"
          value={formatCurrency(cashBalance)}
          change="Comandas pagas + entradas - saidas"
          icon={Wallet02Icon}
          tone="green"
        />
        <MetricCard
          title="Comandas pagas"
          value={formatCurrency(paidTotal)}
          change="2 comandas finalizadas"
          icon={PaymentSuccess02Icon}
          tone="blue"
        />
        <MetricCard
          title="Em aberto"
          value={formatCurrency(openTotal + partialTotal)}
          change="Comandas pendentes no caixa"
          icon={ReceiptTextIcon}
          tone="amber"
        />
        <MetricCard
          title="Entradas avulsas"
          value={formatCurrency(manualIncomeTotal)}
          change={`${cashMovements.filter((item) => item.type === "entrada").length} lancamento no caixa`}
          icon={MoneyReceiveCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Saidas"
          value={formatCurrency(expenseTotal)}
          change={`${cashMovements.filter((item) => item.type === "saida").length} lancamentos operacionais`}
          icon={MoneySendCircleIcon}
          tone="red"
        />
      </div>

      <SectionCard
        title="Ultima comanda"
        description="Resumo do atendimento mais recente registrado no caixa"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="sm" variant="outline" asChild>
              <Link href="/caixa/comandas">Ver detalhes</Link>
            </Button>
            <Button size="sm" onClick={openCreateModal}>
              <HugeiconsIcon icon={CashierIcon} size={16} />
              Nova comanda
            </Button>
          </div>
        }
      >
        <LatestComandaCard
          comanda={latestComanda}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditModal(latestComanda)}
            >
              <HugeiconsIcon icon={Edit02Icon} size={16} />
              Editar
            </Button>
          }
        />
      </SectionCard>

      <SectionCard
        title="Entradas e saidas"
        description="Lancamentos manuais fora das comandas, como troco, despesas e retiradas"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setMovementModalType("entrada")}
            >
              <HugeiconsIcon icon={MoneyReceiveCircleIcon} size={16} />
              Nova entrada
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setMovementModalType("saida")}
            >
              <HugeiconsIcon icon={MoneySendCircleIcon} size={16} />
              Nova saida
            </Button>
          </div>
        }
      >
        <div className="grid gap-2">
          {cashMovements.slice(0, 5).map((movement) => (
            <CashMovementRow key={movement.id} movement={movement} />
          ))}
        </div>
      </SectionCard>

      <NovaComandaModal
        key={editingComanda?.id ?? "nova-comanda"}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingComanda(null)
        }}
        onSave={saveComanda}
        nextNumber={1024 + comandas.length}
        editingComanda={editingComanda}
      />

      <CashMovementModal
        key={movementModalType ?? "cash-movement"}
        type={movementModalType ?? "entrada"}
        open={Boolean(movementModalType)}
        onOpenChange={(open) => {
          if (!open) setMovementModalType(null)
        }}
        onSave={addCashMovement}
        nextNumber={cashMovements.length + 1}
      />
    </>
  )
}

function CashMovementRow({ movement }: { movement: CashMovement }) {
  const isIncome = movement.type === "entrada"

  return (
    <div className="grid gap-3 rounded-md border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md",
            isIncome
              ? "bg-primary/15 text-primary"
              : "bg-destructive/10 text-destructive"
          )}
        >
          <HugeiconsIcon
            icon={isIncome ? MoneyReceiveCircleIcon : MoneySendCircleIcon}
            size={18}
          />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{movement.label}</span>
            <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
              {movement.category}
            </span>
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {movement.time} - {movement.payment}
          </span>
        </span>
      </div>
      <p
        className={cn(
          "text-left text-lg font-semibold sm:text-right",
          isIncome ? "text-primary" : "text-destructive"
        )}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(movement.value)}
      </p>
    </div>
  )
}

function CashMovementModal({
  type,
  open,
  onOpenChange,
  onSave,
  nextNumber,
}: {
  type: CashMovementType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (movement: CashMovement) => void
  nextNumber: number
}) {
  const [label, setLabel] = useState("")
  const [category, setCategory] = useState(
    type === "entrada" ? "Suprimento" : "Despesa operacional"
  )
  const [payment, setPayment] = useState(type === "entrada" ? "Dinheiro" : "Pix")
  const [value, setValue] = useState("")
  const isIncome = type === "entrada"
  const parsedValue = Number(value.replace(",", ".")) || 0
  const canSave = label.trim().length > 0 && parsedValue > 0

  function reset() {
    setLabel("")
    setCategory(type === "entrada" ? "Suprimento" : "Despesa operacional")
    setPayment(type === "entrada" ? "Dinheiro" : "Pix")
    setValue("")
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  function submit() {
    if (!canSave) return

    onSave({
      id: `MOV-${String(nextNumber).padStart(3, "0")}`,
      type,
      label: label.trim(),
      category,
      value: parsedValue,
      payment,
      time: new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bottom-0 left-0 top-auto grid h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] rounded-b-none rounded-t-2xl border-x-0 border-b-0 shadow-2xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:h-[min(38rem,calc(100dvh-2rem))] sm:w-[calc(100vw-2rem)] sm:max-w-[36rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border">
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-border sm:hidden" />
        <DialogHeader
          className={cn(
            "relative overflow-hidden gap-2 border-b p-4 pt-3 sm:gap-3 sm:p-4",
            isIncome ? "bg-primary/5" : "bg-destructive/5"
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute right-4 top-4 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-normal sm:right-4 sm:top-4",
              isIncome
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            )}
          >
            {isIncome ? "Entrada" : "Saida"}
          </span>
          <DialogTitle className="flex items-start gap-2.5 pr-14 text-base sm:items-center sm:gap-3 sm:pr-0 sm:text-lg">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md sm:size-10",
                isIncome
                  ? "bg-primary/15 text-primary"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              <HugeiconsIcon
                icon={isIncome ? MoneyReceiveCircleIcon : MoneySendCircleIcon}
                size={18}
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate">
                {isIncome ? "Nova entrada" : "Nova saida"}
              </span>
              <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-normal text-muted-foreground sm:text-[11px]">
                <span className="sm:hidden">Manual do caixa</span>
                <span className="hidden sm:inline">Lancamento manual do caixa</span>
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed sm:text-sm">
            {isIncome
              ? "Use para troco inicial, suprimentos e recebimentos avulsos."
              : "Use para despesas, retiradas, taxas e ajustes operacionais."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 bg-muted/15">
          <div className="grid gap-3 p-3 sm:p-4">
            <div className="grid gap-2 rounded-lg border bg-background p-3 shadow-xs">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Descricao
              </Label>
              <Input
                className="h-12 border-0 bg-muted/35 text-base shadow-none focus-visible:ring-2"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                autoFocus
                placeholder={
                  isIncome ? "Ex.: Troco inicial" : "Ex.: Material descartavel"
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="grid gap-2 rounded-lg border bg-background p-3 shadow-xs">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Categoria
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 bg-muted/35 text-left [&>span]:truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isIncome ? (
                      <>
                        <SelectItem value="Suprimento">Suprimento</SelectItem>
                        <SelectItem value="Recebimento avulso">
                          Recebimento avulso
                        </SelectItem>
                        <SelectItem value="Ajuste de caixa">
                          Ajuste de caixa
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Despesa operacional">
                          Despesa operacional
                        </SelectItem>
                        <SelectItem value="Retirada">Retirada</SelectItem>
                        <SelectItem value="Taxa">Taxa</SelectItem>
                        <SelectItem value="Ajuste de caixa">
                          Ajuste de caixa
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 rounded-lg border bg-background p-3 shadow-xs">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Forma
                </Label>
                <Select value={payment} onValueChange={setPayment}>
                  <SelectTrigger className="h-12 bg-muted/35 text-left [&>span]:truncate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="Pix">Pix</SelectItem>
                    <SelectItem value="Credito">Credito</SelectItem>
                    <SelectItem value="Debito">Debito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border bg-background p-3 shadow-xs">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Valor do lancamento
              </Label>
              <div className="mt-2 flex items-center rounded-lg border bg-muted/20 px-3 transition-colors focus-within:border-ring/50 focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/25">
                <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                  R$
                </span>
                <Input
                  className="h-12 border-0 bg-transparent px-2 text-xl font-semibold shadow-none focus-visible:ring-0 sm:text-2xl"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  inputMode="decimal"
                  placeholder="0,00"
                />
              </div>
              <div
                className={cn(
                  "mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm",
                  isIncome
                    ? "border-primary/15 bg-primary/5"
                    : "border-destructive/15 bg-destructive/5"
                )}
              >
                <span className="font-medium text-muted-foreground">
                  Previa no saldo
                </span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    isIncome ? "text-primary" : "text-destructive"
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(parsedValue)}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-background/95 p-3 sm:flex sm:bg-muted/25 sm:p-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full sm:w-auto sm:min-w-28"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="h-11 w-full sm:w-auto sm:min-w-40"
            disabled={!canSave}
            onClick={submit}
          >
            {isIncome ? "Salvar entrada" : "Salvar saida"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function NovaComandaModal({
  open,
  onOpenChange,
  onSave,
  nextNumber,
  editingComanda,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (comanda: Comanda) => void
  nextNumber: number
  editingComanda?: Comanda | null
}) {
  const [type, setType] = useState(editingComanda?.notes ?? "Atendimento")
  const [appointmentId, setAppointmentId] = useState("")
  const [client, setClient] = useState(editingComanda?.client ?? "")
  const [barber, setBarber] = useState(editingComanda?.barber ?? "Bruno")
  const [chair, setChair] = useState(editingComanda?.chair ?? "Cadeira 1")
  const [status, setStatus] = useState<ComandaStatus>(
    editingComanda?.status ?? "aberta"
  )
  const [payment, setPayment] = useState(editingComanda?.payment ?? "Aguardando")
  const [productName, setProductName] = useState("")
  const [productQuantity, setProductQuantity] = useState("1")
  const [serviceName, setServiceName] = useState("")
  const [items, setItems] = useState<ComandaItem[]>(editingComanda?.items ?? [])
  const [step, setStep] = useState(0)
  const steps = ["Dados", "Produtos", "Servicos", "Confirmar"]
  const lastStep = steps.length - 1
  const editing = Boolean(editingComanda)

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items]
  )

  function reset() {
    setType("Atendimento")
    setAppointmentId("")
    setClient("")
    setBarber("Bruno")
    setChair("Cadeira 1")
    setStatus("aberta")
    setPayment("Aguardando")
    setProductName("")
    setProductQuantity("1")
    setServiceName("")
    setItems([])
    setStep(0)
  }

  function handleAppointment(value: string) {
    setAppointmentId(value)
    const appointment = appointments.find((item) => item.id === value)
    if (!appointment) return

    setClient(appointment.client)
    setBarber(appointment.barber)
    setChair(appointment.chair)
    setServiceName(appointment.service)
    if (!items.some((item) => item.name === appointment.service)) {
      setItems((current) => [
        ...current,
        {
          name: appointment.service,
          category: "servico",
          quantity: 1,
          unitPrice: appointment.price,
        },
      ])
    }
  }

  function addProduct() {
    const product = products.find((item) => item.name === productName)
    if (!product) return

    setItems((current) => [
      ...current,
      {
        name: product.name,
        category: "produto",
        quantity: Number(productQuantity) || 1,
        unitPrice: product.price,
      },
    ])
    setProductName("")
    setProductQuantity("1")
  }

  function addService() {
    const service = services.find((item) => item.name === serviceName)
    if (!service) return

    setItems((current) => [
      ...current,
      {
        name: service.name,
        category: "servico",
        quantity: 1,
        unitPrice: service.price,
      },
    ])
    setServiceName("")
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function submit() {
    if (!items.length) return

    const comanda: Comanda = {
      id: editingComanda?.id ?? `CMD-${nextNumber}`,
      time:
        editingComanda?.time ??
        new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      client,
      barber,
      chair,
      status,
      payment,
      items,
      notes: type,
    }

    onSave(comanda)
    reset()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  function goNext() {
    setStep((current) => Math.min(current + 1, lastStep))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bottom-0 left-0 top-auto grid h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] rounded-b-none rounded-t-xl border-x-0 border-b-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:h-[min(38rem,calc(100dvh-1rem))] sm:w-[calc(100vw-2rem)] sm:max-w-3xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md sm:border">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border sm:hidden" />
        <DialogHeader className="shrink-0 border-b p-3 sm:p-4">
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={CashierIcon} size={18} />
            {editing ? "Editar comanda" : "Criar nova comanda"}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
              {step + 1}/{steps.length}
            </span>
            <span>{steps[step]}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="border-b px-3 py-2 sm:px-4">
          <ComandaStepper steps={steps} currentStep={step} />
        </div>

        <ScrollArea className="h-full min-h-0">
          <div className="h-full space-y-4 overflow-y-auto p-3 pr-4 sm:p-4 sm:pr-5">
            {step === 0 ? (
              <section className="grid gap-3 rounded-md border bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Dados da comanda</h3>
                  <span className="text-xs text-muted-foreground">
                    {editing ? editingComanda?.id : "Campos obrigatorios"}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>Tipo de comanda</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Atendimento">Atendimento</SelectItem>
                        <SelectItem value="Consumo">Consumo</SelectItem>
                        <SelectItem value="Avulsa">Avulsa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Agendamento</Label>
                    <Select value={appointmentId} onValueChange={handleAppointment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar agendamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointments.map((appointment) => (
                          <SelectItem key={appointment.id} value={appointment.id}>
                            {appointment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                <div className="grid gap-1.5 md:col-span-2">
                  <Label>Cliente</Label>
                  <Select value={client} onValueChange={setClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {registeredClients.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate font-medium">
                              {item.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {item.phone} - {item.favoriteService}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                  <div className="grid gap-1.5">
                    <Label>Barbeiro</Label>
                    <Select value={barber} onValueChange={setBarber}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Bruno", "Caio", "Diego"].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Cadeira</Label>
                    <Select value={chair} onValueChange={setChair}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Cadeira 1", "Cadeira 2", "Cadeira 3"].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            ) : null}

            {step === 1 ? (
              <section className="grid gap-3 rounded-md border bg-background p-3">
              <h3 className="text-sm font-semibold">Produtos</h3>
              <div className="grid gap-2 md:grid-cols-[1.1fr_0.8fr_0.8fr_2.25rem]">
                <Select value={appointmentId} onValueChange={handleAppointment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Agendamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        {appointment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value="Todas">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas categorias</SelectItem>
                    <SelectItem value="Barba">Barba</SelectItem>
                    <SelectItem value="Cabelo">Cabelo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={productName} onValueChange={setProductName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.name} value={product.name}>
                        {product.name} - {formatCurrency(product.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="icon"
                  aria-label="Adicionar produto"
                  onClick={addProduct}
                >
                  <HugeiconsIcon icon={Add01Icon} size={18} />
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-[9rem_1fr]">
                <div className="grid gap-1.5">
                  <Label>Quantidade</Label>
                  <Input
                    value={productQuantity}
                    onChange={(event) => setProductQuantity(event.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <ItemsList
                items={items.filter((item) => item.category === "produto")}
                allItems={items}
                onRemove={removeItem}
                empty="Nenhum produto adicionado."
              />
            </section>
            ) : null}

            {step === 2 ? (
              <section className="grid gap-3 rounded-md border bg-background p-3">
              <h3 className="text-sm font-semibold">Servicos</h3>
              <div className="grid gap-2 md:grid-cols-[1fr_0.75fr_1fr_2.25rem]">
                <Select value={appointmentId} onValueChange={handleAppointment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Agendamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        {appointment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value="Todas">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas">Todas categorias</SelectItem>
                    <SelectItem value="Cabelo">Cabelo</SelectItem>
                    <SelectItem value="Barba">Barba</SelectItem>
                    <SelectItem value="Combo">Combo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={serviceName} onValueChange={setServiceName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Servico" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        {service.name} - {formatCurrency(service.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="icon"
                  aria-label="Adicionar servico"
                  onClick={addService}
                >
                  <HugeiconsIcon icon={Add01Icon} size={18} />
                </Button>
              </div>
              <ItemsList
                items={items.filter((item) => item.category === "servico")}
                allItems={items}
                onRemove={removeItem}
                empty="Nenhum servico adicionado."
              />
            </section>
            ) : null}

            {step === 3 ? (
              <section className="grid gap-4">
                <div className="grid gap-3 rounded-md border bg-muted/20 p-3 md:grid-cols-3">
                  <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as ComandaStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberta">Aberta</SelectItem>
                        <SelectItem value="parcial">Parcial</SelectItem>
                        <SelectItem value="paga">Paga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Pagamento</Label>
                    <Select value={payment} onValueChange={setPayment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aguardando">Aguardando</SelectItem>
                        <SelectItem value="Pix">Pix</SelectItem>
                        <SelectItem value="Credito">Credito</SelectItem>
                        <SelectItem value="Debito">Debito</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-md border bg-card p-3">
                    <p className="text-xs text-muted-foreground">Total da comanda</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>

                <div className="rounded-md border bg-background p-3">
                  <h3 className="text-sm font-semibold">Resumo</h3>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <SummaryInfo
                      label="Cliente"
                      value={client || "Selecionar cliente"}
                    />
                    <SummaryInfo label="Barbeiro" value={barber} />
                    <SummaryInfo label="Cadeira" value={chair} />
                    <SummaryInfo label="Itens" value={String(items.length)} />
                  </div>
                  <div className="mt-3">
                    <ItemsList
                      items={items}
                      allItems={items}
                      onRemove={removeItem}
                      empty="Nenhum item adicionado."
                    />
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t p-3 sm:p-4">
          <div className="grid w-full gap-2 sm:flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <div className="grid gap-2 sm:flex">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={goBack}>
                  Voltar
                </Button>
              ) : null}
              {step < lastStep ? (
                <Button type="button" onClick={goNext}>
                  Proximo
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!client || !items.length}
                  onClick={submit}
                >
                  {editing ? "Salvar" : "Enviar"}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ComandaStepper({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {steps.map((item, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep

        return (
          <div key={item} className="min-w-0">
            <div
              className={cn(
                "h-1 rounded-full bg-muted",
                (isActive || isDone) && "bg-primary"
              )}
            />
            <p
              className={cn(
                "mt-1 hidden truncate text-[11px] font-medium text-muted-foreground sm:block",
                isActive && "text-foreground"
              )}
            >
              {item}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function ItemsList({
  items,
  allItems,
  onRemove,
  empty,
}: {
  items: ComandaItem[]
  allItems: ComandaItem[]
  onRemove: (index: number) => void
  empty: string
}) {
  if (!items.length) {
    return (
      <div className="flex min-h-16 items-center justify-center rounded-md border border-dashed bg-muted/20 px-3 text-center text-sm font-medium text-muted-foreground">
        {empty}
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => {
        const itemIndex = allItems.indexOf(item)

        return (
          <div
            key={`${item.name}-${itemIndex}`}
            className="grid grid-cols-[minmax(0,1fr)_4rem_5.5rem_2rem] items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm"
          >
            <span className="min-w-0 truncate font-medium">{item.name}</span>
            <span className="text-center text-muted-foreground">
              {item.quantity}x
            </span>
            <span className="text-right font-semibold">
              {formatCurrency(item.quantity * item.unitPrice)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Remover ${item.name}`}
              onClick={() => onRemove(itemIndex)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </div>
        )
      })}
    </div>
  )
}

function SummaryInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}
