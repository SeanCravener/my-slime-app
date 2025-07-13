import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ItemFormData } from "@/types/item";

export function useAddItem(sessionUserId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ItemFormData) => {
      if (!sessionUserId) throw new Error("Must be logged in to add items");

      // Transform the form data to match database schema
      const { data: item, error } = await supabase
        .from("items")
        .insert({
          title: data.title,
          description: data.description,
          main_image: data.main_image,
          category_id: data.category_id,
          user_id: sessionUserId,
          ingredients: data.ingredients as any, // Cast Ingredient[] to Json[]
          instructions: data.instructions as any, // Cast Instruction[] to Json[]
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Invalidate item lists for immediate UI update
      await queryClient.invalidateQueries({ queryKey: ["items"] });

      return item;
    },
  });
}
