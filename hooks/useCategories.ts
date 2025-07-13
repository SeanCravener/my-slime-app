import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database/supabase";

type Category = Database["public"]["Tables"]["item_categories"]["Row"];

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("item_categories")
        .select("*")
        .order("category");

      if (error) throw error;
      return data;
    },
  });
}
