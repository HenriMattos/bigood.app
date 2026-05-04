"use client"

import { useEffect, useState, type ChangeEvent, type ReactNode } from "react"
import {
  Building02Icon,
  CheckmarkCircle01Icon,
  File01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database } from "@/components/admin/database"
import {
  COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY,
  COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY,
  COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY,
  COMPANY_ICON_STORAGE_KEY,
  COMPANY_LOGO_STORAGE_KEY,
} from "@/components/company/company-assets"
import {
  clientPortalThemes,
  CLIENT_PORTAL_SYNC_EVENT,
  createDefaultClientPortalSettings,
  getStoredClientPortalSettings,
  saveClientPortalSettings,
} from "@/components/company/client-portal-config"
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
  logoUrl: database.company.logoUrl,
  iconUrl: database.company.iconUrl,
  carouselImage1: "",
  carouselImage2: "",
  carouselImage3: "",
  clientThemeId: clientPortalThemes[0].id,
  clientMode: clientPortalThemes[0].mode,
  pixWithdrawal: "",
  fixedTransactionFee: "R$ 0,00",
  variableTransactionFee: "0,00%",
  cashbackFee: "R$ 0,00",
  advancePayments: false,
  introTitle1: "",
  introSubtitle1: "",
  introTitle2: "",
  introSubtitle2: "",
  introTitle3: "",
  introSubtitle3: "",
  cancellationTolerance: toleranceOptions[0],
  penaltyDuration: penaltyOptions[0],
  beardClubName: "",
  dpoteCommission: "0",
  voucherDiscountFrom: voucherDiscountOptions[0],
}

export function EmpresaView() {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    ...initialCompanyForm,
    tradeName: database.company.tradeName,
    slug: database.company.slug,
    logoUrl: database.company.logoUrl,
    iconUrl: database.company.iconUrl,
  })
  const [feedback, setFeedback] = useState(
    "Preencha todos os campos obrigatórios."
  )

  useEffect(() => {
    window.requestAnimationFrame(() => setMounted(true))
    const timer = window.setTimeout(() => {
      const settings = getStoredClientPortalSettings(
        createDefaultClientPortalSettings(database.company)
      )

      setForm((current) => ({
        ...current,
        tradeName: settings.tradeName,
        slug: settings.slug,
        logoUrl: settings.logoUrl ?? current.logoUrl,
        iconUrl: settings.iconUrl ?? current.iconUrl,
        carouselImage1: settings.carouselImage1 ?? current.carouselImage1,
        carouselImage2: settings.carouselImage2 ?? current.carouselImage2,
        carouselImage3: settings.carouselImage3 ?? current.carouselImage3,
        introTitle1: settings.introTitle1 ?? current.introTitle1,
        introSubtitle1: settings.introSubtitle1 ?? current.introSubtitle1,
        introTitle2: settings.introTitle2 ?? current.introTitle2,
        introSubtitle2: settings.introSubtitle2 ?? current.introSubtitle2,
        introTitle3: settings.introTitle3 ?? current.introTitle3,
        introSubtitle3: settings.introSubtitle3 ?? current.introSubtitle3,
        clientThemeId: settings.themeId,
        clientMode: settings.mode,
      }))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const requiredFilled =
    form.corporateName.trim().length > 0 &&
    form.tradeName.trim().length > 0 &&
    form.cnpj.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.timezone.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.slug.trim().length > 0

  function update<Key extends keyof typeof form>(
    key: Key,
    value: (typeof form)[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function persistPortalSettings(nextForm = form) {
    const logoUrl =
      window.localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) || nextForm.logoUrl
    const iconUrl =
      window.localStorage.getItem(COMPANY_ICON_STORAGE_KEY) || nextForm.iconUrl

    saveClientPortalSettings({
      tradeName: nextForm.tradeName,
      slug: nextForm.slug,
      logoUrl,
      iconUrl,
      carouselImage1: window.localStorage.getItem(COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY) || nextForm.carouselImage1,
      carouselImage2: window.localStorage.getItem(COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY) || nextForm.carouselImage2,
      carouselImage3: window.localStorage.getItem(COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY) || nextForm.carouselImage3,
      introTitle1: nextForm.introTitle1,
      introSubtitle1: nextForm.introSubtitle1,
      introTitle2: nextForm.introTitle2,
      introSubtitle2: nextForm.introSubtitle2,
      introTitle3: nextForm.introTitle3,
      introSubtitle3: nextForm.introSubtitle3,
      themeId: nextForm.clientThemeId,
      mode: nextForm.clientMode,
    })
  }

  function updatePortalTheme(themeId: string) {
    const selectedTheme =
      clientPortalThemes.find((theme) => theme.id === themeId) ??
      clientPortalThemes[0]

    const nextForm = {
      ...form,
      clientThemeId: selectedTheme.id,
      clientMode: selectedTheme.mode,
    }
    setForm(nextForm)
    persistPortalSettings(nextForm)
  }

  function saveCompany() {
    if (!requiredFilled) {
      setFeedback("Revise os campos obrigatórios antes de salvar.")
      return
    }

    persistPortalSettings()
    setFeedback("Dados salvos e portal do cliente atualizado.")
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
            <div className="flex items-center gap-3">
              <Input
                value={form.slug}
                onChange={(event) => update("slug", event.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shrink-0 h-10 px-4"
              >
                <a
                  href={`/cliente?slug=${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <HugeiconsIcon icon={File01Icon} size={16} />
                  Acessar Portal
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              * Alterações de Slug levam até 24h para serem processadas
            </p>
          </FormField>
          <FormField label="Tema premium do portal">
            <ClientThemePicker
              selectedThemeId={form.clientThemeId}
              onSelect={updatePortalTheme}
            />
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
            previewUrl={form.logoUrl}
            storageKey={COMPANY_LOGO_STORAGE_KEY}
          />
          <UploadField
            label="Ícone"
            description="O ícone deve possuir as dimensões de 512x512 pixels."
            previewUrl={form.iconUrl}
            storageKey={COMPANY_ICON_STORAGE_KEY}
          />
          <UploadField
            label="Carrossel 1"
            description="As imagens devem possuir as dimensões de 512 x 590 pixels."
            previewUrl={form.carouselImage1}
            storageKey={COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY}
          />
          <UploadField
            label="Carrossel 2"
            description="As imagens devem possuir as dimensões de 512 x 590 pixels."
            previewUrl={form.carouselImage2}
            storageKey={COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY}
          />
          <UploadField
            label="Carrossel 3"
            description="As imagens devem possuir as dimensões de 512 x 590 pixels."
            previewUrl={form.carouselImage3}
            storageKey={COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY}
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

function ClientThemePicker({
  selectedThemeId,
  onSelect,
}: {
  selectedThemeId: string
  onSelect: (themeId: string) => void
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {clientPortalThemes.map((theme) => {
        const selected = theme.id === selectedThemeId

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={`min-w-0 rounded-md border p-2 text-left transition ${
              selected ? "border-primary ring-2 ring-primary/25" : "hover:bg-muted/40"
            }`}
          >
            <span
              className={`block h-16 rounded ${theme.previewTextClass}`}
              style={{ background: theme.gradient }}
            >
              <span className="flex h-full items-end p-2 text-xs font-black uppercase tracking-widest">
                {theme.name}
              </span>
            </span>
            <span className="mt-2 block text-xs font-semibold">
              {theme.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function UploadField({
  label,
  description,
  multiple,
  previewUrl,
  storageKey,
}: {
  label: string
  description: string
  multiple?: boolean
  previewUrl?: string
  storageKey?: string
}) {
  const [preview, setPreview] = useState(() => {
    if (typeof window === "undefined" || !storageKey) return previewUrl

    return window.localStorage.getItem(storageKey) || previewUrl
  })

  function updatePreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !storageKey) return

    const reader = new FileReader()
    reader.onload = () => {
      const nextPreview = String(reader.result)
      setPreview(nextPreview)
      window.localStorage.setItem(storageKey, nextPreview)
      window.dispatchEvent(new Event(CLIENT_PORTAL_SYNC_EVENT))
    }
    reader.readAsDataURL(file)
  }

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
      {preview && (
        <span className="grid aspect-square max-h-32 place-items-center rounded-md border bg-background p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={`Prévia de ${label}`}
            className="h-full w-full object-contain"
          />
        </span>
      )}
      <Input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={updatePreview}
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
