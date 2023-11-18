import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  "https://msulgytoymccrlhufgok.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
