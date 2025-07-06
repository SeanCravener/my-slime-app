import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

interface FavoritesContextType {
  favoritedItemIds: string[];
  isLoading: boolean;
  toggleFavorite: (itemId: string, shouldFavorite: boolean) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoritedItemIds: [],
  isLoading: true,
  toggleFavorite: async () => {},
});

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Fetch user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data?.session?.user?.id);
    };
    getUserId();
  }, []);

  // Fetch all favorited item IDs for the current user on login
  const {
    data: favoritedItemIds = [],
    isLoading: isQueryLoading,
    error,
  } = useQuery<string[], PostgrestError>({
    queryKey: ["allFavorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_favorites")
        .select("item_id")
        .eq("user_id", userId);
      if (error) throw error;
      return data?.map((fav) => fav.item_id as string) || [];
    },
    enabled: !!userId, // Only run if userId is available
    staleTime: Infinity, // Keep data fresh indefinitely until manually invalidated
    gcTime: Infinity, // Garbage collection time (replaces cacheTime in v5)
  });

  if (error) {
    console.error("Error fetching favorites:", error.message);
  }

  // Mutation to toggle favorite status (add/remove from user_favorites and update context)
  const { mutateAsync, isPending: isToggling } = useMutation<
    unknown,
    PostgrestError,
    { itemId: string; shouldFavorite: boolean }
  >({
    mutationFn: async ({ itemId, shouldFavorite }) => {
      if (!userId) throw new Error("User not authenticated");
      if (shouldFavorite) {
        // Add favorite record
        const { data, error } = await supabase
          .from("user_favorites")
          .insert([{ user_id: userId, item_id: itemId }]);
        if (error) throw error;
        return data;
      } else {
        // Remove favorite record
        const { data, error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("item_id", itemId);
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, { itemId, shouldFavorite }) => {
      // Update the cached favoritedItemIds in context
      queryClient.setQueryData<string[]>(
        ["allFavorites", userId],
        (oldData) => {
          if (shouldFavorite) {
            return oldData ? [...oldData, itemId] : [itemId];
          } else {
            return oldData ? oldData.filter((id) => id !== itemId) : [];
          }
        }
      );
      // Also invalidate the Profile screen's favorited list to ensure sync
      queryClient.invalidateQueries({ queryKey: ["items", "favorited"] });
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error.message);
    },
  });

  const toggleFavorite = async (itemId: string, shouldFavorite: boolean) => {
    await mutateAsync({ itemId, shouldFavorite });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritedItemIds,
        isLoading: isQueryLoading || isToggling,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook to access the favorites context
export const useFavorites = () => useContext(FavoritesContext);
