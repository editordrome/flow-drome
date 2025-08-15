
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Edit } from "lucide-react";
import { MaterialTemplate, FieldConfig } from "../data/materialTemplates";

interface MaterialEditorProps {
  template: MaterialTemplate | null;
  onSaveTemplate: (template: MaterialTemplate) => void;
  onCancel: () => void;
}

const MaterialEditor = ({ template, onSaveTemplate, onCancel }: MaterialEditorProps) => {
  const [editingTemplate, setEditingTemplate] = useState<MaterialTemplate | null>(template);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const updateFieldPosition = (fieldKey: string, position: { top?: string; left?: string }) => {
    if (!editingTemplate) return;
    
    setEditingTemplate({
      ...editingTemplate,
      fields: {
        ...editingTemplate.fields,
        [fieldKey]: {
          ...editingTemplate.fields[fieldKey as keyof typeof editingTemplate.fields],
          position: {
            ...editingTemplate.fields[fieldKey as keyof typeof editingTemplate.fields].position,
            ...position
          }
        }
      }
    });
  };

  const updateFieldStyle = (fieldKey: string, style: Partial<FieldConfig['style']>) => {
    if (!editingTemplate) return;
    
    setEditingTemplate({
      ...editingTemplate,
      fields: {
        ...editingTemplate.fields,
        [fieldKey]: {
          ...editingTemplate.fields[fieldKey as keyof typeof editingTemplate.fields],
          style: {
            ...editingTemplate.fields[fieldKey as keyof typeof editingTemplate.fields].style,
            ...style
          }
        }
      }
    });
  };

  const handleSave = () => {
    if (editingTemplate) {
      onSaveTemplate(editingTemplate);
    }
  };

  const fieldLabels: Record<string, string> = {
    nomeUnidade: "Nome da Unidade",
    telefone: "Telefone",
    instagram: "Instagram", 
    email: "E-mail"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Editor de Material</h3>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview da Imagem */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview do Material</CardTitle>
            </CardHeader>
            <CardContent>
              {editingTemplate && editingTemplate.imageUrl && (
                <div className="relative">
                  <img 
                    src={editingTemplate.imageUrl} 
                    alt="Preview" 
                    className="w-full rounded-lg"
                  />
                  {Object.entries(editingTemplate.fields).map(([fieldKey, fieldConfig]) => (
                    <div
                      key={fieldKey}
                      className={`absolute border-2 border-dashed cursor-pointer hover:bg-blue-100/50 ${
                        selectedField === fieldKey ? 'border-blue-500 bg-blue-100/30' : 'border-gray-400'
                      }`}
                      style={{
                        top: fieldConfig.position.top,
                        left: fieldConfig.position.left,
                        minWidth: '60px',
                        minHeight: '20px'
                      }}
                      onClick={() => setSelectedField(fieldKey)}
                    >
                      <span className="text-xs bg-white px-1 rounded">
                        {fieldLabels[fieldKey]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {(!editingTemplate || !editingTemplate.imageUrl) && (
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-500">Nenhuma imagem disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configurações de Campo */}
        <div className="space-y-4">
          {selectedField && editingTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Editando: {fieldLabels[selectedField]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Posição Top (%)</Label>
                    <Input
                      value={editingTemplate.fields[selectedField as keyof typeof editingTemplate.fields].position.top?.replace('%', '') || ''}
                      onChange={(e) => updateFieldPosition(selectedField, { top: `${e.target.value}%` })}
                      placeholder="Ex: 76"
                    />
                  </div>
                  <div>
                    <Label>Posição Left (%)</Label>
                    <Input
                      value={editingTemplate.fields[selectedField as keyof typeof editingTemplate.fields].position.left?.replace('%', '') || ''}
                      onChange={(e) => updateFieldPosition(selectedField, { left: `${e.target.value}%` })}
                      placeholder="Ex: 7"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tamanho da Fonte</Label>
                    <Input
                      value={editingTemplate.fields[selectedField as keyof typeof editingTemplate.fields].style.fontSize.replace('px', '')}
                      onChange={(e) => updateFieldStyle(selectedField, { fontSize: `${e.target.value}px` })}
                      placeholder="Ex: 18"
                    />
                  </div>
                  <div>
                    <Label>Cor</Label>
                    <Input
                      type="color"
                      value={editingTemplate.fields[selectedField as keyof typeof editingTemplate.fields].style.color}
                      onChange={(e) => updateFieldStyle(selectedField, { color: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Família da Fonte</Label>
                  <Input
                    value={editingTemplate.fields[selectedField as keyof typeof editingTemplate.fields].style.fontFamily}
                    onChange={(e) => updateFieldStyle(selectedField, { fontFamily: e.target.value })}
                    placeholder="Ex: Arial, sans-serif"
                  />
                </div>

                <div>
                  <Label>Peso da Fonte</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={editingTemplate.fields[selectedField as keyof typeof editingTemplate.fields].style.fontWeight}
                    onChange={(e) => updateFieldStyle(selectedField, { fontWeight: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="600">Semi-Bold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra-Bold</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {!selectedField && (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <Edit className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Clique em um campo na imagem para editá-lo</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialEditor;
