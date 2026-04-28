import { CashierIcon, CrownIcon, UserAdd01Icon } from "@hugeicons/core-free-icons"
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

export default function CadastrarClientePage() {
  return (
    <SectionCard
      title="Cadastrar cliente"
      description="Dados principais para criar um novo cliente na base"
      action={
        <Button size="sm">
          <HugeiconsIcon icon={UserAdd01Icon} size={16} />
          Salvar cliente
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Nome completo</Label>
          <Input placeholder="Ex.: Rafael Lima" />
        </div>
        <div className="grid gap-1.5">
          <Label>Telefone</Label>
          <Input placeholder="(11) 90000-0000" />
        </div>
        <div className="grid gap-1.5">
          <Label>E-mail</Label>
          <Input placeholder="cliente@email.com" />
        </div>
        <div className="grid gap-1.5">
          <Label>Status</Label>
          <Select defaultValue="ativo">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="recorrente">Recorrente</SelectItem>
              <SelectItem value="sem-retorno">Sem retorno</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5 md:col-span-2">
          <Label>Observacoes</Label>
          <Input placeholder="Preferencias, alergias, produtos favoritos..." />
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t pt-5 md:grid-cols-2">
        <div className="grid gap-1.5">
          <Label className="flex items-center gap-2">
            <HugeiconsIcon icon={CashierIcon} size={16} />
            Forma de cobranca
          </Label>
          <Select defaultValue="pix">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">Pix</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="credito">Cartao de credito</SelectItem>
              <SelectItem value="debito">Cartao de debito</SelectItem>
              <SelectItem value="online">Cobranca online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label>Cartao habilitado</Label>
          <Select defaultValue="sim">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim, cliente pode pagar no cartao</SelectItem>
              <SelectItem value="nao">Nao, cobrar sem cartao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5 md:col-span-2">
          <Label className="flex items-center gap-2">
            <HugeiconsIcon icon={CrownIcon} size={16} />
            Plano existente
          </Label>
          <Select defaultValue="sem-plano">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sem-plano">Sem plano</SelectItem>
              <SelectItem value="corte-mensal">Plano Corte Mensal</SelectItem>
              <SelectItem value="barba-corte">Plano Barba + Corte</SelectItem>
              <SelectItem value="premium">Plano Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SectionCard>
  )
}
