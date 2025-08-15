
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export const NewLeadDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-modern hover:bg-blue-modern/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nova Lista
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome/Empresa</Label>
            <Input id="name" placeholder="Digite o nome ou empresa" />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" placeholder="Descrição do lead..." />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@exemplo.com" />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" placeholder="(11) 99999-9999" />
          </div>
          <div>
            <Label htmlFor="service">Tipo de Serviço</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limpeza-residencial">Limpeza Residencial</SelectItem>
                <SelectItem value="limpeza-comercial">Limpeza Comercial</SelectItem>
                <SelectItem value="terceirizacao">Terceirização</SelectItem>
                <SelectItem value="pos-obra">Pós-Obra</SelectItem>
                <SelectItem value="limpeza-especial">Limpeza Especial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="value">Valor</Label>
            <Input id="value" placeholder="R$ 0,00" />
          </div>
          <Button className="w-full bg-blue-modern hover:bg-blue-modern/90 text-white">Adicionar Lead</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
