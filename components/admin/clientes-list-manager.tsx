"use client"

import { useState } from "react"
import {
  Delete02Icon,
  UserSearch01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  type Client,
  type ClientStatus,
  clients,
  getClientStatusLabel,
  getClientStatusTone,
} from "@/components/admin/clientes-data"
import { serviceNames } from "@/components/admin/catalog-data"
import { FormField, FormGrid } from "@/components/admin/responsive-form"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ClientesListManager() {
  const [items, setItems] = useState<Client[]>(clients)
  const [selected, setSelected] = useState<Client | null>(null)
  const [draft, setDraft] = useState<Client | null>(null)

  function openEditor(client: Client) {
    setSelected(client)
    setDraft({ ...client })
  }

  function closeEditor() {
    setSelected(null)
    setDraft(null)
  }

  function saveClient() {
    if (!draft) return
    setItems((current) =>
      current.map((client) => (client.id === draft.id ? draft : client))
    )
    closeEditor()
  }

  function removeClient() {
    if (!selected) return
    setItems((current) => current.filter((client) => client.id !== selected.id))
    closeEditor()
  }

  function updateDraft<Key extends keyof Client>(key: Key, value: Client[Key]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  return (
    <>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <EmptyState
            icon={UserAdd01Icon}
            title="Nenhum cliente"
            description="Sua base de clientes está vazia. Comece cadastrando seus clientes para acompanhar o histórico."
            actionLabel="Cadastrar agora"
            href="/clientes/cadastrar"
          />
        ) : (
          items.map((client) => (
            <article
              key={client.id}
              className="grid gap-3 rounded-md border bg-background p-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold">{client.name}</h3>
                  <StatusBadge tone={getClientStatusTone(client.status)}>
                    {getClientStatusLabel(client.status)}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {client.phone} - {client.email}
                </p>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <Info label="Historico" value={`${client.visits} visitas`} />
                  <Info
                    label="Ticket medio"
                    value={`R$ ${client.averageTicket}`}
                  />
                  <Info label="Ultima visita" value={client.lastVisit} />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditor(client)}
              >
                <HugeiconsIcon icon={UserSearch01Icon} size={16} />
                Editar
              </Button>
            </article>
          ))
        )}
      </div>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && closeEditor()}
      >
        <DialogContent className="flex max-h-[calc(100dvh-1rem)] max-w-2xl flex-col">
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault()
              saveClient()
            }}
          >
            <DialogHeader>
              <DialogTitle>Editar cliente</DialogTitle>
              <DialogDescription>
                Ajuste os dados principais ou remova o cliente da listagem.
              </DialogDescription>
            </DialogHeader>

            {draft ? (
              <ScrollArea className="min-h-0 flex-1">
                <FormGrid className="p-4">
                  <FormField label="Nome completo">
                    <Input
                      id="edit-name"
                      value={draft.name}
                      onChange={(event) =>
                        updateDraft("name", event.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="Telefone">
                    <Input
                      id="edit-phone"
                      value={draft.phone}
                      inputMode="tel"
                      onChange={(event) =>
                        updateDraft("phone", event.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="E-mail">
                    <Input
                      id="edit-email"
                      value={draft.email}
                      type="email"
                      onChange={(event) =>
                        updateDraft("email", event.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="Status">
                    <Select
                      value={draft.status}
                      onValueChange={(value) =>
                        updateDraft("status", value as ClientStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="novo">Novo</SelectItem>
                        <SelectItem value="recorrente">Recorrente</SelectItem>
                        <SelectItem value="sem-plano">Sem plano</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField
                    label="Servico preferido"
                    className="sm:col-span-2"
                  >
                    <Select
                      value={draft.favoriteService}
                      onValueChange={(value) =>
                        updateDraft("favoriteService", value)
                      }
                    >
                      <SelectTrigger id="edit-service">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceNames.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </FormGrid>
              </ScrollArea>
            ) : null}

            <DialogFooter className="shrink-0 gap-2 sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={removeClient}
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
                Remover cliente
              </Button>
              <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={closeEditor}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Salvar alteracoes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}
