"use client"

import { useMemo, useState, type ReactNode } from "react"

import { serviceCatalog, serviceNames } from "@/components/admin/catalog-data"
import { database } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DiscountItem = {
  id: number
  name: string
  discount: number
}

type ServiceItem = DiscountItem & {
  freeQuantity: number
}

type ProductItem = {
  id: number
  name: string
  value: number
}

type PlanTheme = {
  id: string
  name: string
  description: string
  gradient: string
  textClass: string
}

const planThemes: PlanTheme[] = [
  {
    id: "verde-ouro",
    name: "Verde ouro",
    description: "Energia premium, crescimento e alto valor",
    gradient: "linear-gradient(135deg, #059447 0%, #37d367 42%, #ffd43d 100%)",
    textClass: "text-[#082814]",
  },
  {
    id: "esmeralda-azul",
    name: "Esmeralda azul",
    description: "Moderno, limpo e tecnológico",
    gradient: "linear-gradient(135deg, #00a86b 0%, #24c6dc 48%, #2f80ed 100%)",
    textClass: "text-white",
  },
  {
    id: "roxo-lima",
    name: "Roxo lima",
    description: "Criativo, jovem e chamativo",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 46%, #bef264 100%)",
    textClass: "text-white",
  },
  {
    id: "por-do-sol",
    name: "Pôr do sol",
    description: "Quente, elegante e comercial",
    gradient: "linear-gradient(135deg, #f97316 0%, #facc15 45%, #16a34a 100%)",
    textClass: "text-[#251204]",
  },
  {
    id: "grafite-neon",
    name: "Grafite neon",
    description: "Sofisticado, escuro e premium",
    gradient: "linear-gradient(135deg, #111827 0%, #14532d 52%, #a3e635 100%)",
    textClass: "text-white",
  },
  {
    id: "rose-champagne",
    name: "Rose champagne",
    description: "Leve, refinado e diferente",
    gradient: "linear-gradient(135deg, #be185d 0%, #f9a8d4 48%, #fde68a 100%)",
    textClass: "text-white",
  },
]

const serviceCategories = Array.from(
  new Set(serviceCatalog.map((service) => service.category))
)
const services = serviceNames
const productCategories = Array.from(
  new Set(database.products.map((product) => product.category))
)
const products = database.products.map((product) => product.name)
const professionals = database.professionals
  .filter((professional) => professional.status === "Ativo")
  .map((professional) => professional.name)
const freeDays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
]

export default function CriarPlanosPage() {
  const [planValue, setPlanValue] = useState(0)
  const [selectedThemeId, setSelectedThemeId] = useState(planThemes[0].id)
  const [serviceCategoryDraft, setServiceCategoryDraft] = useState({
    name: "",
    discount: 0,
  })
  const [serviceDraft, setServiceDraft] = useState({
    name: "",
    discount: 0,
    freeQuantity: 0,
  })
  const [productCategoryDraft, setProductCategoryDraft] = useState({
    name: "",
    discount: 0,
  })
  const [productDraft, setProductDraft] = useState({
    name: "",
    value: 0,
  })
  const [serviceCategoryItems, setServiceCategoryItems] = useState<
    DiscountItem[]
  >([])
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([])
  const [productCategoryItems, setProductCategoryItems] = useState<
    DiscountItem[]
  >([])
  const [productItems, setProductItems] = useState<ProductItem[]>([])
  const totalValue = useMemo(() => formatCurrency(planValue), [planValue])
  const selectedTheme =
    planThemes.find((theme) => theme.id === selectedThemeId) ?? planThemes[0]

  function addServiceCategory() {
    if (!serviceCategoryDraft.name) return

    setServiceCategoryItems((current) => [
      ...current,
      { id: Date.now(), ...serviceCategoryDraft },
    ])
    setServiceCategoryDraft({ name: "", discount: 0 })
  }

  function addService() {
    if (!serviceDraft.name) return

    setServiceItems((current) => [
      ...current,
      { id: Date.now(), ...serviceDraft },
    ])
    setServiceDraft({ name: "", discount: 0, freeQuantity: 0 })
  }

  function addProductCategory() {
    if (!productCategoryDraft.name) return

    setProductCategoryItems((current) => [
      ...current,
      { id: Date.now(), ...productCategoryDraft },
    ])
    setProductCategoryDraft({ name: "", discount: 0 })
  }

  function addProduct() {
    if (!productDraft.name) return

    setProductItems((current) => [
      ...current,
      { id: Date.now(), ...productDraft },
    ])
    setProductDraft({ name: "", value: 0 })
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-primary uppercase">
            Planos de assinatura
          </p>
          <h2 className="mt-1 text-xl font-semibold">Criar novo plano</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Configure valores, regras, benefícios e a aparência do card premium.
          </p>
        </div>
        <Button className="w-full md:w-auto">Criar plano</Button>
      </div>

      <SectionCard
        title="Dados"
        description="Preencha todos os campos obrigatórios."
      >
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <Field label="Nome *">
            <Input placeholder="Nome do plano" />
          </Field>
          <Field label="Valor do plano *">
            <MoneyInput value={planValue} onChange={setPlanValue} />
          </Field>
          <Field className="md:col-span-2" label="Tema do card *">
            <ThemePicker
              themes={planThemes}
              selectedTheme={selectedTheme}
              onSelect={setSelectedThemeId}
            />
          </Field>
          <Field label="Taxa Cashback">
            <NumberInput suffix="%" />
          </Field>
          <Field label="Qtde. disponível">
            <NumberInput />
          </Field>
          <Field label="Bloqueio de assinatura (Dias)">
            <NumberInput />
          </Field>
          <Field label="Quantidade máxima de serviços simultâneos *">
            <NumberInput placeholder="1" />
          </Field>
          <Field label="Periodicidade de atendimento (dias)">
            <NumberInput placeholder="30" />
          </Field>
          <CheckOption label="Oculto" />
        </div>
      </SectionCard>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionCard title="Valores" description="Valores do plano">
          <div
            className={`relative overflow-hidden rounded-md border p-4 ${selectedTheme.textClass}`}
            style={{ background: selectedTheme.gradient }}
          >
            <div className="absolute inset-0 bg-white/16" />
            <div className="relative">
              <p className="text-sm font-medium opacity-75">
                Valor total do plano
              </p>
              <p className="mt-2 text-2xl font-semibold">{totalValue}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Contrato"
          description="Adicione o contrato do plano."
        >
          <textarea
            rows={7}
            className="min-h-40 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            placeholder="Cole ou escreva aqui as regras do contrato do plano."
          />
        </SectionCard>
      </section>

      <SectionCard
        title="Categorias de serviço"
        description="Categorias de serviço adicionadas."
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(9rem,0.35fr)_auto] md:items-end">
          <Field label="Categoria *">
            <OptionSelect
              value={serviceCategoryDraft.name}
              options={serviceCategories}
              onValueChange={(value) =>
                setServiceCategoryDraft((current) => ({
                  ...current,
                  name: value,
                }))
              }
            />
          </Field>
          <Field label="Desconto (%) *">
            <NumberInput
              value={serviceCategoryDraft.discount}
              suffix="%"
              onChange={(value) =>
                setServiceCategoryDraft((current) => ({
                  ...current,
                  discount: value,
                }))
              }
            />
          </Field>
          <Button onClick={addServiceCategory}>Adicionar</Button>
        </div>
        <AddedDiscountList
          emptyMessage="Nenhuma categoria adicionada!"
          items={serviceCategoryItems}
        />
      </SectionCard>

      <SectionCard title="Serviços" description="Serviços adicionados.">
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(9rem,0.3fr)_minmax(9rem,0.3fr)_auto] md:items-end">
          <Field label="Serviço *">
            <OptionSelect
              value={serviceDraft.name}
              options={services}
              onValueChange={(value) =>
                setServiceDraft((current) => ({ ...current, name: value }))
              }
            />
          </Field>
          <Field label="Desconto (%) *">
            <NumberInput
              value={serviceDraft.discount}
              suffix="%"
              onChange={(value) =>
                setServiceDraft((current) => ({
                  ...current,
                  discount: value,
                }))
              }
            />
          </Field>
          <Field label="Qtde. gratuitos *">
            <NumberInput
              value={serviceDraft.freeQuantity}
              onChange={(value) =>
                setServiceDraft((current) => ({
                  ...current,
                  freeQuantity: value,
                }))
              }
            />
          </Field>
          <Button onClick={addService}>Adicionar</Button>
        </div>
        <AddedServiceList items={serviceItems} />
      </SectionCard>

      <SectionCard title="Profissionais que atendem ao plano">
        <div className="grid gap-2 sm:grid-cols-2">
          {professionals.map((professional) => (
            <CheckOption key={professional} label={professional} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Dias de gratuidade" description="Dias adicionados.">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {freeDays.map((day) => (
            <CheckOption key={day} label={day} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Categorias de produto"
        description="Categorias de produto adicionadas."
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(9rem,0.35fr)_auto] md:items-end">
          <Field label="Categoria *">
            <OptionSelect
              value={productCategoryDraft.name}
              options={productCategories}
              onValueChange={(value) =>
                setProductCategoryDraft((current) => ({
                  ...current,
                  name: value,
                }))
              }
            />
          </Field>
          <Field label="Desconto (%) *">
            <NumberInput
              value={productCategoryDraft.discount}
              suffix="%"
              onChange={(value) =>
                setProductCategoryDraft((current) => ({
                  ...current,
                  discount: value,
                }))
              }
            />
          </Field>
          <Button onClick={addProductCategory}>Adicionar</Button>
        </div>
        <AddedDiscountList
          emptyMessage="Nenhuma categoria adicionada!"
          items={productCategoryItems}
        />
      </SectionCard>

      <SectionCard title="Produtos" description="Produtos adicionados.">
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(10rem,0.35fr)_auto] md:items-end">
          <Field label="Produto *">
            <OptionSelect
              value={productDraft.name}
              options={products}
              onValueChange={(value) =>
                setProductDraft((current) => ({ ...current, name: value }))
              }
            />
          </Field>
          <Field label="Valor *">
            <MoneyInput
              value={productDraft.value}
              onChange={(value) =>
                setProductDraft((current) => ({ ...current, value }))
              }
            />
          </Field>
          <Button onClick={addProduct}>Adicionar</Button>
        </div>
        <AddedProductList items={productItems} />
      </SectionCard>
    </div>
  )
}

function ThemePicker({
  themes,
  selectedTheme,
  onSelect,
}: {
  themes: PlanTheme[]
  selectedTheme: PlanTheme
  onSelect: (themeId: string) => void
}) {
  return (
    <div className="grid gap-3">
      <div
        className={`relative min-h-32 overflow-hidden rounded-lg border p-4 ${selectedTheme.textClass}`}
        style={{ background: selectedTheme.gradient }}
      >
        <div className="absolute inset-0 bg-white/14" />
        <div className="absolute inset-y-[-40%] left-[-24%] w-24 rotate-12 bg-white/70 blur-sm" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase opacity-70">
            Tema selecionado
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{selectedTheme.name}</h3>
          <p className="mt-1 max-w-md text-sm font-medium opacity-75">
            {selectedTheme.description}
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => {
          const selected = theme.id === selectedTheme.id

          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={selected}
              className={`min-w-0 rounded-md border p-2 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                selected
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border"
              }`}
              onClick={() => onSelect(theme.id)}
            >
              <span
                className={`relative block h-20 overflow-hidden rounded-md ${theme.textClass}`}
                style={{ background: theme.gradient }}
              >
                <span className="absolute inset-0 bg-white/10" />
                <span className="absolute inset-y-[-35%] left-[-22%] w-14 rotate-12 bg-white/65 blur-sm" />
                <span className="relative block p-3 text-sm font-semibold">
                  {theme.name}
                </span>
              </span>
              <span className="mt-2 block truncate text-sm font-medium">
                {theme.name}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                {theme.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
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
    <div className={`grid min-w-0 gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function OptionSelect({
  value,
  options,
  onValueChange,
}: {
  value: string
  options: string[]
  onValueChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function NumberInput({
  value,
  placeholder = "0",
  suffix,
  onChange,
}: {
  value?: number
  placeholder?: string
  suffix?: string
  onChange?: (value: number) => void
}) {
  return (
    <div className="relative min-w-0">
      <Input
        type="text"
        value={value ?? ""}
        inputMode="decimal"
        placeholder={placeholder}
        className={suffix ? "pr-8" : undefined}
        onChange={(event) => onChange?.(parseNumeric(event.target.value))}
      />
      {suffix ? (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  )
}

function MoneyInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex h-10 min-w-0 items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring/30">
      <span className="shrink-0 pl-3 text-sm text-muted-foreground">R$</span>
      <Input
        type="text"
        value={value || ""}
        inputMode="decimal"
        placeholder="0,00"
        className="h-full border-0 pl-2 shadow-none focus-visible:ring-0"
        onChange={(event) => onChange(parseNumeric(event.target.value))}
      />
    </div>
  )
}

function CheckOption({ label }: { label: string }) {
  return (
    <label className="flex min-h-10 min-w-0 items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
      <Checkbox />
      <span className="break-words">{label}</span>
    </label>
  )
}

function AddedDiscountList({
  items,
  emptyMessage,
}: {
  items: DiscountItem[]
  emptyMessage: string
}) {
  if (items.length === 0) return <EmptyList>{emptyMessage}</EmptyList>

  return (
    <div className="mt-4 grid gap-2">
      {items.map((item) => (
        <ListRow key={item.id} label={item.name} value={`${item.discount}%`} />
      ))}
    </div>
  )
}

function AddedServiceList({ items }: { items: ServiceItem[] }) {
  if (items.length === 0)
    return <EmptyList>Nenhum serviço adicionado!</EmptyList>

  return (
    <div className="mt-4 grid gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="grid gap-1 rounded-md border bg-background px-3 py-2 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto]"
        >
          <span className="font-medium break-words">{item.name}</span>
          <span className="text-muted-foreground">{item.discount}%</span>
          <span className="text-muted-foreground">
            {item.freeQuantity} gratuitos
          </span>
        </div>
      ))}
    </div>
  )
}

function AddedProductList({ items }: { items: ProductItem[] }) {
  if (items.length === 0)
    return <EmptyList>Nenhum produto adicionado!</EmptyList>

  return (
    <div className="mt-4 grid gap-2">
      {items.map((item) => (
        <ListRow
          key={item.id}
          label={item.name}
          value={formatCurrency(item.value)}
        />
      ))}
    </div>
  )
}

function ListRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-background px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="font-medium break-words">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

function EmptyList({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-md border border-dashed bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

function parseNumeric(value: string) {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "")

  return Number(normalized) || 0
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
