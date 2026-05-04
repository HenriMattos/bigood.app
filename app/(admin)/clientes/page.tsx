import Link from "next/link"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  UserAdd01Icon,
  UserMultipleIcon,
  UserStar01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { clients, loyalClients } from "@/components/admin/clientes-data"
import { database } from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

export default function ClientesPage() {
  const registered = database.analytics.activeClients
  const recurring = database.analytics.recurringClients
  const noReturn = database.analytics.clientsWithoutPlan
  const loyaltyRate = Math.round((recurring / registered) * 100)
  const riskRate = Math.round((noReturn / registered) * 100)

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <SectionCard
          title="Carteira de clientes"
          description="Visao rapida da base ativa, recorrencia e clientes que precisam de retorno"
          action={
            <Button size="sm" asChild>
              <Link href="/clientes/cadastrar">
                <HugeiconsIcon icon={UserAdd01Icon} size={16} />
                Cadastrar
              </Link>
            </Button>
          }
        >
          <div className="grid gap-3 md:grid-cols-3">
            <CustomerMetric
              title="Cadastrados"
              value={registered}
              detail={`${database.analytics.newClientsThisMonth} novos neste mes`}
              icon={UserMultipleIcon}
              tone="green"
              progress={100}
            />
            <CustomerMetric
              title="Recorrentes"
              value={recurring}
              detail={`${loyaltyRate}% da base ativa`}
              icon={UserStar01Icon}
              tone="blue"
              progress={loyaltyRate}
            />
            <CustomerMetric
              title="Sem retorno"
              value={noReturn}
              detail="Clientes ativos sem plano"
              icon={Calendar03Icon}
              tone="amber"
              progress={riskRate}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Saude da base"
          description="Leitura operacional para priorizar atendimento"
        >
          <div className="grid gap-4">
            <HealthRow label="Clientes ativos" value="100%" progress={100} />
            <HealthRow
              label="Fidelidade"
              value={`${loyaltyRate}%`}
              progress={loyaltyRate}
            />
            <HealthRow
              label="Sem plano"
              value={`${riskRate}%`}
              progress={riskRate}
              tone="amber"
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Clientes em destaque"
        description="Ranking dos clientes com maior recorrencia e melhor relacionamento recente"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/clientes/listagem">
              Ver todos
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {loyalClients.length === 0 ? (
            <div className="lg:col-span-3">
              <EmptyState
                icon={UserStar01Icon}
                title="Nenhum cliente em destaque"
                description="Os clientes com mais de 10 visitas aparecerão aqui automaticamente conforme você registra novos agendamentos."
                className="min-h-[250px]"
              />
            </div>
          ) : (
            loyalClients.map((client, index) => (
              <article
                key={client.id}
                className="min-w-0 rounded-md border bg-background p-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                      {client.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold">{client.name}</h3>
                        <StatusBadge tone="green">Destaque</StatusBadge>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {client.phone}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-primary">
                    #{index + 1}
                  </span>
                </div>

                <div className="mt-4 rounded-md bg-muted/35 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Recorrencia</span>
                    <span className="font-semibold">{client.visits} visitas</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(client.visits * 5, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <Info label="Ultima visita" value={client.lastVisit} />
                  <Info
                    label="Ticket medio"
                    value={`R$ ${client.averageTicket}`}
                  />
                </div>

                <div className="mt-3 border-t pt-3 text-sm">
                  <p className="text-muted-foreground">Servico preferido</p>
                  <p className="mt-1 font-semibold">{client.favoriteService}</p>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" asChild>
            <Link href="/clientes/listagem">Ver listagem completa</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/clientes/recompras">Ver recompras sugeridas</Link>
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Acoes recomendadas"
        description="Proximos movimentos para aumentar recorrencia e recompras"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <ActionItem
            title="Reativar sem retorno"
            value={`${noReturn} clientes`}
            description="Enviar mensagem para quem passou de 45 dias sem visitar."
          />
          <ActionItem
            title="Oferecer planos"
            value={`${clients.length} perfis analisados`}
            description="Priorizar clientes com alta recorrencia e sem plano ativo."
          />
          <ActionItem
            title="Campanha de recompra"
            value="4 sugestoes"
            description="Produtos e servicos com data prevista para nova oferta."
          />
        </div>
      </SectionCard>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

function CustomerMetric({
  title,
  value,
  detail,
  icon,
  tone,
  progress,
}: {
  title: string
  value: number
  detail: string
  icon: typeof UserMultipleIcon
  tone: "green" | "blue" | "amber"
  progress: number
}) {
  const toneClasses = {
    green: "bg-primary/15 text-primary",
    blue: "bg-sky-500/10 text-sky-600",
    amber: "bg-amber-500/10 text-amber-700",
  }

  const barClasses = {
    green: "bg-primary",
    blue: "bg-sky-500",
    amber: "bg-amber-500",
  }

  return (
    <article className="rounded-md border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <strong className="mt-1 block text-2xl font-semibold tracking-normal">
            {value}
          </strong>
        </div>
        <span className={`rounded-md p-2 ${toneClasses[tone]}`}>
          <HugeiconsIcon icon={icon} size={20} />
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${barClasses[tone]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{detail}</p>
    </article>
  )
}

function HealthRow({
  label,
  value,
  progress,
  tone = "green",
}: {
  label: string
  value: string
  progress: number
  tone?: "green" | "amber"
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${
            tone === "amber" ? "bg-amber-500" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function ActionItem({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <article className="rounded-md border bg-background p-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-lg font-semibold tracking-normal">{value}</p>
      <p className="mt-2 text-sm leading-snug text-muted-foreground">
        {description}
      </p>
    </article>
  )
}
