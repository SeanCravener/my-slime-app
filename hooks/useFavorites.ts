// hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Fetch favorites - automatically resets when userId changes
  const { data: favoritedItemIds = [], isLoading } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_favorites")
        .select("item_id")
        .eq("user_id", userId);
      if (error) throw error;
      return data?.map((fav) => fav.item_id) || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
  });

  // Toggle favorite mutation
  const { mutateAsync: toggleFavorite } = useMutation({
    mutationFn: async ({
      itemId,
      shouldFavorite,
    }: {
      itemId: string;
      shouldFavorite: boolean;
    }) => {
      if (!userId) throw new Error("User not authenticated");

      if (shouldFavorite) {
        const { error } = await supabase
          .from("user_favorites")
          .insert([{ user_id: userId, item_id: itemId }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("item_id", itemId);
        if (error) throw error;
      }
    },
    onSuccess: (_, { itemId, shouldFavorite }) => {
      // Optimistic update
      queryClient.setQueryData<string[]>(["favorites", userId], (old) => {
        if (shouldFavorite) {
          return old ? [...old, itemId] : [itemId];
        } else {
          return old ? old.filter((id) => id !== itemId) : [];
        }
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["items", "favorited"] });
    },
  });

  return {
    favoritedItemIds,
    isLoading,
    toggleFavorite: (itemId: string, shouldFavorite: boolean) =>
      toggleFavorite({ itemId, shouldFavorite }),
  };
}
