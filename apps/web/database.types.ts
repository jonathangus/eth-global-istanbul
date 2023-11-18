export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      step_runs: {
        Row: {
          created_at: string
          id: number
          input: Json | null
          output: Json | null
          status: string | null
          step_id: number
          workflow_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          input?: Json | null
          output?: Json | null
          status?: string | null
          step_id: number
          workflow_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          input?: Json | null
          output?: Json | null
          status?: string | null
          step_id?: number
          workflow_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "step_runs_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          }
        ]
      }
      steps: {
        Row: {
          action: Json
          created_at: string
          id: number
          order: number
          tx_sign_data: Json | null
          type: string
          workflow_id: number
        }
        Insert: {
          action: Json
          created_at?: string
          id?: number
          order: number
          tx_sign_data?: Json | null
          type: string
          workflow_id: number
        }
        Update: {
          action?: Json
          created_at?: string
          id?: number
          order?: number
          tx_sign_data?: Json | null
          type?: string
          workflow_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          }
        ]
      }
      workflows: {
        Row: {
          address: string
          chain_id: number
          created_at: string
          id: number
          name: string
          trigger: Json
        }
        Insert: {
          address: string
          chain_id: number
          created_at?: string
          id?: number
          name: string
          trigger: Json
        }
        Update: {
          address?: string
          chain_id?: number
          created_at?: string
          id?: number
          name?: string
          trigger?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
