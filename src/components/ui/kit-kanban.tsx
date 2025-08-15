
import * as React from "react";
import { cn } from "@/lib/utils";
import { KitStatusBadge, KitCategoryBadge } from "@/components/ui/kit-status-badge";

interface KitKanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  count: number;
  countVariant: "pendente" | "andamento" | "concluido";
  children: React.ReactNode;
}

interface KitKanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  category?: string;
  date?: string;
  time?: string;
  progress?: string;
  rating?: number;
  status?: "concluido" | "em-andamento" | "pendente";
  professional?: string;
  onDetailsClick?: () => void;
}

const KitKanbanColumn = React.forwardRef<HTMLDivElement, KitKanbanColumnProps>(
  ({ className, title, count, countVariant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("kit-kanban-column", className)}
      {...props}
    >
      <div className="kit-kanban-header">
        <h3 className="kit-kanban-title">{title}</h3>
        <div className={cn(
          "kit-kanban-count",
          countVariant === "pendente" && "kit-kanban-count-pendente",
          countVariant === "andamento" && "kit-kanban-count-andamento",
          countVariant === "concluido" && "kit-kanban-count-concluido"
        )}>
          {count}
        </div>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
);
KitKanbanColumn.displayName = "KitKanbanColumn";

const KitKanbanCard = React.forwardRef<HTMLDivElement, KitKanbanCardProps>(
  ({ 
    className, 
    title, 
    description, 
    category, 
    date, 
    time, 
    progress, 
    rating,
    status,
    professional,
    onDetailsClick,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn("kit-kanban-card", className)}
      {...props}
    >
      {category && (
        <div className="mb-2">
          <KitCategoryBadge 
            variant={category as any}
          >
            {category}
          </KitCategoryBadge>
        </div>
      )}
      
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        {date && <span>{date}</span>}
        {time && <span>{time}</span>}
      </div>
      
      {progress && (
        <div className="mb-3">
          <span className="kit-progress-indicator">{progress}</span>
        </div>
      )}
      
      {professional && (
        <div className="text-xs text-gray-600 mb-3">
          <span>{professional}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        {status && (
          <KitStatusBadge variant={status}>
            {status === "concluido" && "Concluído"}
            {status === "em-andamento" && "Em andamento"}
            {status === "pendente" && "Pendente"}
          </KitStatusBadge>
        )}
        
        {rating && (
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm mr-1">★</span>
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        )}
        
        {onDetailsClick && (
          <button 
            onClick={onDetailsClick}
            className="text-kit-secondary text-sm font-medium hover:underline"
          >
            Detalhes
          </button>
        )}
      </div>
    </div>
  )
);
KitKanbanCard.displayName = "KitKanbanCard";

export { KitKanbanColumn, KitKanbanCard };
