"use client"

import { useState } from "react"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
  role: "Barbeiro",
  commission: "40%",
  status: "Ativo",
}

export default function CadastrarProfissionalPage() {
  const [form, setForm] = useState(initialForm)
  const [feedback, setFeedback] = useState("Preencha os dados para salvar.")

  function updateForm<Key extends keyof ProfessionalForm>(
    key: Key,
    value: ProfessionalForm[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function saveProfessional() {
    if (!form.name.trim()) {
      setFeedback("Informe o nome do profissional antes de salvar.")
      return
    }

    setFeedback(`${form.name} foi cadastrado como ${form.role}.`)
    setForm(initialForm)
  }

  return (
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
            placeholder="Ex.: Paulo Junior"
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
          <Select value={form.role} onValueChange={(value) => updateForm("role", value)}>
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
              <SelectItem value="Férias">Férias</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <p className="mt-4 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
        {feedback}
      </p>
    </SectionCard>
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
