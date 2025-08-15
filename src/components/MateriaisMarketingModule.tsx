import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Video, FileText, Edit } from "lucide-react";
import { useMaterialPersonalization } from "@/hooks/useMaterialPersonalization";
import MaterialPersonalizationContent from "./MaterialPersonalizationContent";

const MateriaisMarketingModule = () => {
  const {
    selectedTemplate,
    personalizationData,
    currentStep,
    materialTemplates,
    selectTemplate,
    backToSelect,
    updatePersonalizationData,
    goToPreview,
    goBackToEdit,
    goToEditor,
    saveCustomTemplate,
    downloadMaterial,
  } = useMaterialPersonalization();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="imagens" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="imagens" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Imagens
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vídeos
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="personalizar" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Personalizar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="imagens" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Logo</CardTitle>
                    <p className="text-sm text-gray-500">PNG</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center">
                  <Image className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-1">Logo DromeFlow - Versão Principal</h3>
                <p className="text-sm text-gray-600">Logo oficial para uso em materiais digitais</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Banners</CardTitle>
                    <p className="text-sm text-gray-500">JPG</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center">
                  <Image className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-1">Banner Promocional - Limpeza Residencial</h3>
                <p className="text-sm text-gray-600">Banner para campanhas promocionais</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vídeos em Desenvolvimento</h3>
            <p className="text-gray-600">Os materiais de vídeo estarão disponíveis em breve.</p>
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentos em Desenvolvimento</h3>
            <p className="text-gray-600">Os materiais documentais estarão disponíveis em breve.</p>
          </div>
        </TabsContent>

        <TabsContent value="personalizar" className="space-y-4">
          <MaterialPersonalizationContent
            selectedTemplate={selectedTemplate}
            personalizationData={personalizationData}
            currentStep={currentStep}
            materialTemplates={materialTemplates}
            onSelectTemplate={selectTemplate}
            onBackToSelect={backToSelect}
            onUpdateData={updatePersonalizationData}
            onGoToPreview={goToPreview}
            onGoBackToEdit={goBackToEdit}
            onGoToEditor={goToEditor}
            onSaveCustomTemplate={saveCustomTemplate}
            onDownload={downloadMaterial}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MateriaisMarketingModule;
