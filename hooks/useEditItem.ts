import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ItemFormData } from "@/types/item";
import { router } from "expo-router";
import { deleteStorageFile } from "@/lib/storage";

interface EditItemData extends ItemFormData {
  // Optional array of old image URLs that need to be cleaned up
  imagesToCleanup?: string[];
}

export function useEditItem(itemId: string) {
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (data: EditItemData) => {
      const { imagesToCleanup, ...itemData } = data;

      // Update item data - ingredients and instructions are now stored as objects
      const { error: itemError } = await supabase
        .from("items")
        .update({
          title: itemData.title,
          description: itemData.description,
          main_image: itemData.main_image,
          category_id: itemData.category_id,
          ingredients: itemData.ingredients as any, // Already Ingredient[] objects
          instructions: itemData.instructions as any, // Already Instruction[] objects
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      if (itemError) throw itemError;

      // Clean up old images that were replaced
      if (imagesToCleanup && imagesToCleanup.length > 0) {
        await Promise.all(imagesToCleanup.map((url) => deleteStorageFile(url)));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      // Navigate back on success - let the form handle success messaging
      router.back();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Get all images associated with the item before deletion
      const { data: item } = await supabase
        .from("items")
        .select("main_image, instructions")
        .eq("id", itemId)
        .single();

      if (item) {
        // Delete the item first
        const { error } = await supabase
          .from("items")
          .delete()
          .eq("id", itemId);

        if (error) throw error;

        // Then clean up all images
        const images = [
          item.main_image,
          ...(item.instructions ?? [])
            .map((instruction: any) => instruction["image-url"])
            .filter(
              (url: any): url is string =>
                typeof url === "string" && url.length > 0
            ),
        ];

        await Promise.all(images.map((url) => deleteStorageFile(url)));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.replace("/");
    },
  });

  return {
    editItem: editMutation.mutate,
    deleteItem: deleteMutation.mutate,
    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Return error state for the form to handle
    error: editMutation.error || deleteMutation.error,
  };
}
