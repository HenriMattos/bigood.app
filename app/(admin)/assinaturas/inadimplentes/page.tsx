"use client"

import { useState } from "react"
import { CancelCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database, type OverdueSubscription } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialOverdue: OverdueSubscription[] = database.overdueSubscriptions

export default function InadimplentesPage() {
  const [items, setItems] = useState(initialOverdue)
  const [selected, setSelected] = useState<OverdueSubscription | null>(null)
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState("Nenhuma cobrança enviada.")

  function openCharge(item: OverdueSubscription) {
    setSelected(item)
    setMessage(
      `Ola, ${item.client}. Identificamos uma pendencia de ${formatCurrency(item.value)} no plano ${item.plan}. Podemos regularizar hoje?`
    )
  }

  function sendCharge() {
    if (!selected) return

    setItems((current) =>
      current.map((item) =>
        item.id === selected.id ? { ...item, status: "Cobranca enviada" } : item
      )
    )
    setFeedback(`Cobrança enviada para ${selected.client}.`)
    setSelected(null)
  }

  function markAsPaid(item: OverdueSubscription) {
    setItems((current) =>
      current.filter((currentItem) => currentItem.id !== item.id)
    )
    setFeedback(`${item.client} foi marcado como regularizado.`)
  }

  function exportList() {
    setFeedback(`Lista exportada com ${items.length} inadimplente(s).`)
  }

  return (
    <>
      <SectionCard
        title="Inadimplentes"
        description="Assinaturas com pagamento pendente e ações de cobrança"
        action={
          <Button size="sm" variant="outline" onClick={exportList}>
            <HugeiconsIcon icon={CancelCircleIcon} size={16} />
            Exportar lista
          </Button>
        }
      >
        <SimpleTable
          columns={["Cliente", "Plano", "Valor", "Atraso", "Status", "Ações"]}
          rows={items.map((item) => [
            item.client,
            item.plan,
            formatCurrency(item.value),
            item.delay,
            <StatusBadge
              key="status"
              tone={item.status === "Cobranca enviada" ? "amber" : "red"}
            >
              {item.status}
            </StatusBadge>,
            <div key="actions" className="flex flex-wrap gap-2">
              <Button
                size="xs"
                variant="outline"
                onClick={() => openCharge(item)}
              >
                Cobrar
              </Button>
              <Button size="xs" onClick={() => markAsPaid(item)}>
                Regularizar
              </Button>
            </div>,
          ])}
        />
        <p className="mt-4 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
          {feedback}
        </p>
      </SectionCard>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar cobrança</DialogTitle>
            <DialogDescription>
              Revise a mensagem antes de registrar o envio.
            </DialogDescription>
          </DialogHeader>
          {selected ? (
            <DialogBody className="grid gap-4">
              <div className="rounded-md border bg-muted/35 px-3 py-2 text-sm">
                {selected.client} - {selected.phone}
              </div>
              <div className="grid gap-1.5">
                <Label>Mensagem</Label>
                <textarea
                  value={message}
                  rows={5}
                  className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Valor pendente</Label>
                <Input value={formatCurrency(selected.value)} readOnly />
              </div>
            </DialogBody>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            <Button onClick={sendCharge}>Enviar cobrança</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
