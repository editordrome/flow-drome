
import React, { useState } from 'react';
import { SidebarFooter } from "@/components/ui/sidebar";
import { 
  Building2, 
  ChevronUp,
  ChevronDown, 
  Shield
} from "lucide-react";
import { useActiveUnit } from "@/hooks/useActiveUnit";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebarFooter() {
  const { activeUnit, userUnits, loading, switchUnit } = useActiveUnit();
  const { user } = useAuth();
  const [showUnitSelector, setShowUnitSelector] = useState(false);

  if (loading) {
    return (
      <SidebarFooter className="border-t border-slate-600/60 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-3/4"></div>
        </div>
      </SidebarFooter>
    );
  }

  return (
    <SidebarFooter className="border-t border-slate-600/60 p-4 space-y-3">
      {/* Unidade Ativa */}
      <div className="space-y-2">
        <div 
          className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
          onClick={() => userUnits.length > 1 && setShowUnitSelector(!showUnitSelector)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Building2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate">
                {activeUnit?.name || 'Nenhuma unidade'}
              </div>
              {activeUnit?.cnpj && (
                <div className="text-xs text-slate-400 truncate">
                  {activeUnit.cnpj}
                </div>
              )}
              {user?.is_super_admin && (
                <div className="text-xs text-blue-400 truncate">
                  Super Administrador
                </div>
              )}
            </div>
          </div>
          {userUnits.length > 1 && (
            <div className="flex-shrink-0">
              {showUnitSelector ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              )}
            </div>
          )}
        </div>

        {/* Selector de Unidades */}
        {showUnitSelector && userUnits.length > 1 && (
          <div className="bg-slate-800/80 rounded-lg border border-slate-600/50 max-h-48 overflow-y-auto">
            {userUnits.map((unit) => (
              <div
                key={unit.id}
                className={`flex items-center gap-3 p-3 hover:bg-slate-700/50 cursor-pointer transition-colors ${
                  unit.id === activeUnit?.id ? 'bg-blue-900/30 border-l-2 border-blue-400' : ''
                }`}
                onClick={() => {
                  switchUnit(unit.id);
                  setShowUnitSelector(false);
                }}
              >
                <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-200 truncate">
                    {unit.name}
                  </div>
                  {unit.cnpj && (
                    <div className="text-xs text-slate-400 truncate">
                      {unit.cnpj}
                    </div>
                  )}
                  {unit.name === 'MB Drome' && user?.is_super_admin && (
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-blue-400">Unidade Chave</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Versão */}
      <div className="text-center pt-3">
        <div className="text-xs text-slate-400 font-medium">
          MariaFlow v2.0.0
        </div>
      </div>
    </SidebarFooter>
  );
}
