
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Edit3, Eye } from "lucide-react";
import PersonalizedImagePreview from "./PersonalizedImagePreview";
import { MaterialTemplate } from "../data/materialTemplates";

interface PersonalizationData {
  nomeUnidade: string;
  telefone: string;
  instagram: string;
  email: string;
}

interface MaterialPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: MaterialTemplate | null;
  personalizationData: PersonalizationData;
  currentStep: 'select' | 'edit' | 'preview';
  materialTemplates: MaterialTemplate[];
  onSelectTemplate: (templateId: string) => void;
  onUpdateData: (field: keyof PersonalizationData, value: string) => void;
  onGoToPreview: () => void;
  onGoBackToEdit: () => void;
  onDownload: () => void;
}

const MaterialPersonalizationModal = ({
  isOpen,
  onClose,
  selectedTemplate,
  personalizationData,
  currentStep,
  materialTemplates,
  onSelectTemplate,
  onUpdateData,
  onGoToPreview,
  onGoBackToEdit,
  onDownload,
}: MaterialPersonalizationModalProps) => {
  const renderSelectStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Escolha um material para personalizar</h3>
        <p className="text-gray-600">Selecione o material que deseja customizar com suas informações</p>
      </div>
      
      <div className="grid gap-4">
        {materialTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectTemplate(template.id)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={template.imageUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{template.name}</h4>
                  <p className="text-gray-600 text-xs mt-1">{template.description}</p>
                </div>
                <Edit3 className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEditStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => onSelectTemplate('')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">Personalizar Material</h3>
          <p className="text-gray-600 text-sm">Preencha as informações da sua unidade</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="order-2 lg:order-1">
          {selectedTemplate && (
            <div className="sticky top-4">
              <h4 className="font-semibold mb-4">Visualização</h4>
              <PersonalizedImagePreview 
                template={selectedTemplate}
                personalizationData={personalizationData}
                id="personalized-preview-edit"
              />
            </div>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4 order-1 lg:order-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Informações da Unidade
          </h4>
          
          <div>
            <Label htmlFor="nomeUnidade">Nome da unidade</Label>
            <Input
              id="nomeUnidade"
              value={personalizationData.nomeUnidade}
              onChange={(e) => onUpdateData('nomeUnidade', e.target.value)}
              placeholder="Ex: Unidade Franqueada - SP"
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
            <Input
              id="telefone"
              value={personalizationData.telefone}
              onChange={(e) => onUpdateData('telefone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram da unidade</Label>
            <Input
              id="instagram"
              value={personalizationData.instagram}
              onChange={(e) => onUpdateData('instagram', e.target.value)}
              placeholder="@sua.unidade"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail da unidade</Label>
            <Input
              id="email"
              value={personalizationData.email}
              onChange={(e) => onUpdateData('email', e.target.value)}
              placeholder="sua.unidade@email.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onGoToPreview} className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Visualizar Final
        </Button>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onGoBackToEdit}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">Preview Final</h3>
          <p className="text-gray-600 text-sm">Material pronto para download</p>
        </div>
      </div>

      <div className="text-center">
        {selectedTemplate && (
          <PersonalizedImagePreview 
            template={selectedTemplate}
            personalizationData={personalizationData}
            id="personalized-preview-download"
          />
        )}
        
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="outline" onClick={onGoBackToEdit}>
            Editar
          </Button>
          <Button onClick={onDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Baixar Material
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'select' && 'Solicitar Material Personalizado'}
            {currentStep === 'edit' && 'Personalizar Material'}
            {currentStep === 'preview' && 'Visualizar Material'}
          </DialogTitle>
        </DialogHeader>
        
        {currentStep === 'select' && renderSelectStep()}
        {currentStep === 'edit' && renderEditStep()}
        {currentStep === 'preview' && renderPreviewStep()}
      </DialogContent>
    </Dialog>
  );
};

export default MaterialPersonalizationModal;
