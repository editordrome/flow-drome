
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, MessageCircle, Calendar } from "lucide-react";

const PublicacoesModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Publicações Mensais</h1>
          <p className="text-gray-600">Conteúdo de junho de 2025 fornecido pela franqueadora</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">junho de 2025</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Instagram className="h-5 w-5 text-pink-600" />
              Instagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-600 mb-1">2</div>
            <p className="text-sm text-gray-600">Posts e stories disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
            <p className="text-sm text-gray-600">Posts disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-green-600" />
              WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">1</div>
            <p className="text-sm text-gray-600">Status disponíveis</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="instagram" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instagram" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Instagram className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dica de Limpeza - Vidros Sem Manchas</h3>
                    <p className="text-sm text-gray-600">14/01/2025</p>
                  </div>
                </div>
                <Badge variant="secondary">Post</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <div className="text-center py-12">
            <Facebook className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Posts em Desenvolvimento</h3>
            <p className="text-gray-600">O conteúdo para Facebook estará disponível em breve.</p>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Status em Desenvolvimento</h3>
            <p className="text-gray-600">O conteúdo para WhatsApp estará disponível em breve.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicacoesModule;
