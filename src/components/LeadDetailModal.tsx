
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Mail, Phone, Calendar, Send, FileText, CheckCircle } from "lucide-react";

interface LeadDetailModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetailModal = ({ lead, isOpen, onClose }: LeadDetailModalProps) => {
  if (!lead) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {lead.name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Criado em {formatDate(lead.createdAt)} • Atualizado em {formatDate(lead.updatedAt)}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Valor e Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Valor</h3>
              <div className="text-2xl font-bold text-green-600">
                {lead.value}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {lead.serviceType}
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {lead.size}
                </Badge>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-600">{lead.description}</p>
          </div>

          {/* Contato e Ações Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{lead.responsible}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Proposta
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Enviar Contrato
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Liberar Trial
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Reunião
                </Button>
              </div>
            </div>
          </div>

          {/* Botão Fechar */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
