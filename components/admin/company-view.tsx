"use client"

import { useState, type ReactNode } from "react"
import {
  Building02Icon,
  CheckmarkCircle01Icon,
  File01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database } from "@/components/admin/database"
import { MetricCard } from "@/components/admin/metric-card"
import {
  FormField,
  FormGrid,
  ResponsiveActions,
} from "@/components/admin/responsive-form"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const timezones = [
  "America/Manaus",
  "America/Sao_Paulo",
  "America/Boa_Vista",
  "America/Rio_Branco",
]

const toleranceOptions = [
  "15 minutos",
  "30 minutos",
  "1 hora",
  "2 horas",
  "24 horas",
]

const penaltyOptions = ["24 horas", "3 dias", "7 dias", "15 dias", "30 dias"]

const voucherDiscountOptions = [
  "Comissão do profissional",
  "Receita da empresa",
  "Não descontar",
]

const initialCompanyForm = {
  corporateName: database.company.corporateName,
  tradeName: database.company.tradeName,
  cnpj: database.company.cnpj,
  email: database.company.email,
  timezone: database.company.timezone,
  phone: database.company.phone,
  slug: database.company.slug,
  primaryR: String(database.company.primaryColor.r),
  primaryG: String(database.company.primaryColor.g),
  primaryB: String(database.company.primaryColor.b),
  pixWithdrawal: "55.540.659/0001-22",
  fixedTransactionFee: "R$ 0,69",
  variableTransactionFee: "3,49%",
  cashbackFee: "R$ 5,00",
  advancePayments: false,
  introTitle1: "Um novo nível de cuidado pessoal em Manaus!",
  introSubtitle1: "Barbearia + Quiropraxia com planos mensais exclusivos.",
  introTitle2: "Assinatura que vai além do VISUAL",
  introSubtitle2: "Aqui, cuidar do seu estilo também é cuidar da sua saúde!",
  introTitle3: "Seu TEMPO vale mais com a gente!",
  introSubtitle3:
    "Agendamentos fáceis, atendimento VIP e uma rotina sem estresse.",
  cancellationTolerance: "30 minutos",
  penaltyDuration: "7 dias",
  beardClubName: "Simetria Club+",
  dpoteCommission: "40",
  voucherDiscountFrom: "Comissão do profissional",
}

export function EmpresaView() {
  const [form, setForm] = useState(initialCompanyForm)
  const [feedback, setFeedback] = useState(
    "Preencha todos os campos obrigatórios."
  )

  const requiredFilled =
    form.corporateName.trim().length > 0 &&
    form.tradeName.trim().length > 0 &&
    form.cnpj.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.timezone.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.slug.trim().length > 0 &&
    form.primaryR.trim().length > 0 &&
    form.primaryG.trim().length > 0 &&
    form.primaryB.trim().length > 0

  const primaryColor = `rgb(${form.primaryR || 0}, ${form.primaryG || 0}, ${
    form.primaryB || 0
  })`

  function update<Key extends keyof typeof form>(
    key: Key,
    value: (typeof form)[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function saveCompany() {
    if (!requiredFilled) {
      setFeedback("Revise os campos obrigatórios antes de salvar.")
      return
    }

    setFeedback("Dados da empresa preparados para atualização.")
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Empresa"
          value={form.tradeName}
          change="Cadastro principal ativo"
          icon={Building02Icon}
          tone="green"
        />
        <MetricCard
          title="URL"
          value={form.slug}
          change="Alterações de slug levam até 24h"
          icon={File01Icon}
          tone="blue"
        />
        <MetricCard
          title="Pagamentos"
          value={form.advancePayments ? "Adianta" : "Sem adiantamento"}
          change="Gateway e taxas configurados"
          icon={Wallet02Icon}
          tone="amber"
        />
      </div>

      <SectionCard
        title="Editar empresa"
        description="Dados. Preencha todos os campos obrigatórios."
        action={
          <Button size="sm" onClick={saveCompany}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar alterações
          </Button>
        }
      >
        <FormGrid>
          <FormField label="Razão social *">
            <Input
              value={form.corporateName}
              onChange={(event) => update("corporateName", event.target.value)}
            />
          </FormField>
          <FormField label="Nome fantasia *">
            <Input
              value={form.tradeName}
              onChange={(event) => update("tradeName", event.target.value)}
            />
          </FormField>
          <FormField label="CNPJ *">
            <Input
              value={form.cnpj}
              inputMode="numeric"
              onChange={(event) => update("cnpj", event.target.value)}
            />
          </FormField>
          <FormField label="Email *">
            <Input
              value={form.email}
              type="email"
              onChange={(event) => update("email", event.target.value)}
            />
          </FormField>
          <FormField label="Fuso horário *">
            <Select
              value={form.timezone}
              onValueChange={(value) => update("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Telefone *">
            <Input
              value={form.phone}
              inputMode="tel"
              onChange={(event) => update("phone", event.target.value)}
            />
          </FormField>
        </FormGrid>

        <FeedbackMessage>{feedback}</FeedbackMessage>
      </SectionCard>

      <SectionCard title="Personalização">
        <FormGrid>
          <FormField label="Slug de Url *">
            <Input
              value={form.slug}
              onChange={(event) => update("slug", event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              * Alterações de Slug levam até 24h para serem processadas
            </p>
          </FormField>
          <FormField label="Cor Primária (R,G,B) *">
            <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
              <span
                className="h-10 rounded-md border"
                style={{ backgroundColor: primaryColor }}
                aria-hidden="true"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={form.primaryR}
                  inputMode="numeric"
                  maxLength={3}
                  aria-label="Vermelho"
                  onChange={(event) => update("primaryR", event.target.value)}
                />
                <Input
                  value={form.primaryG}
                  inputMode="numeric"
                  maxLength={3}
                  aria-label="Verde"
                  onChange={(event) => update("primaryG", event.target.value)}
                />
                <Input
                  value={form.primaryB}
                  inputMode="numeric"
                  maxLength={3}
                  aria-label="Azul"
                  onChange={(event) => update("primaryB", event.target.value)}
                />
              </div>
            </div>
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard
        title="Dados de pagamento"
        description="Informações importantes sobre a plataforma de pagamentos"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ReadonlyInfo label="Pix Saque" value={form.pixWithdrawal} />
          <ReadonlyInfo
            label="Taxa Fixa Transação (Empresa)"
            value={form.fixedTransactionFee}
          />
          <ReadonlyInfo
            label="Taxa Variável Transação (Empresa)"
            value={form.variableTransactionFee}
          />
          <ReadonlyInfo
            label="Taxa Cashback (Empresa)"
            value={form.cashbackFee}
          />
        </div>
        <label className="mt-4 flex min-w-0 items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
          <Checkbox
            checked={form.advancePayments}
            onCheckedChange={(checked) =>
              update("advancePayments", Boolean(checked))
            }
          />
          <span>Adianta pagamentos?</span>
        </label>
      </SectionCard>

      <SectionCard title="Imagens da empresa">
        <div className="grid gap-3 lg:grid-cols-3">
          <UploadField
            label="Logo"
            description="A logo deve possuir as dimensões de 1024 x 1024 pixels."
          />
          <UploadField
            label="Ícone"
            description="O ícone deve possuir as dimensões de 512x512 pixels."
          />
          <UploadField
            label="Imagens do carrossel"
            description="As imagens devem possuir as dimensões de 512 x 590 pixels."
            multiple
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Títulos e Subtítulos de introdução"
        description="Informações exibidas nas telas de introdução ao estabelecimento."
      >
        <FormGrid>
          <FormField label="1º Título">
            <Textarea
              value={form.introTitle1}
              onChange={(event) => update("introTitle1", event.target.value)}
            />
          </FormField>
          <FormField label="1º Subtítulo">
            <Textarea
              value={form.introSubtitle1}
              onChange={(event) => update("introSubtitle1", event.target.value)}
            />
          </FormField>
          <FormField label="2º Título">
            <Textarea
              value={form.introTitle2}
              onChange={(event) => update("introTitle2", event.target.value)}
            />
          </FormField>
          <FormField label="2º Subtítulo">
            <Textarea
              value={form.introSubtitle2}
              onChange={(event) => update("introSubtitle2", event.target.value)}
            />
          </FormField>
          <FormField label="3º Título">
            <Textarea
              value={form.introTitle3}
              onChange={(event) => update("introTitle3", event.target.value)}
            />
          </FormField>
          <FormField label="3º Subtítulo">
            <Textarea
              value={form.introSubtitle3}
              onChange={(event) => update("introSubtitle3", event.target.value)}
            />
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard
        title="Regras de tolerância e penalidade"
        description="Preencha todos os campos obrigatórios"
      >
        <FormGrid>
          <FormField label="Tolerância de cancelamento *">
            <Select
              value={form.cancellationTolerance}
              onValueChange={(value) => update("cancellationTolerance", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toleranceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Duração da penalidade *">
            <Select
              value={form.penaltyDuration}
              onValueChange={(value) => update("penaltyDuration", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {penaltyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard title="Clube da Barba">
        <FormGrid>
          <FormField label="Nome Clube da Barba">
            <Input
              value={form.beardClubName}
              onChange={(event) => update("beardClubName", event.target.value)}
            />
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard
        title="Configurações módulo Dpote"
        description="Apenas para assinantes Dpote"
      >
        <FormGrid>
          <FormField label="Comissão (%) *">
            <Input
              value={form.dpoteCommission}
              inputMode="numeric"
              type="number"
              min={0}
              max={100}
              onChange={(event) =>
                update("dpoteCommission", event.target.value)
              }
            />
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard title="Financeiro">
        <FormGrid>
          <FormField label="Descontar vale de">
            <Select
              value={form.voucherDiscountFrom}
              onValueChange={(value) => update("voucherDiscountFrom", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voucherDiscountOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormGrid>
        <ResponsiveActions className="mt-5 border-t pt-5">
          <Button variant="outline" onClick={() => setForm(initialCompanyForm)}>
            Restaurar dados
          </Button>
          <Button onClick={saveCompany}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar alterações
          </Button>
        </ResponsiveActions>
      </SectionCard>
    </>
  )
}

function ReadonlyInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 font-semibold break-words">{value}</p>
    </div>
  )
}

function UploadField({
  label,
  description,
  multiple,
}: {
  label: string
  description: string
  multiple?: boolean
}) {
  return (
    <label className="grid min-w-0 gap-3 rounded-md border bg-muted/30 p-3">
      <span className="flex min-w-0 items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <HugeiconsIcon icon={File01Icon} size={18} />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{label}</span>
          <span className="mt-1 block text-sm leading-snug text-muted-foreground">
            {description}
          </span>
        </span>
      </span>
      <Input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="h-auto py-2 file:mr-3 file:rounded-full file:border-0 file:bg-primary/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
      />
    </label>
  )
}

function FeedbackMessage({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex min-w-0 items-center justify-between gap-3 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
      <span className="break-words">{children}</span>
      <StatusBadge tone="green">Editável</StatusBadge>
    </div>
  )
}
