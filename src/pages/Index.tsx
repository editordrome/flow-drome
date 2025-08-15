
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ModernHeader } from "@/components/ModernHeader";
import { ModernDashboard } from "@/components/ModernDashboard";
import ClientsModule from "@/components/ClientsModule";
import ProfessionalsModule from "@/components/ProfessionalsModule";
import ProfessionalsListModule from "@/components/ProfessionalsListModule";
import AgendaModule from "@/components/AgendaModule";
import RecrutadoraModule from "@/components/RecrutadoraModule";
import FinancialModule from "@/components/FinancialModule";
import PipelineKanban from "@/components/PipelineKanban";
import CashbackModule from "@/components/CashbackModule";
import AgendamentosModule from "@/components/AgendamentosModule";
import DashboardFinanceiroModule from "@/components/financial/DashboardFinanceiroModule";
import RelatoriosModule from "@/components/financial/RelatoriosModule";
import ContasPagarModule from "@/components/financial/ContasPagarModule";
import ContasReceberModule from "@/components/financial/ContasReceberModule";
import FluxoCaixaModule from "@/components/financial/FluxoCaixaModule";
import MateriaisMarketingModule from "@/components/MateriaisMarketingModule";
import PublicacoesModule from "@/components/PublicacoesModule";
import UniformesModule from "@/components/UniformesModule";
import MateriaisModule from "@/components/MateriaisModule";
import TicketsModule from "@/components/TicketsModule";
import BaseConhecimentoModule from "@/components/BaseConhecimentoModule";
import MariaUniModule from "@/components/MariaUniModule";
import GestaoUnidadesModule from "@/components/GestaoUnidadesModule";
import ConfiguracaoModulosModule from "@/components/ConfiguracaoModulosModule";

const Index = () => {
  const [activeModule, setActiveModule] = useState("gestao");

  const getModuleTitle = () => {
    switch (activeModule) {
      case "gestao-unidades":
        return "Gestão de Unidades";
      case "configuracao-modulos":
        return "Configuração de Módulos";
      case "gestao":
        return "Dashboard de Gestão";
      case "agendamentos":
        return "Agendamentos";
      case "pipeline":
        return "Leads";
      case "cashback":
        return "Programa Cashback";
      case "materiais-marketing":
        return "Materiais de Marketing";
      case "publicacoes":
        return "Publicações";
      case "uniformes":
        return "Uniformes";
      case "materiais":
        return "Materiais";
      case "tickets":
        return "Central de Tickets";
      case "base-conhecimento":
        return "Base de Conhecimento";
      case "maria-uni":
        return "Maria Uni - Plataforma de Ensino";
      case "clientes":
        return "Gestão de Clientes";
      case "profissionais":
        return "Profissionais";
      case "profissionais-lista":
        return "Lista de Profissionais";
      case "profissionais-status":
        return "Status dos Profissionais";
      case "agenda":
        return "Agenda";
      case "recrutadora":
        return "Recrutadora";
      case "financeiro":
        return "Financeiro";
      case "dashboard-financeiro":
        return "Dashboard Financeiro";
      case "relatorios":
        return "Relatórios";
      case "contas-pagar":
        return "Contas a Pagar";
      case "contas-receber":
        return "Contas a Receber";
      case "fluxo-caixa":
        return "Fluxo de Caixa";
      default:
        return "Dashboard";
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case "gestao-unidades":
        return <GestaoUnidadesModule />;
      case "configuracao-modulos":
        return <ConfiguracaoModulosModule />;
      case "gestao":
        return <ModernDashboard />;
      case "agendamentos":
        return <AgendamentosModule />;
      case "pipeline":
        return <PipelineKanban />;
      case "cashback":
        return <CashbackModule />;
      case "materiais-marketing":
        return <MateriaisMarketingModule />;
      case "publicacoes":
        return <PublicacoesModule />;
      case "uniformes":
        return <UniformesModule />;
      case "materiais":
        return <MateriaisModule />;
      case "tickets":
        return <TicketsModule />;
      case "base-conhecimento":
        return <BaseConhecimentoModule />;
      case "maria-uni":
        return <MariaUniModule />;
      case "clientes":
        return <ClientsModule />;
      case "profissionais":
        return <ProfessionalsModule />;
      case "profissionais-lista":
        return <ProfessionalsListModule />;
      case "profissionais-status":
        return <ProfessionalsModule />;
      case "agenda":
        return <AgendaModule />;
      case "recrutadora":
        return <RecrutadoraModule />;
      case "financeiro":
        return <FinancialModule />;
      case "dashboard-financeiro":
        return <DashboardFinanceiroModule />;
      case "relatorios":
        return <RelatoriosModule />;
      case "contas-pagar":
        return <ContasPagarModule />;
      case "contas-receber":
        return <ContasReceberModule />;
      case "fluxo-caixa":
        return <FluxoCaixaModule />;
      default:
        return <ModernDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        <SidebarInset className="flex-1">
          <ModernHeader 
            title={getModuleTitle()} 
            activeModule={activeModule}
            setActiveModule={setActiveModule}
          />
          <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
            {renderModule()}
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default Index;
