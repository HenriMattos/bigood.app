"use client"

import Link from "next/link"
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react"
import {
  Building02Icon,
  CheckmarkCircle01Icon,
  File01Icon,
  GlobeIcon,
  Link01Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database } from "@/components/admin/database"
import {
  COMPANY_ICON_STORAGE_KEY,
  COMPANY_LOGO_STORAGE_KEY,
  COMPANY_PORTAL_BANNER_STORAGE_KEY,
  COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY,
  COMPANY_PORTAL_ENABLED_STORAGE_KEY,
  COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY,
  COMPANY_PORTAL_SLOGAN_STORAGE_KEY,
  COMPANY_PORTAL_SLUG_STORAGE_KEY,
  COMPANY_PORTAL_SYNC_EVENT,
} from "@/components/company/company-assets"
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

const portalOpeningFallback = {
  days: "Seg a Sab",
  start: "09:00",
  end: "19:00",
}

const portalDayRangeOptions = [
  "Seg a Sex",
  "Seg a Sab",
  "Ter a Sab",
  "Todos os dias",
]

const portalTimeOptions = Array.from({ length: 31 }, (_, index) => {
  const totalMinutes = 7 * 60 + index * 30
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
})

const initialCompanyForm = {
  corporateName: database.company.corporateName,
  tradeName: database.company.tradeName,
  cnpj: database.company.cnpj,
  email: database.company.email,
  timezone: database.company.timezone,
  phone: database.company.phone,
  logoUrl: database.company.logoUrl,
  iconUrl: database.company.iconUrl,
  slug: database.company.slug,
  portalBannerUrl: "",
  portalDescription:
    "Experiencia premium para agendar, acompanhar planos e cuidar do visual sem mensagens soltas.",
  portalEnabled: true,
  portalOpeningDays: portalOpeningFallback.days,
  portalOpeningEnd: portalOpeningFallback.end,
  portalOpeningHours: "Seg a Sab, 09:00 as 19:00",
  portalOpeningStart: portalOpeningFallback.start,
  portalSlug: database.company.slug,
  portalSlogan: "Cabelo, barba e cuidado no seu tempo.",
  pixWithdrawal: "",
  fixedTransactionFee: "R$ 0,00",
  variableTransactionFee: "0,00%",
  cashbackFee: "R$ 0,00",
  advancePayments: false,
  street: database.company.address.street,
  number: database.company.address.number,
  neighborhood: database.company.address.neighborhood,
  city: database.company.address.city,
  state: database.company.address.state,
  zip: database.company.address.zip,
  mapsUrl: database.company.address.mapsUrl,
  instagram: database.company.social.instagram,
  whatsapp: database.company.social.whatsapp,
  facebook: database.company.social.facebook,
  cancellationTolerance: toleranceOptions[0],
  penaltyDuration: penaltyOptions[0],
  beardClubName: "",
  dpoteCommission: "0",
  voucherDiscountFrom: voucherDiscountOptions[0],
}

function normalizePortalSlug(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-") || "bigood"
  )
}

function buildPortalOpeningHours(days: string, start: string, end: string) {
  return `${days}, ${start} as ${end}`
}

function parsePortalOpeningHours(value: string) {
  const match = value.match(/^(.+),\s*(\d{2}:\d{2})\s+as\s+(\d{2}:\d{2})$/)

  if (!match) {
    return portalOpeningFallback
  }

  return {
    days: portalDayRangeOptions.includes(match[1])
      ? match[1]
      : portalOpeningFallback.days,
    start: portalTimeOptions.includes(match[2])
      ? match[2]
      : portalOpeningFallback.start,
    end: portalTimeOptions.includes(match[3])
      ? match[3]
      : portalOpeningFallback.end,
  }
}

function notifyClientPortalSync() {
  window.dispatchEvent(new Event(COMPANY_PORTAL_SYNC_EVENT))
}

function createImagePreview(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const rawPreview = String(reader.result)
      const image = new Image()

      image.onerror = () => resolve(rawPreview)
      image.onload = () => {
        const maxSize = 1400
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height))

        if (scale === 1 && rawPreview.length < 1_500_000) {
          resolve(rawPreview)
          return
        }

        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))

        const context = canvas.getContext("2d")

        if (!context) {
          resolve(rawPreview)
          return
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.84))
      }
      image.src = rawPreview
    }
    reader.readAsDataURL(file)
  })
}

export function EmpresaView() {
  const [mounted, setMounted] = useState(false)
  const [uploadResetToken, setUploadResetToken] = useState(0)
  const [form, setForm] = useState({
    ...initialCompanyForm,
    tradeName: database.company.tradeName,
    logoUrl: database.company.logoUrl,
    iconUrl: database.company.iconUrl,
  })
  const [feedback, setFeedback] = useState(
    "Preencha todos os campos obrigatórios."
  )

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedOpeningHours =
        window.localStorage.getItem(COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY) ||
        buildPortalOpeningHours(
          portalOpeningFallback.days,
          portalOpeningFallback.start,
          portalOpeningFallback.end
        )
      const parsedOpeningHours = parsePortalOpeningHours(storedOpeningHours)

      setForm((current) => ({
        ...current,
        portalBannerUrl:
          window.localStorage.getItem(COMPANY_PORTAL_BANNER_STORAGE_KEY) || "",
        portalDescription:
          window.localStorage.getItem(COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY) ||
          current.portalDescription,
        portalEnabled:
          window.localStorage.getItem(COMPANY_PORTAL_ENABLED_STORAGE_KEY) !==
          "false",
        portalOpeningDays: parsedOpeningHours.days,
        portalOpeningEnd: parsedOpeningHours.end,
        portalOpeningHours: storedOpeningHours,
        portalOpeningStart: parsedOpeningHours.start,
        portalSlug:
          window.localStorage.getItem(COMPANY_PORTAL_SLUG_STORAGE_KEY) ||
          current.portalSlug,
        portalSlogan:
          window.localStorage.getItem(COMPANY_PORTAL_SLOGAN_STORAGE_KEY) ||
          current.portalSlogan,
      }))
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (!mounted) return null

  const requiredFilled =
    form.corporateName.trim().length > 0 &&
    form.tradeName.trim().length > 0 &&
    form.cnpj.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.timezone.trim().length > 0 &&
    form.phone.trim().length > 0
  const portalSlug = normalizePortalSlug(
    form.portalSlug || database.company.slug
  )
  const portalUrl = `/barbearia/${portalSlug}`
  const portalOpeningHours = buildPortalOpeningHours(
    form.portalOpeningDays,
    form.portalOpeningStart,
    form.portalOpeningEnd
  )

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

    window.localStorage.setItem(
      COMPANY_PORTAL_ENABLED_STORAGE_KEY,
      String(form.portalEnabled)
    )
    window.localStorage.setItem(COMPANY_PORTAL_SLUG_STORAGE_KEY, portalSlug)
    window.localStorage.setItem(
      COMPANY_PORTAL_SLOGAN_STORAGE_KEY,
      form.portalSlogan.trim()
    )
    window.localStorage.setItem(
      COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY,
      form.portalDescription.trim()
    )
    window.localStorage.setItem(
      COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY,
      portalOpeningHours
    )

    setForm((current) => ({
      ...current,
      portalOpeningHours,
      portalSlug,
    }))
    notifyClientPortalSync()
    setFeedback("Dados da empresa salvos.")
  }

  function restoreDefaults() {
    window.localStorage.removeItem(COMPANY_LOGO_STORAGE_KEY)
    window.localStorage.removeItem(COMPANY_ICON_STORAGE_KEY)
    window.localStorage.removeItem(COMPANY_PORTAL_BANNER_STORAGE_KEY)
    window.localStorage.removeItem(COMPANY_PORTAL_DESCRIPTION_STORAGE_KEY)
    window.localStorage.removeItem(COMPANY_PORTAL_ENABLED_STORAGE_KEY)
    window.localStorage.removeItem(COMPANY_PORTAL_OPENING_HOURS_STORAGE_KEY)
    window.localStorage.removeItem(COMPANY_PORTAL_SLOGAN_STORAGE_KEY)
    window.localStorage.removeItem(COMPANY_PORTAL_SLUG_STORAGE_KEY)

    setUploadResetToken((current) => current + 1)

    setForm((current) => ({
      ...current,
      corporateName: database.company.corporateName,
      tradeName: database.company.tradeName,
      cnpj: database.company.cnpj,
      email: database.company.email,
      timezone: database.company.timezone,
      phone: database.company.phone,
      logoUrl: database.company.logoUrl ?? "",
      iconUrl: database.company.iconUrl ?? "",
      slug: database.company.slug,
      portalBannerUrl: "",
      portalDescription:
        "Experiencia premium para agendar, acompanhar planos e cuidar do visual sem mensagens soltas.",
      portalEnabled: true,
      portalOpeningDays: portalOpeningFallback.days,
      portalOpeningEnd: portalOpeningFallback.end,
      portalOpeningHours: "Seg a Sab, 09:00 as 19:00",
      portalOpeningStart: portalOpeningFallback.start,
      portalSlug: database.company.slug,
      portalSlogan: "Cabelo, barba e cuidado no seu tempo.",
      street: database.company.address.street,
      number: database.company.address.number,
      neighborhood: database.company.address.neighborhood,
      city: database.company.address.city,
      state: database.company.address.state,
      zip: database.company.address.zip,
      mapsUrl: database.company.address.mapsUrl,
      instagram: database.company.social.instagram,
      whatsapp: database.company.social.whatsapp,
      facebook: database.company.social.facebook,
    }))

    setFeedback("Dados restaurados ao padrao. Uploads removidos.")
    notifyClientPortalSync()
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

      <SectionCard
        title="Portal do cliente"
        description="Personalize a pagina publica mobile usada pelos clientes."
        action={
          <Button size="sm" asChild>
            <Link href={portalUrl} target="_blank">
              <HugeiconsIcon icon={GlobeIcon} size={16} />
              Acessar portal
            </Link>
          </Button>
        }
      >
        <FormGrid>
          <FormField label="Portal ativo">
            <label className="flex min-h-10 items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
              <Checkbox
                checked={form.portalEnabled}
                onCheckedChange={(checked) =>
                  update("portalEnabled", Boolean(checked))
                }
              />
              <span>Permitir acesso publico ao portal do cliente</span>
            </label>
          </FormField>
          <FormField label="URL publica">
            <div className="flex min-w-0 gap-2">
              <Input
                value={form.portalSlug}
                placeholder="bigood"
                onChange={(event) =>
                  update("portalSlug", normalizePortalSlug(event.target.value))
                }
              />
              <Button size="icon" variant="outline" asChild>
                <Link
                  href={portalUrl}
                  target="_blank"
                  aria-label="Abrir portal"
                >
                  <HugeiconsIcon icon={Link01Icon} size={16} />
                </Link>
              </Button>
            </div>
            <p className="mt-2 text-xs break-all text-muted-foreground">
              {portalUrl}
            </p>
          </FormField>
          <FormField label="Slogan do portal">
            <Input
              value={form.portalSlogan}
              onChange={(event) => update("portalSlogan", event.target.value)}
            />
          </FormField>
          <FormField label="Dias de funcionamento">
            <Select
              value={form.portalOpeningDays}
              onValueChange={(value) => update("portalOpeningDays", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {portalDayRangeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Abre as">
            <Select
              value={form.portalOpeningStart}
              onValueChange={(value) => update("portalOpeningStart", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {portalTimeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Fecha as">
            <Select
              value={form.portalOpeningEnd}
              onValueChange={(value) => update("portalOpeningEnd", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {portalTimeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Horario exibido no portal">
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium text-foreground">
              {portalOpeningHours}
            </div>
          </FormField>
          <div className="col-span-full">
            <FormField label="Descricao curta">
              <Input
                value={form.portalDescription}
                onChange={(event) =>
                  update("portalDescription", event.target.value)
                }
              />
            </FormField>
          </div>
        </FormGrid>
        <div className="mt-4">
          <UploadField
            label="Banner do portal"
            description="Imagem horizontal do topo do portal mobile. Se ficar vazio, o Bigood usa o fundo verde padrao."
            previewUrl={form.portalBannerUrl}
            storageKey={COMPANY_PORTAL_BANNER_STORAGE_KEY}
            resetToken={uploadResetToken}
          />
        </div>
        <ResponsiveActions className="mt-5 border-t pt-5">
          <Button variant="outline" asChild>
            <Link href={portalUrl} target="_blank">
              <HugeiconsIcon icon={GlobeIcon} size={16} />
              Ver portal do cliente
            </Link>
          </Button>
          <Button onClick={saveCompany}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar portal
          </Button>
        </ResponsiveActions>
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

      <SectionCard
        title="Imagens da empresa"
        action={
          <Button size="sm" variant="outline" onClick={restoreDefaults}>
            Restaurar padrao
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <UploadField
            label="Logo"
            description="A logo deve possuir as dimensões de 1024 x 1024 pixels."
            previewUrl={form.logoUrl}
            storageKey={COMPANY_LOGO_STORAGE_KEY}
            resetToken={uploadResetToken}
          />
          <UploadField
            label="Ícone"
            description="O ícone deve possuir as dimensões de 512x512 pixels."
            previewUrl={form.iconUrl}
            storageKey={COMPANY_ICON_STORAGE_KEY}
            resetToken={uploadResetToken}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Localização"
        description="Onde seus clientes podem te encontrar"
      >
        <FormGrid>
          <FormField label="Rua / Logradouro">
            <Input
              value={form.street}
              onChange={(event) => update("street", event.target.value)}
            />
          </FormField>
          <FormField label="Número">
            <Input
              value={form.number}
              onChange={(event) => update("number", event.target.value)}
            />
          </FormField>
          <FormField label="Bairro">
            <Input
              value={form.neighborhood}
              onChange={(event) => update("neighborhood", event.target.value)}
            />
          </FormField>
          <FormField label="Cidade">
            <Input
              value={form.city}
              onChange={(event) => update("city", event.target.value)}
            />
          </FormField>
          <FormField label="Estado (UF)">
            <Input
              value={form.state}
              placeholder="Ex: SP"
              onChange={(event) => update("state", event.target.value)}
            />
          </FormField>
          <FormField label="CEP">
            <Input
              value={form.zip}
              onChange={(event) => update("zip", event.target.value)}
            />
          </FormField>
          <div className="col-span-full">
            <FormField label="Link do Google Maps">
              <Input
                value={form.mapsUrl}
                placeholder="https://maps.google.com/..."
                onChange={(event) => update("mapsUrl", event.target.value)}
              />
            </FormField>
          </div>
        </FormGrid>
      </SectionCard>

      <SectionCard title="Redes Sociais">
        <FormGrid>
          <FormField label="Instagram (usuário)">
            <Input
              value={form.instagram}
              placeholder="@seu.perfil"
              onChange={(event) => update("instagram", event.target.value)}
            />
          </FormField>
          <FormField label="WhatsApp (número)">
            <Input
              value={form.whatsapp}
              placeholder="11987654321"
              onChange={(event) => update("whatsapp", event.target.value)}
            />
          </FormField>
          <FormField label="Facebook (slug)">
            <Input
              value={form.facebook}
              placeholder="sua.pagina"
              onChange={(event) => update("facebook", event.target.value)}
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
          <Button variant="outline" onClick={restoreDefaults}>
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
  previewUrl,
  storageKey,
  resetToken,
}: {
  label: string
  description: string
  multiple?: boolean
  previewUrl?: string
  storageKey?: string
  resetToken?: number
}) {
  const [preview, setPreview] = useState(() => {
    if (typeof window === "undefined" || !storageKey) return previewUrl

    return window.localStorage.getItem(storageKey) || previewUrl
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!storageKey) {
        setPreview(previewUrl)
        return
      }

      setPreview(window.localStorage.getItem(storageKey) || previewUrl)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [previewUrl, resetToken, storageKey])

  async function updatePreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !storageKey) return

    setMessage("Preparando imagem...")

    try {
      const nextPreview = await createImagePreview(file)
      setPreview(nextPreview)
      window.localStorage.setItem(storageKey, nextPreview)
      setMessage("Imagem salva.")
      notifyClientPortalSync()
    } catch {
      setMessage("Nao foi possivel salvar a imagem. Tente uma imagem menor.")
    }
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
      {message && (
        <span className="text-xs font-semibold text-muted-foreground">
          {message}
        </span>
      )}
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
