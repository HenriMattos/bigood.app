"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft01Icon, CashierIcon, Edit02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { type Comanda, comandas as initialComandas } from "@/components/admin/caixa-data"
import { ComandaCard } from "@/components/admin/comanda-card"
import { NovaComandaModal } from "@/components/admin/caixa-view"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"

export function ComandasView() {
  const [comandas, setComandas] = useState<Comanda[]>(initialComandas)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingComanda, setEditingComanda] = useState<Comanda | null>(null)

  function saveComanda(comanda: Comanda) {
    setComandas((current) =>
      current.some((item) => item.id === comanda.id)
        ? current.map((item) => (item.id === comanda.id ? comanda : item))
        : [...current, comanda]
    )
    setEditingComanda(null)
    setModalOpen(false)
  }

  function openCreateModal() {
    setEditingComanda(null)
    setModalOpen(true)
  }

  function openEditModal(comanda: Comanda) {
    setEditingComanda(comanda)
    setModalOpen(true)
  }

  return (
    <>
      <SectionCard
        title="Comandas detalhadas"
        description="Atendimentos, servicos, produtos, descontos e pagamentos do caixa atual"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="sm" variant="outline" asChild>
              <Link href="/caixa">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Voltar ao caixa
              </Link>
            </Button>
            <Button size="sm" onClick={openCreateModal}>
              <HugeiconsIcon icon={CashierIcon} size={16} />
              Nova comanda
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          {comandas.map((comanda) => (
            <ComandaCard
              key={comanda.id}
              comanda={comanda}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(comanda)}
                >
                  <HugeiconsIcon icon={Edit02Icon} size={16} />
                  Editar
                </Button>
              }
            />
          ))}
        </div>
      </SectionCard>

      <NovaComandaModal
        key={editingComanda?.id ?? "nova-comanda"}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingComanda(null)
        }}
        onSave={saveComanda}
        nextNumber={1024 + comandas.length}
        editingComanda={editingComanda}
      />
    </>
  )
}
