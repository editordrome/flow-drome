
import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusType = 
  | "confirmado" 
  | "pendente" 
  | "em-andamento" 
  | "cancelado" 
  | "disponivel" 
  | "baixo-estoque" 
  | "indisponivel"
  | "concluido";

export type CategoryType = 
  | "residencial" 
  | "comercial" 
  | "pos-obra" 
  | "vidros" 
  | "carpetes" 
  | "estofados" 
  | "tapetes";

interface KitStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: StatusType;
  children: React.ReactNode;
}

interface KitCategoryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: CategoryType;
  children: React.ReactNode;
}

const statusStyles: Record<StatusType, string> = {
  "confirmado": "kit-status-confirmado",
  "pendente": "kit-status-pendente",
  "em-andamento": "kit-status-em-andamento",
  "cancelado": "kit-status-cancelado",
  "disponivel": "kit-status-disponivel",
  "baixo-estoque": "kit-status-baixo-estoque",
  "indisponivel": "kit-status-indisponivel",
  "concluido": "kit-status-confirmado",
};

const categoryStyles: Record<CategoryType, string> = {
  "residencial": "kit-category-residencial",
  "comercial": "kit-category-comercial",
  "pos-obra": "kit-category-pos-obra",
  "vidros": "kit-category-vidros",
  "carpetes": "kit-category-carpetes",
  "estofados": "kit-category-estofados",
  "tapetes": "kit-category-tapetes",
};

const KitStatusBadge = React.forwardRef<HTMLSpanElement, KitStatusBadgeProps>(
  ({ className, variant, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(statusStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
);
KitStatusBadge.displayName = "KitStatusBadge";

const KitCategoryBadge = React.forwardRef<HTMLSpanElement, KitCategoryBadgeProps>(
  ({ className, variant, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(categoryStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
);
KitCategoryBadge.displayName = "KitCategoryBadge";

export { KitStatusBadge, KitCategoryBadge };
