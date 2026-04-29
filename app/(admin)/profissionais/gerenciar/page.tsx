"use client"

import { useState } from "react"
import { UserListIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProfessionalStatus = "Ativo" | "Férias" | "Inativo"

type Professional = {
  id: number
  name: string
  role: string
  commission: string
  scheduleStart: string
  scheduleEnd: string
  status: ProfessionalStatus
}

const initialProfessionals: Professional[] = [
  {
    id: 1,
    name: "Paulo Junior",
    role: "Barbeiro",
    commission: "40%",
    scheduleStart: "2026-04-29",
    scheduleEnd: "2026-05-29",
    status: "Ativo",
  },
  {
    id: 2,
    name: "Paulo Jean",
    role: "Barbeiro",
    commission: "45%",
    scheduleStart: "2026-04-30",
    scheduleEnd: "2026-05-30",
    status: "Ativo",
  },
  {
    id: 3,
    name: "Bruno Castro",
    role: "Atendente",
    commission: "Fixo",
    scheduleStart: "2026-05-06",
    scheduleEnd: "2026-05-20",
    status: "Férias",
  },
]

export default function GerenciarProfissionalPage() {
  const [professionals, setProfessionals] = useState(initialProfessionals)
  const [editing, setEditing] = useState<Professional | null>(null)
  const [draft, setDraft] = useState<Professional | null>(null)
  const [scaleOpen, setScaleOpen] = useState(false)
  const [feedback, setFeedback] = useState("Nenhuma alteração nesta sessão.")

  function openEdit(professional: Professional) {
    setEditing(professional)
    setDraft({ ...professional })
  }

  function closeEdit() {
    setEditing(null)
    setDraft(null)
  }

  function updateDraft<Key extends keyof Professional>(
    key: Key,
    value: Professional[Key]
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  function saveProfessional() {
    if (!draft) return

    setProfessionals((current) =>
      current.map((professional) =>
        professional.id === draft.id ? draft : professional
      )
    )
    setFeedback(`${draft.name} foi atualizado.`)
    closeEdit()
  }

  function toggleStatus(professional: Professional) {
    const nextStatus = professional.status === "Ativo" ? "Inativo" : "Ativo"

    setProfessionals((current) =>
      current.map((item) =>
        item.id === professional.id ? { ...item, status: nextStatus } : item
      )
    )
    setFeedback(`${professional.name}: status alterado para ${nextStatus}.`)
  }

  return (
    <>
      <SectionCard
        title="Gerenciar profissional"
        description="Equipe, comissão, disponibilidade e status de agenda"
        action={
          <Button size="sm" variant="outline" onClick={() => setScaleOpen(true)}>
            <HugeiconsIcon icon={UserListIcon} size={16} />
            Escalas
          </Button>
        }
      >
        <SimpleTable
          columns={["Profissional", "Função", "Comissão", "Agenda", "Status", "Ações"]}
          rows={professionals.map((professional) => [
            professional.name,
            professional.role,
            professional.commission,
            formatDateRange(professional.scheduleStart, professional.scheduleEnd),
            <StatusBadge key="status" tone={getStatusTone(professional.status)}>
              {professional.status}
            </StatusBadge>,
            <div key="actions" className="flex flex-wrap gap-2">
              <Button size="xs" variant="outline" onClick={() => openEdit(professional)}>
                Editar
              </Button>
              <Button size="xs" variant="outline" onClick={() => toggleStatus(professional)}>
                {professional.status === "Ativo" ? "Inativar" : "Ativar"}
              </Button>
            </div>,
          ])}
        />
        <p className="mt-4 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
          {feedback}
        </p>
      </SectionCard>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar profissional</DialogTitle>
            <DialogDescription>
              Ajuste função, comissão e status.
            </DialogDescription>
          </DialogHeader>
          {draft ? (
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Field label="Nome">
                <Input
                  value={draft.name}
                  onChange={(event) => updateDraft("name", event.target.value)}
                />
              </Field>
              <Field label="Função">
                <Select
                  value={draft.role}
                  onValueChange={(value) => updateDraft("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Barbeiro">Barbeiro</SelectItem>
                    <SelectItem value="Cabeleireiro">Cabeleireiro</SelectItem>
                    <SelectItem value="Atendente">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Comissão">
                <Input
                  value={draft.commission}
                  onChange={(event) =>
                    updateDraft("commission", event.target.value)
                  }
                />
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onValueChange={(value) =>
                    updateDraft("status", value as ProfessionalStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Férias">Férias</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>
              Cancelar
            </Button>
            <Button onClick={saveProfessional}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scaleOpen} onOpenChange={setScaleOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Escalas da equipe</DialogTitle>
            <DialogDescription>
              Resumo do período de agenda cadastrado por profissional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 p-4">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="flex flex-col gap-1 rounded-md border bg-background px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{professional.name}</span>
                <span className="text-muted-foreground">
                  {formatDateRange(professional.scheduleStart, professional.scheduleEnd)}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setScaleOpen(false)}>Concluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function getStatusTone(status: ProfessionalStatus) {
  if (status === "Ativo") return "green"
  if (status === "Férias") return "amber"
  return "neutral"
}

function formatDateRange(start: string, end: string) {
  return `${formatDate(start)} a ${formatDate(end)}`
}

function formatDate(value: string) {
  if (!value) return "-"
  const [year, month, day] = value.split("-")

  return `${day}/${month}/${year}`
}
