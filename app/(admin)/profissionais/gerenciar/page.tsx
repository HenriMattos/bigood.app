"use client"

import { useState } from "react"
import { UserListIcon, UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { database, type Professional } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialProfessionals: Professional[] = database.professionals

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
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setScaleOpen(true)}
            >
              <HugeiconsIcon icon={UserListIcon} size={16} />
              Escalas
            </Button>
            <Link href="/profissionais/cadastrar">
              <Button size="sm">
                <HugeiconsIcon icon={UserAdd01Icon} size={16} />
                Cadastrar
              </Button>
            </Link>
          </div>
        }
      >
        {professionals.length === 0 ? (
          <EmptyState
            icon={UserAdd01Icon}
            title="Nenhum profissional"
            description="Sua equipe está vazia. Comece cadastrando os profissionais que atendem na sua barbearia."
            actionLabel="Cadastrar agora"
            href="/profissionais/cadastrar"
          />
        ) : (
          <>
            <SimpleTable
              columns={[
                "Profissional",
                "Função",
                "Comissão",
                "Agenda",
                "Status",
                "Ações",
              ]}
              rows={professionals.map((professional) => [
                professional.name,
                professional.role,
                professional.commission,
                formatDateRange(
                  professional.scheduleStart,
                  professional.scheduleEnd
                ),
                <StatusBadge key="status" tone={getStatusTone(professional.status)}>
                  {professional.status}
                </StatusBadge>,
                <div key="actions" className="flex flex-wrap gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => openEdit(professional)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => toggleStatus(professional)}
                  >
                    {professional.status === "Ativo" ? "Inativar" : "Ativar"}
                  </Button>
                </div>,
              ])}
            />
            <p className="mt-4 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
              {feedback}
            </p>
          </>
        )}
      </SectionCard>

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && closeEdit()}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar profissional</DialogTitle>
            <DialogDescription>
              Ajuste função, comissão e status.
            </DialogDescription>
          </DialogHeader>
          {draft ? (
            <DialogBody className="grid gap-4 md:grid-cols-2">
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
                    updateDraft("status", value as Professional["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Ferias">Ferias</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </DialogBody>
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
          <DialogBody className="grid gap-2">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="flex flex-col gap-1 rounded-md border bg-background px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium">{professional.name}</span>
                <span className="text-muted-foreground">
                  {formatDateRange(
                    professional.scheduleStart,
                    professional.scheduleEnd
                  )}
                </span>
              </div>
            ))}
          </DialogBody>
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

function getStatusTone(status: Professional["status"]) {
  if (status === "Ativo") return "green"
  if (status === "Ferias") return "amber"
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
