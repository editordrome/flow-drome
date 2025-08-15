
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface KitProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  badges?: string[];
  stats: {
    services: number;
    rating: number;
    years: number;
  };
  headerColor?: "blue" | "green";
  avatarColor?: "green" | "yellow";
}

interface KitProfileHorizontalProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  description: string;
  stats: {
    projects: number;
    teams: number;
    years: number;
  };
  isPremium?: boolean;
}

const KitProfileCard = React.forwardRef<HTMLDivElement, KitProfileCardProps>(
  ({ 
    className, 
    name, 
    specialty, 
    avatar, 
    rating, 
    badges = [], 
    stats, 
    headerColor = "blue",
    avatarColor = "green",
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn("kit-profile-card", className)}
      {...props}
    >
      <div className={cn(
        headerColor === "blue" ? "kit-profile-header-blue" : "kit-profile-header-green"
      )}>
        <div className={cn(
          "kit-profile-avatar",
          avatarColor === "green" ? "kit-profile-avatar-green" : "kit-profile-avatar-yellow"
        )}>
          {avatar}
        </div>
      </div>
      
      <div className="kit-profile-content">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{specialty}</p>
        
        <div className="flex items-center justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
        
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {badges.map((badge, index) => (
              <span key={index} className="kit-category-residencial">
                {badge}
              </span>
            ))}
          </div>
        )}
        
        <div className="kit-profile-stats">
          <div className="kit-profile-stat">
            <div className="kit-profile-stat-number">{stats.services}</div>
            <div className="kit-profile-stat-label">Serviços</div>
          </div>
          <div className="kit-profile-stat">
            <div className="kit-profile-stat-number">{stats.rating}</div>
            <div className="kit-profile-stat-label">Avaliação</div>
          </div>
          <div className="kit-profile-stat">
            <div className="kit-profile-stat-number">{stats.years}</div>
            <div className="kit-profile-stat-label">Anos</div>
          </div>
        </div>
        
        <Button 
          className={cn(
            "w-full",
            headerColor === "blue" ? "kit-btn-secondary" : "kit-btn-primary"
          )}
        >
          Ver Perfil
        </Button>
      </div>
    </div>
  )
);
KitProfileCard.displayName = "KitProfileCard";

const KitProfileHorizontal = React.forwardRef<HTMLDivElement, KitProfileHorizontalProps>(
  ({ 
    className, 
    name, 
    role, 
    avatar, 
    rating, 
    description, 
    stats, 
    isPremium = false,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn("kit-profile-horizontal", className)}
      {...props}
    >
      <div className="kit-profile-horizontal-avatar">
        {avatar}
      </div>
      
      <div className="kit-profile-horizontal-content">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-xl text-gray-900">{name}</h3>
            <p className="text-gray-600 mb-2">{role}</p>
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
              <span className="text-sm text-gray-600 ml-2">{rating} (87 avaliações)</span>
            </div>
          </div>
          {isPremium && (
            <span className="kit-status-confirmado">Premium</span>
          )}
        </div>
        
        <p className="text-gray-700 mb-4">{description}</p>
        
        <div className="kit-profile-horizontal-stats">
          <div className="kit-profile-stat">
            <div className="kit-profile-stat-number text-kit-secondary">{stats.projects}</div>
            <div className="kit-profile-stat-label">Projetos</div>
          </div>
          <div className="kit-profile-stat">
            <div className="kit-profile-stat-number text-kit-secondary">{stats.teams}</div>
            <div className="kit-profile-stat-label">Equipes</div>
          </div>
          <div className="kit-profile-stat">
            <div className="kit-profile-stat-number text-kit-secondary">{stats.years}</div>
            <div className="kit-profile-stat-label">Anos</div>
          </div>
        </div>
        
        <Button className="kit-btn-primary">
          Contratar
        </Button>
      </div>
    </div>
  )
);
KitProfileHorizontal.displayName = "KitProfileHorizontal";

export { KitProfileCard, KitProfileHorizontal };
