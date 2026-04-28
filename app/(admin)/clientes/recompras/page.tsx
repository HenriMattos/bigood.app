import { Calendar03Icon, UserStar01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { repurchaseClients } from "@/components/admin/clientes-data"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

export default function ClienteRecomprasPage() {
  return (
    <SectionCard
      title="Cliente recompras"
      description="Clientes com indicacao de recompra ou novo servico baseado no historico"
      action={<Button size="sm">Enviar lembretes</Button>}
    >
      <div className="grid gap-3">
        {repurchaseClients.map((item) => (
          <article
            key={`${item.client}-${item.recommended}`}
            className="rounded-md border bg-background p-3"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <HugeiconsIcon
                    icon={UserStar01Icon}
                    size={18}
                    className="text-primary"
                  />
                  <h3 className="font-semibold">{item.client}</h3>
                  <StatusBadge tone="amber">Recompra sugerida</StatusBadge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.phone}
                </p>
              </div>

              <div className="rounded-md border bg-muted/30 px-3 py-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Data indicada
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                  <HugeiconsIcon icon={Calendar03Icon} size={16} />
                  {item.dueDate}
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Info label="Ultima compra" value={item.lastPurchase} />
              <Info label="Data da compra" value={item.lastDate} />
              <Info label="Indicacao" value={item.recommended} strong />
            </div>

            <div className="mt-3 rounded-md bg-primary/10 p-3 text-sm">
              <span className="font-medium">Motivo: </span>
              {item.reason}
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}

function Info({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="rounded-md border bg-card px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={strong ? "mt-1 font-semibold" : "mt-1 text-sm"}>{value}</p>
    </div>
  )
}
