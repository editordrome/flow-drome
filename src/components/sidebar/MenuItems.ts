
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  UserCheck,
  DollarSign,
  Workflow,
  Gift,
  Calendar,
  UserPlus,
  CalendarDays,
  FileText,
  CreditCard,
  Receipt,
  TrendingDown,
  Megaphone,
  Image,
  Share2,
  ShoppingCart,
  ShirtIcon,
  Package,
  HeadphonesIcon,
  BookOpen,
  GraduationCap,
  Shield,
  Building2,
  Settings
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  submenu?: {
    id: string;
    label: string;
    icon: any;
  }[];
}

export const menuItems: MenuItem[] = [
  {
    id: "super-admin",
    label: "Super Admin",
    icon: Shield,
    submenu: [
      {
        id: "gestao-unidades",
        label: "Gestão de Unidades",
        icon: Building2,
      },
      {
        id: "configuracao-modulos",
        label: "Configuração de Módulos",
        icon: Settings,
      }
    ]
  },
  {
    id: "dashboard",
    label: "Visão Geral",
    icon: LayoutDashboard,
    submenu: [
      {
        id: "gestao",
        label: "Gestão",
        icon: LayoutDashboard,
      },
      {
        id: "agendamentos",
        label: "Atendimentos",
        icon: CalendarDays,
      }
    ]
  },
  {
    id: "comercial",
    label: "Comercial",
    icon: TrendingUp,
    submenu: [
      {
        id: "pipeline",
        label: "Leads",
        icon: Workflow,
      },
      {
        id: "cashback",
        label: "Cashback",
        icon: Gift,
      }
    ]
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: Users,
  },
  {
    id: "profissionais",
    label: "Profissionais",
    icon: UserCheck,
    submenu: [
      {
        id: "profissionais-lista",
        label: "Profissionais",
        icon: Users,
      },
      {
        id: "profissionais-status",
        label: "Status Atendimento",
        icon: UserCheck,
      },
      {
        id: "agenda",
        label: "Agenda",
        icon: Calendar,
      },
      {
        id: "recrutadora",
        label: "Recrutadora",
        icon: UserPlus,
      }
    ]
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: DollarSign,
    submenu: [
      {
        id: "dashboard-financeiro",
        label: "Dashboard Financeiro",
        icon: LayoutDashboard,
      },
      {
        id: "relatorios",
        label: "Relatórios",
        icon: FileText,
      },
      {
        id: "contas-pagar",
        label: "Contas a Pagar",
        icon: CreditCard,
      },
      {
        id: "contas-receber",
        label: "Contas a Receber",
        icon: Receipt,
      },
      {
        id: "fluxo-caixa",
        label: "Fluxo de Caixa",
        icon: TrendingDown,
      }
    ]
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    submenu: [
      {
        id: "materiais-marketing",
        label: "Materiais de Marketing",
        icon: Image,
      },
      {
        id: "publicacoes",
        label: "Publicações",
        icon: Share2,
      }
    ]
  },
  {
    id: "compras",
    label: "Compras",
    icon: ShoppingCart,
    submenu: [
      {
        id: "uniformes",
        label: "Uniformes",
        icon: ShirtIcon,
      },
      {
        id: "materiais",
        label: "Materiais",
        icon: Package,
      }
    ]
  },
  {
    id: "suporte",
    label: "Suporte",
    icon: HeadphonesIcon,
    submenu: [
      {
        id: "tickets",
        label: "Tickets",
        icon: HeadphonesIcon,
      },
      {
        id: "base-conhecimento",
        label: "Base de Conhecimento",
        icon: BookOpen,
      }
    ]
  },
  {
    id: "maria-uni",
    label: "Maria Uni",
    icon: GraduationCap,
  },
];

export function isParentActive(item: MenuItem, activeModule: string): boolean {
  if (activeModule === item.id) return true;
  if (item.submenu) return item.submenu.some((subItem) => subItem.id === activeModule);
  return false;
}
