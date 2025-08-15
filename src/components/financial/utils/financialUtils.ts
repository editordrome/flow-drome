
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return CheckCircle;
    case "overdue":
      return AlertCircle;
    case "scheduled":
      return Clock;
    default:
      return Clock;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-modern/20 text-green-modern";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "scheduled":
      return "bg-blue-modern/20 text-blue-modern";
    default:
      return "bg-yellow-modern/20 text-yellow-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "paid":
      return "Pago";
    case "overdue":
      return "Vencido";
    case "scheduled":
      return "Agendado";
    default:
      return "Pendente";
  }
};
