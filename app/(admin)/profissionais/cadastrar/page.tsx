"use client"

import { useState } from "react"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

type ProfessionalForm = {
  name: string
  phone: string
  email: string
  role: string
  commission: string
  status: string
}

const initialForm: ProfessionalForm = {
  name: "",
  phone: "",
  email: "",
  role: "",
  commission: "40%",
  status: "Ativo",
}

export default function CadastrarProfissionalPage() {
  const [form, setForm] = useState(initialForm)
  const [roles, setRoles] = useState<string[]>(database.company.professionalRoles)
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [feedback, setFeedback] = useState("Preencha os dados para salvar.")

  function updateForm<Key extends keyof ProfessionalForm>(
    key: Key,
    value: ProfessionalForm[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function addRole() {
    if (!newRoleName.trim()) return
    const role = newRoleName.trim()
    if (!roles.includes(role)) {
      const nextRoles = [...roles, role]
      setRoles(nextRoles)
      database.company.professionalRoles = nextRoles // Atualiza no "banco" da sessão
    }
    updateForm("role", role)
    setNewRoleName("")
    setNewRoleModalOpen(false)
  }

  function saveProfessional() {
    if (!form.name.trim()) {
      setFeedback("Informe o nome do profissional antes de salvar.")
      return
    }

    setFeedback(`${form.name} foi cadastrado como ${form.role || "Sem função"}.`)
    setForm(initialForm)
  }

  return (
    <>
      <SectionCard
        title="Cadastrar profissional"
        description="Dados de agenda, função e regras comerciais do profissional"
        action={
          <Button size="sm" onClick={saveProfessional}>
            <HugeiconsIcon icon={UserAdd01Icon} size={16} />
            Salvar profissional
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome completo">
            <Input
              value={form.name}
              placeholder="Ex.: Profissional 1"
              onChange={(event) => updateForm("name", event.target.value)}
            />
          </Field>
          <Field label="Telefone">
            <Input
              value={form.phone}
              placeholder="(11) 90000-0000"
              onChange={(event) => updateForm("phone", event.target.value)}
            />
          </Field>
          <Field label="E-mail">
            <Input
              value={form.email}
              placeholder="profissional@email.com"
              onChange={(event) => updateForm("email", event.target.value)}
            />
          </Field>
          <Field label="Função">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1 min-w-0">
                <Select
                  value={form.role}
                  onValueChange={(value) => updateForm("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        Nenhuma função cadastrada
                      </div>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="w-full sm:w-auto shrink-0"
                onClick={() => setNewRoleModalOpen(true)}
              >
                <HugeiconsIcon icon={PlusSignIcon} size={16} />
                Nova função
              </Button>
            </div>
          </Field>
          <Field label="Comissão padrão">
            <Input
              value={form.commission}
              inputMode="decimal"
              placeholder="40%"
              onChange={(event) => updateForm("commission", event.target.value)}
            />
          </Field>
          <Field label="Status na agenda">
            <Select
              value={form.status}
              onValueChange={(value) => updateForm("status", value)}
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
        </div>

        <p className="mt-4 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
          {feedback}
        </p>
      </SectionCard>

      <Dialog open={newRoleModalOpen} onOpenChange={setNewRoleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova função</DialogTitle>
            <DialogDescription>
              Cadastre uma nova função para os profissionais da sua empresa.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-2">
              <Label htmlFor="role-name">Nome da função</Label>
              <Input
                id="role-name"
                value={newRoleName}
                placeholder="Ex: Barbeiro Master"
                onChange={(event) => setNewRoleName(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && addRole()}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRoleModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addRole}>Adicionar função</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
