export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      steps: {
        Row: {
          config: Json;
          created_at: string;
          id: number;
          type: string;
          workflow_id: number;
        };
        Insert: {
          config: Json;
          created_at?: string;
          id?: number;
          type: string;
          workflow_id: number;
        };
        Update: {
          config?: Json;
          created_at?: string;
          id?: number;
          type?: string;
          workflow_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "steps_workflow_id_fkey";
            columns: ["workflow_id"];
            isOneToOne: false;
            referencedRelation: "workflows";
            referencedColumns: ["id"];
          },
        ];
      };
      workflows: {
        Row: {
          address: string;
          created_at: string;
          id: number;
          name: string;
          trigger: Json;
        };
        Insert: {
          address: string;
          created_at?: string;
          id?: number;
          name: string;
          trigger: Json;
        };
        Update: {
          address?: string;
          created_at?: string;
          id?: number;
          name?: string;
          trigger?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
