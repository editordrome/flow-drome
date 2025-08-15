export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          module_name: string
          unit_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          module_name: string
          unit_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          module_name?: string
          unit_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          unit_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          unit_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          unit_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coluna_kanban: {
        Row: {
          company_key: string | null
          created_at: string | null
          id: string
          nome_coluna: string
          ordem: number | null
        }
        Insert: {
          company_key?: string | null
          created_at?: string | null
          id?: string
          nome_coluna: string
          ordem?: number | null
        }
        Update: {
          company_key?: string | null
          created_at?: string | null
          id?: string
          nome_coluna?: string
          ordem?: number | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          active: boolean | null
          address: Json | null
          billing_data: Json | null
          business_hours: Json | null
          compliance_status: string | null
          contact: Json | null
          created_at: string
          document: string | null
          franchise_type: string | null
          governance_settings: Json | null
          has_units: boolean | null
          id: string
          integration_settings: Json | null
          key: string
          last_audit_date: string | null
          logo_url: string | null
          max_units: number | null
          modules: Json | null
          name: string
          next_audit_date: string | null
          parent_company_id: string | null
          plan: string | null
          settings: Json | null
          status: string | null
          subscription_expires_at: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          address?: Json | null
          billing_data?: Json | null
          business_hours?: Json | null
          compliance_status?: string | null
          contact?: Json | null
          created_at?: string
          document?: string | null
          franchise_type?: string | null
          governance_settings?: Json | null
          has_units?: boolean | null
          id?: string
          integration_settings?: Json | null
          key: string
          last_audit_date?: string | null
          logo_url?: string | null
          max_units?: number | null
          modules?: Json | null
          name: string
          next_audit_date?: string | null
          parent_company_id?: string | null
          plan?: string | null
          settings?: Json | null
          status?: string | null
          subscription_expires_at?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          address?: Json | null
          billing_data?: Json | null
          business_hours?: Json | null
          compliance_status?: string | null
          contact?: Json | null
          created_at?: string
          document?: string | null
          franchise_type?: string | null
          governance_settings?: Json | null
          has_units?: boolean | null
          id?: string
          integration_settings?: Json | null
          key?: string
          last_audit_date?: string | null
          logo_url?: string | null
          max_units?: number | null
          modules?: Json | null
          name?: string
          next_audit_date?: string | null
          parent_company_id?: string | null
          plan?: string | null
          settings?: Json | null
          status?: string | null
          subscription_expires_at?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          permissions: Json | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_franquia: {
        Row: {
          chave: string
          franquia_id: string | null
          id: string
          tipo: string | null
          updated_at: string | null
          valor: Json | null
        }
        Insert: {
          chave: string
          franquia_id?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string | null
          valor?: Json | null
        }
        Update: {
          chave?: string
          franquia_id?: string | null
          id?: string
          tipo?: string | null
          updated_at?: string | null
          valor?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_franquia_franquia_id_fkey"
            columns: ["franquia_id"]
            isOneToOne: false
            referencedRelation: "franquias"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_roles: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          permissions: Json
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          permissions?: Json
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          permissions?: Json
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_roles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          document_type: string | null
          file_ids: string[] | null
          id: string
          status: string | null
          title: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type?: string | null
          file_ids?: string[] | null
          id?: string
          status?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type?: string | null
          file_ids?: string[] | null
          id?: string
          status?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_plans: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          limitations: Json | null
          max_units: number | null
          max_users: number | null
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limitations?: Json | null
          max_units?: number | null
          max_users?: number | null
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          limitations?: Json | null
          max_units?: number | null
          max_users?: number | null
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      franchise_subscriptions: {
        Row: {
          auto_renew: boolean | null
          company_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          payment_data: Json | null
          plan_id: string
          starts_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          company_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_data?: Json | null
          plan_id: string
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          company_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_data?: Json | null
          plan_id?: string
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchise_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "franchise_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      franquias: {
        Row: {
          cnpj: string
          configuracao_visual: Json | null
          created_at: string | null
          created_by: string | null
          data_cadastro: string | null
          email: string
          endereco: Json | null
          id: string
          modulos_liberados: string[] | null
          nome: string
          plano: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj: string
          configuracao_visual?: Json | null
          created_at?: string | null
          created_by?: string | null
          data_cadastro?: string | null
          email: string
          endereco?: Json | null
          id?: string
          modulos_liberados?: string[] | null
          nome: string
          plano?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string
          configuracao_visual?: Json | null
          created_at?: string | null
          created_by?: string | null
          data_cadastro?: string | null
          email?: string
          endereco?: Json | null
          id?: string
          modulos_liberados?: string[] | null
          nome?: string
          plano?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franquias_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "super_admins"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_auditoria: {
        Row: {
          acao: string
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          ip_address: string | null
          registro_id: string | null
          tabela_afetada: string | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id?: string | null
          tabela_afetada?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id?: string | null
          tabela_afetada?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_usabilidade: {
        Row: {
          acoes_realizadas: number | null
          created_at: string | null
          data_acesso: string | null
          franquia_id: string | null
          id: string
          modulo_acessado: string | null
          tempo_sessao: number | null
          unidade_id: string | null
          usuario_id: string | null
        }
        Insert: {
          acoes_realizadas?: number | null
          created_at?: string | null
          data_acesso?: string | null
          franquia_id?: string | null
          id?: string
          modulo_acessado?: string | null
          tempo_sessao?: number | null
          unidade_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          acoes_realizadas?: number | null
          created_at?: string | null
          data_acesso?: string | null
          franquia_id?: string | null
          id?: string
          modulo_acessado?: string | null
          tempo_sessao?: number | null
          unidade_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_usabilidade_franquia_id_fkey"
            columns: ["franquia_id"]
            isOneToOne: false
            referencedRelation: "franquias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_usabilidade_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_usabilidade_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      module_configurations: {
        Row: {
          company_id: string | null
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          module_key: string
          permissions: Json | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          module_key: string
          permissions?: Json | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          module_key?: string
          permissions?: Json | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_configurations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      module_instances: {
        Row: {
          company_id: string | null
          config: Json | null
          created_at: string | null
          custom_settings: Json | null
          id: string
          module_id: string
          status: string | null
          unit_id: string | null
          updated_at: string | null
          webhook_events: Json | null
          webhook_headers: Json | null
          webhook_url: string | null
        }
        Insert: {
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          module_id: string
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
          webhook_events?: Json | null
          webhook_headers?: Json | null
          webhook_url?: string | null
        }
        Update: {
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          module_id?: string
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
          webhook_events?: Json | null
          webhook_headers?: Json | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_instances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_instances_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string | null
          config_schema: Json | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          icon: string | null
          id: string
          key: string
          name: string
          status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          config_schema?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          icon?: string | null
          id?: string
          key: string
          name: string
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          config_schema?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          icon?: string | null
          id?: string
          key?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      modulos_sistema: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          url_acesso: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          url_acesso?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          url_acesso?: string | null
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          id: string
          notification_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          notification_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          notification_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "system_notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          platform_name: string
          status: boolean | null
          unidade_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          platform_name: string
          status?: boolean | null
          unidade_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          platform_name?: string
          status?: boolean | null
          unidade_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profissionais: {
        Row: {
          company_key: string
          created_at: string
          id: string
          NOME: string | null
          unit_id: string | null
          WHATSAPP: string | null
        }
        Insert: {
          company_key: string
          created_at?: string
          id?: string
          NOME?: string | null
          unit_id?: string | null
          WHATSAPP?: string | null
        }
        Update: {
          company_key?: string
          created_at?: string
          id?: string
          NOME?: string | null
          unit_id?: string | null
          WHATSAPP?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profissionais_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      recruitment_module: {
        Row: {
          candidates: Json | null
          company_id: string | null
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          position: string
          requirements: string[] | null
          status: string | null
          unit_id: string | null
        }
        Insert: {
          candidates?: Json | null
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          position: string
          requirements?: string[] | null
          status?: string | null
          unit_id?: string | null
        }
        Update: {
          candidates?: Json | null
          company_id?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          position?: string
          requirements?: string[] | null
          status?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recruitment_module_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruitment_module_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      recrutamento: {
        Row: {
          company_key: string | null
          cpf: string | null
          created_at: string
          data_nasc: string | null
          dias_livres: string | null
          dias_semana: string | null
          endereço: string | null
          estado_civil: string | null
          exp_comercial: string | null
          exp_residencial: string | null
          filhos: string | null
          fumante: string | null
          id: number
          motivo_cadastro: string | null
          nome: string | null
          qto_filhos: string | null
          ref_comercial: string | null
          ref_residencial: string | null
          rest_pet: string | null
          rest_pet_qual: string | null
          rg: string | null
          rotina_filhos: string | null
          sit_atual: string | null
          STATUS: string | null
          transporte: string | null
          unidade: string | null
          whatsapp: string | null
        }
        Insert: {
          company_key?: string | null
          cpf?: string | null
          created_at?: string
          data_nasc?: string | null
          dias_livres?: string | null
          dias_semana?: string | null
          endereço?: string | null
          estado_civil?: string | null
          exp_comercial?: string | null
          exp_residencial?: string | null
          filhos?: string | null
          fumante?: string | null
          id?: number
          motivo_cadastro?: string | null
          nome?: string | null
          qto_filhos?: string | null
          ref_comercial?: string | null
          ref_residencial?: string | null
          rest_pet?: string | null
          rest_pet_qual?: string | null
          rg?: string | null
          rotina_filhos?: string | null
          sit_atual?: string | null
          STATUS?: string | null
          transporte?: string | null
          unidade?: string | null
          whatsapp?: string | null
        }
        Update: {
          company_key?: string | null
          cpf?: string | null
          created_at?: string
          data_nasc?: string | null
          dias_livres?: string | null
          dias_semana?: string | null
          endereço?: string | null
          estado_civil?: string | null
          exp_comercial?: string | null
          exp_residencial?: string | null
          filhos?: string | null
          fumante?: string | null
          id?: number
          motivo_cadastro?: string | null
          nome?: string | null
          qto_filhos?: string | null
          ref_comercial?: string | null
          ref_residencial?: string | null
          rest_pet?: string | null
          rest_pet_qual?: string | null
          rg?: string | null
          rotina_filhos?: string | null
          sit_atual?: string | null
          STATUS?: string | null
          transporte?: string | null
          unidade?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      status_atendimento: {
        Row: {
          CLIENTE: string | null
          company_key: string
          created_at: string
          DATA: string | null
          DIA: string | null
          ENDEREÇO: string | null
          HORARIO: string | null
          id: string
          MOMENTO: string | null
          PERÍODO: string | null
          PROFISSIONAL: string | null
          SERVIÇO: string | null
          STATUS: string | null
          TIPO: string | null
          unit_id: string | null
          whatscliente: string | null
        }
        Insert: {
          CLIENTE?: string | null
          company_key: string
          created_at?: string
          DATA?: string | null
          DIA?: string | null
          ENDEREÇO?: string | null
          HORARIO?: string | null
          id?: string
          MOMENTO?: string | null
          PERÍODO?: string | null
          PROFISSIONAL?: string | null
          SERVIÇO?: string | null
          STATUS?: string | null
          TIPO?: string | null
          unit_id?: string | null
          whatscliente?: string | null
        }
        Update: {
          CLIENTE?: string | null
          company_key?: string
          created_at?: string
          DATA?: string | null
          DIA?: string | null
          ENDEREÇO?: string | null
          HORARIO?: string | null
          id?: string
          MOMENTO?: string | null
          PERÍODO?: string | null
          PROFISSIONAL?: string | null
          SERVIÇO?: string | null
          STATUS?: string | null
          TIPO?: string | null
          unit_id?: string | null
          whatscliente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_atendimento_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      status_atendimento_historico: {
        Row: {
          archived_at: string
          CLIENTE: string | null
          company_key: string | null
          created_at_original: string | null
          DATA: string | null
          DIA: string | null
          ENDEREÇO: string | null
          HORARIO: string | null
          id: string
          id_original: string | null
          MOMENTO: string | null
          PERÍODO: string | null
          PROFISSIONAL: string | null
          SERVIÇO: string | null
          STATUS_ORIGINAL: string | null
          TIPO: string | null
          whatscliente: string | null
        }
        Insert: {
          archived_at?: string
          CLIENTE?: string | null
          company_key?: string | null
          created_at_original?: string | null
          DATA?: string | null
          DIA?: string | null
          ENDEREÇO?: string | null
          HORARIO?: string | null
          id?: string
          id_original?: string | null
          MOMENTO?: string | null
          PERÍODO?: string | null
          PROFISSIONAL?: string | null
          SERVIÇO?: string | null
          STATUS_ORIGINAL?: string | null
          TIPO?: string | null
          whatscliente?: string | null
        }
        Update: {
          archived_at?: string
          CLIENTE?: string | null
          company_key?: string | null
          created_at_original?: string | null
          DATA?: string | null
          DIA?: string | null
          ENDEREÇO?: string | null
          HORARIO?: string | null
          id?: string
          id_original?: string | null
          MOMENTO?: string | null
          PERÍODO?: string | null
          PROFISSIONAL?: string | null
          SERVIÇO?: string | null
          STATUS_ORIGINAL?: string | null
          TIPO?: string | null
          whatscliente?: string | null
        }
        Relationships: []
      }
      super_admins: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          senha_hash: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          senha_hash: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          senha_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          priority: number | null
          scheduled_at: string | null
          target_audience: Json | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number | null
          scheduled_at?: string | null
          target_audience?: Json | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number | null
          scheduled_at?: string | null
          target_audience?: Json | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      unidade_produtos: {
        Row: {
          data_contratacao: string
          id: string
          produto_id: string | null
          status: boolean | null
          unidade_id: string | null
        }
        Insert: {
          data_contratacao?: string
          id?: string
          produto_id?: string | null
          status?: boolean | null
          unidade_id?: string | null
        }
        Update: {
          data_contratacao?: string
          id?: string
          produto_id?: string | null
          status?: boolean | null
          unidade_id?: string | null
        }
        Relationships: []
      }
      unidades: {
        Row: {
          cnpj: string | null
          codigo: string
          configuracao_personalizada: Json | null
          created_at: string | null
          endereco: Json | null
          franquia_id: string | null
          id: string
          modulos_ativos: string[] | null
          nome: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          codigo: string
          configuracao_personalizada?: Json | null
          created_at?: string | null
          endereco?: Json | null
          franquia_id?: string | null
          id?: string
          modulos_ativos?: string[] | null
          nome: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          codigo?: string
          configuracao_personalizada?: Json | null
          created_at?: string | null
          endereco?: Json | null
          franquia_id?: string | null
          id?: string
          modulos_ativos?: string[] | null
          nome?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unidades_franquia_id_fkey"
            columns: ["franquia_id"]
            isOneToOne: false
            referencedRelation: "franquias"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_metrics: {
        Row: {
          active_professionals: number | null
          cancelled_services: number | null
          completed_services: number | null
          created_at: string | null
          customer_satisfaction: number | null
          id: string
          metadata: Json | null
          metric_date: string
          metric_type: string
          response_time_avg: number | null
          revenue: number | null
          total_services: number | null
          unit_id: string
        }
        Insert: {
          active_professionals?: number | null
          cancelled_services?: number | null
          completed_services?: number | null
          created_at?: string | null
          customer_satisfaction?: number | null
          id?: string
          metadata?: Json | null
          metric_date: string
          metric_type: string
          response_time_avg?: number | null
          revenue?: number | null
          total_services?: number | null
          unit_id: string
        }
        Update: {
          active_professionals?: number | null
          cancelled_services?: number | null
          completed_services?: number | null
          created_at?: string | null
          customer_satisfaction?: number | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_type?: string
          response_time_avg?: number | null
          revenue?: number | null
          total_services?: number | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_metrics_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          address: Json | null
          business_license: string | null
          code: string | null
          company_id: string | null
          compliance_status: string | null
          configuration: Json | null
          contact: Json | null
          created_at: string | null
          franchise_fee: number | null
          id: string
          last_inspection: string | null
          last_performance_review: string | null
          local_settings: Json | null
          managers: string[] | null
          modules: Json | null
          name: string
          operational_status: string | null
          performance_metrics: Json | null
          performance_score: number | null
          status: string | null
          territory_bounds: Json | null
        }
        Insert: {
          address?: Json | null
          business_license?: string | null
          code?: string | null
          company_id?: string | null
          compliance_status?: string | null
          configuration?: Json | null
          contact?: Json | null
          created_at?: string | null
          franchise_fee?: number | null
          id?: string
          last_inspection?: string | null
          last_performance_review?: string | null
          local_settings?: Json | null
          managers?: string[] | null
          modules?: Json | null
          name: string
          operational_status?: string | null
          performance_metrics?: Json | null
          performance_score?: number | null
          status?: string | null
          territory_bounds?: Json | null
        }
        Update: {
          address?: Json | null
          business_license?: string | null
          code?: string | null
          company_id?: string | null
          compliance_status?: string | null
          configuration?: Json | null
          contact?: Json | null
          created_at?: string | null
          franchise_fee?: number | null
          id?: string
          last_inspection?: string | null
          last_performance_review?: string | null
          local_settings?: Json | null
          managers?: string[] | null
          modules?: Json | null
          name?: string
          operational_status?: string | null
          performance_metrics?: Json | null
          performance_score?: number | null
          status?: string | null
          territory_bounds?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "units_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_companies: {
        Row: {
          company_key: string
          created_at: string | null
          user_id: string
          webhook: string | null
        }
        Insert: {
          company_key: string
          created_at?: string | null
          user_id: string
          webhook?: string | null
        }
        Update: {
          company_key?: string
          created_at?: string | null
          user_id?: string
          webhook?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contexts: {
        Row: {
          company_id: string | null
          context_level: Database["public"]["Enums"]["context_level"]
          created_at: string | null
          id: string
          is_active: boolean | null
          role: string
          unit_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          context_level: Database["public"]["Enums"]["context_level"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role: string
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          context_level?: Database["public"]["Enums"]["context_level"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_contexts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_contexts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_contexts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          company_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role_id: string
          unit_id: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id: string
          unit_id?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          role: string
          unit_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role: string
          unit_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active: boolean
          auth_user_id: string | null
          created_at: string | null
          email: string
          hashed_password: string
          id: string
          last_login: string | null
          nome: string | null
          role: string
          unidade_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          hashed_password: string
          id?: string
          last_login?: string | null
          nome?: string | null
          role?: string
          unidade_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          hashed_password?: string
          id?: string
          last_login?: string | null
          nome?: string | null
          role?: string
          unidade_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          franquia_id: string | null
          id: string
          nome: string
          permissoes: Json | null
          senha_hash: string
          tipo_usuario: string
          ultimo_acesso: string | null
          unidade_id: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          franquia_id?: string | null
          id?: string
          nome: string
          permissoes?: Json | null
          senha_hash: string
          tipo_usuario: string
          ultimo_acesso?: string | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          franquia_id?: string | null
          id?: string
          nome?: string
          permissoes?: Json | null
          senha_hash?: string
          tipo_usuario?: string
          ultimo_acesso?: string | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_franquia_id_fkey"
            columns: ["franquia_id"]
            isOneToOne: false
            referencedRelation: "franquias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas_comerciais: {
        Row: {
          created_at: string | null
          data_venda: string | null
          franquia_id: string | null
          id: string
          mes_referencia: string | null
          status: string | null
          tipo_venda: string | null
          valor_venda: number | null
        }
        Insert: {
          created_at?: string | null
          data_venda?: string | null
          franquia_id?: string | null
          id?: string
          mes_referencia?: string | null
          status?: string | null
          tipo_venda?: string | null
          valor_venda?: number | null
        }
        Update: {
          created_at?: string | null
          data_venda?: string | null
          franquia_id?: string | null
          id?: string
          mes_referencia?: string | null
          status?: string | null
          tipo_venda?: string | null
          valor_venda?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_comerciais_franquia_id_fkey"
            columns: ["franquia_id"]
            isOneToOne: false
            referencedRelation: "franquias"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_module: {
        Args: {
          p_module_key: string
          p_company_id: string
          p_unit_id?: string
          p_config?: Json
        }
        Returns: string
      }
      add_company_member: {
        Args: { p_user_id: string; p_company_id: string; p_role?: string }
        Returns: Json
      }
      add_unit_member: {
        Args: { p_user_id: string; p_unit_id: string; p_role?: string }
        Returns: Json
      }
      assign_user_role: {
        Args: {
          p_user_id: string
          p_role_id: string
          p_company_id?: string
          p_unit_id?: string
          p_action?: string
        }
        Returns: Json
      }
      authenticate_user: {
        Args: { email: string; password: string }
        Returns: Json
      }
      check_company_permission: {
        Args: {
          user_id: string
          company_id: string
          min_permission_level: number
        }
        Returns: boolean
      }
      check_module_permission: {
        Args: {
          user_id: string
          module_id: string
          company_id: string
          unit_id: string
          permission: string
        }
        Returns: boolean
      }
      check_unit_permission: {
        Args: { user_id: string; unit_id: string; min_permission_level: number }
        Returns: boolean
      }
      check_user_permission: {
        Args: {
          p_user_id: string
          p_required_level: Database["public"]["Enums"]["context_level"]
          p_company_id?: string
          p_unit_id?: string
        }
        Returns: boolean
      }
      create_franchise_subscription: {
        Args: { p_company_id: string; p_plan_id: string; p_expires_at?: string }
        Returns: Json
      }
      create_superadmin_user: {
        Args: { p_email: string; p_full_name: string; p_phone?: string }
        Returns: string
      }
      create_user: {
        Args: {
          p_email: string
          p_password: string
          p_nome: string
          p_role?: string
          p_unidade_id?: string
        }
        Returns: Json
      }
      get_audit_logs: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_entity_type?: string
          p_company_id?: string
        }
        Returns: Json
      }
      get_company_info: {
        Args: { p_company_id: string }
        Returns: Json
      }
      get_company_metrics: {
        Args: {
          p_company_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: Json
      }
      get_franchise_details: {
        Args: { p_company_id: string }
        Returns: Json
      }
      get_franchise_plans: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_system_settings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_unit_info: {
        Args: { p_unit_id: string }
        Returns: Json
      }
      get_user_companies: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_context: {
        Args: { p_user_id: string }
        Returns: {
          context_level: Database["public"]["Enums"]["context_level"]
          company_id: string
          unit_id: string
          role: string
        }[]
      }
      get_user_notifications: {
        Args: { p_user_id: string; p_limit?: number }
        Returns: Json
      }
      get_user_unit: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_units: {
        Args: { p_user_id: string }
        Returns: Json
      }
      is_super_admin: {
        Args: Record<PropertyKey, never> | { _user_id: string }
        Returns: boolean
      }
      log_audit: {
        Args: {
          p_action: string
          p_entity_type: string
          p_entity_id?: string
          p_old_data?: Json
          p_new_data?: Json
          p_company_id?: string
          p_unit_id?: string
        }
        Returns: string
      }
      log_system_activity: {
        Args: {
          p_user_id: string
          p_company_id: string
          p_unit_id: string
          p_module_name: string
          p_action: string
          p_description: string
          p_metadata?: Json
        }
        Returns: string
      }
      manage_custom_role: {
        Args: {
          p_action: string
          p_role_id?: string
          p_company_id?: string
          p_unit_id?: string
          p_name?: string
          p_description?: string
          p_permissions?: Json
        }
        Returns: Json
      }
      mark_notification_read: {
        Args: { p_notification_id: string; p_read?: boolean }
        Returns: boolean
      }
      migrate_recruitment_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      migrate_status_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      promote_to_super_admin: {
        Args: { user_email: string }
        Returns: Json
      }
      send_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_data?: Json
          p_action_url?: string
        }
        Returns: string
      }
      super_admin_create_company: {
        Args: {
          p_name: string
          p_key: string
          p_document?: string
          p_plan?: string
        }
        Returns: Json
      }
      super_admin_create_unit: {
        Args: { p_name: string; p_company_id: string; p_code?: string }
        Returns: Json
      }
      super_admin_create_user: {
        Args: {
          p_email: string
          p_nome: string
          p_role: string
          p_password: string
        }
        Returns: Json
      }
      super_admin_get_companies: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      super_admin_get_units: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      super_admin_get_users: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      update_system_setting: {
        Args: { p_key: string; p_value: Json; p_description?: string }
        Returns: Json
      }
      user_has_role_in_unit: {
        Args: { required_role: string; target_unit_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "manager" | "attendant"
      context_level: "super_admin" | "franchise" | "unit"
      user_role: "super_admin" | "manager" | "attendant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "manager", "attendant"],
      context_level: ["super_admin", "franchise", "unit"],
      user_role: ["super_admin", "manager", "attendant"],
    },
  },
} as const
