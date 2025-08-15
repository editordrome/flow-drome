import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Edit3, Eye, Settings } from "lucide-react";
import PersonalizedImagePreview from "./PersonalizedImagePreview";
import MaterialEditor from "./MaterialEditor";
import { MaterialTemplate } from "../data/materialTemplates";

interface PersonalizationData {
  nomeUnidade: string;
  telefone: string;
  instagram: string;
  email: string;
}

interface MaterialPersonalizationContentProps {
  selectedTemplate: MaterialTemplate | null;
  personalizationData: PersonalizationData;
  currentStep: 'select' | 'edit' | 'preview' | 'editor';
  materialTemplates: MaterialTemplate[];
  onSelectTemplate: (templateId: string) => void;
  onUpdateData: (field: keyof PersonalizationData, value: string) => void;
  onGoToPreview: () => void;
  onGoBackToEdit: () => void;
  onGoToEditor: () => void;
  onSaveCustomTemplate: (template: MaterialTemplate) => void;
  onDownload: () => void;
  onBackToSelect?: () => void;
}

const MaterialPersonalizationContent = ({
  selectedTemplate,
  personalizationData,
  currentStep,
  materialTemplates,
  onSelectTemplate,
  onUpdateData,
  onGoToPreview,
  onGoBackToEdit,
  onGoToEditor,
  onSaveCustomTemplate,
  onDownload,
  onBackToSelect
}: MaterialPersonalizationContentProps) => {
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length >= 2) {
      const ddd = numbers.slice(0, 2);
      const rest = numbers.slice(2);
      
      if (rest.length > 5) {
        const firstPart = rest.slice(0, 5);
        const secondPart = rest.slice(5);
        return `(${ddd}) ${firstPart}-${secondPart}`;
      }
      
      return `(${ddd}) ${rest}`;
    }
    return numbers;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    onUpdateData('telefone', formatted);
  };

  const handleInstagramChange = (value: string) => {
    const cleanValue = value.replace(/^@/, '');
    const formatted = `@${cleanValue}`;
    onUpdateData('instagram', formatted);
  };

  const handleBackToSelect = () => {
    if (onBackToSelect) {
      onBackToSelect();
    } else {
      // Fallback para limpar o template selecionado
      onSelectTemplate('');
    }
  };

  const renderSelectStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Escolha um material para personalizar</h3>
        <p className="text-gray-600">Selecione o material que deseja customizar com suas informações</p>
      </div>
      
      <div className="grid gap-4">
        {materialTemplates.map(template => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectTemplate(template.id)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover" />
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
        <Button variant="ghost" size="sm" onClick={handleBackToSelect}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Personalizar Material</h3>
          <p className="text-gray-600 text-sm">Preencha as informações da sua unidade</p>
        </div>
        {selectedTemplate && (
          <Button variant="outline" size="sm" onClick={onGoToEditor} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Editar Template
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              onChange={e => onUpdateData('nomeUnidade', e.target.value)} 
              placeholder="Ex: Unidade Franqueada - SP" 
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
            <Input 
              id="telefone" 
              value={personalizationData.telefone} 
              onChange={e => handlePhoneChange(e.target.value)} 
              placeholder="(11) 99999-9999" 
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram da unidade</Label>
            <Input 
              id="instagram" 
              value={personalizationData.instagram} 
              onChange={e => handleInstagramChange(e.target.value)} 
              placeholder="@sua.unidade" 
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail da unidade</Label>
            <Input 
              id="email" 
              value={personalizationData.email} 
              onChange={e => onUpdateData('email', e.target.value)} 
              placeholder="sua.unidade@email.com" 
            />
          </div>

          <div className="pt-4">
            <Button onClick={onGoToPreview} className="flex items-center gap-2 py-[10px]">
              <Eye className="h-4 w-4" />
              Visualizar Final
            </Button>
          </div>
        </div>
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

  const renderEditorStep = () => (
    <MaterialEditor
      template={selectedTemplate}
      onSaveTemplate={onSaveCustomTemplate}
      onCancel={handleBackToSelect}
    />
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {currentStep === 'select' && renderSelectStep()}
      {currentStep === 'edit' && renderEditStep()}
      {currentStep === 'preview' && renderPreviewStep()}
      {currentStep === 'editor' && renderEditorStep()}
    </div>
  );
};

export default MaterialPersonalizationContent;
