
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Rocket, Monitor, Settings, TrendingUp, BookOpen, Play, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BaseConhecimentoModule = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Base de Conhecimento</h1>
        <p className="text-gray-600 mt-1">Encontre respostas e aprenda sobre o sistema</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Buscar na base de conhecimento..." className="pl-10" />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Rocket className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Primeiros Passos</h3>
                <p className="text-sm text-gray-500">Guias essenciais para começar</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">12 artigos disponíveis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Monitor className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Como usar o Sistema</h3>
                <p className="text-sm text-gray-500">Tutoriais do sistema DromeFlow</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">8 artigos disponíveis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Processos Operacionais</h3>
                <p className="text-sm text-gray-500">Procedimentos e melhores práticas</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">15 artigos disponíveis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Marketing e Vendas</h3>
                <p className="text-sm text-gray-500">Estratégias para crescer sua franquia</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">6 artigos disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="artigos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="artigos" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Artigos
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Vídeos
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artigos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artigos e Tutoriais</CardTitle>
              <p className="text-gray-600">Guias passo a passo para dominar sua franquia</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Como fazer seu primeiro agendamento</h3>
                      <p className="text-sm text-gray-600 mb-2">Primeiros Passos • 5 min de leitura</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">Popular</Badge>
                      <Badge variant="outline">tutorial</Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Configuração inicial do sistema</h3>
                      <p className="text-sm text-gray-600 mb-2">Sistema • 10 min de leitura</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">Popular</Badge>
                      <Badge variant="outline">tutorial</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vídeos Tutoriais</CardTitle>
              <p className="text-gray-600">Aprenda visualmente com nossos vídeos explicativos</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-video bg-blue-100 flex items-center justify-center">
                      <Play className="h-12 w-12 text-blue-600" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm">Introdução ao DromeFlow - Visão Geral</h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos e Manuais</CardTitle>
              <p className="text-gray-600">Documentos importantes para download</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Manual do Franqueado DromeFlow</h3>
                        <p className="text-sm text-gray-600">Primeiros Passos • PDF • 15.2 MB</p>
                        <p className="text-sm text-gray-400">450 downloads</p>
                      </div>
                    </div>
                    <Badge variant="outline">PDF</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Procedimentos Operacionais Padrão</h3>
                        <p className="text-sm text-gray-600">Operacional • PDF • 8.7 MB</p>
                        <p className="text-sm text-gray-400">320 downloads</p>
                      </div>
                    </div>
                    <Badge variant="outline">PDF</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BaseConhecimentoModule;
