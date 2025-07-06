import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ItemSummaryWithAuthor, UseItemsParams } from "@/types/item";

const ITEMS_PER_PAGE = 10;

function transformItems(items: any[]): ItemSummaryWithAuthor[] {
  return items.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    title: item.title,
    main_image: item.main_image,
    average_rating: item.average_rating,
    category_id: item.category_id,
    category: item.category || "Uncategorized",
    author: {
      id: item.profile_id || item.user_id,
      username: item.username || "Unknown User",
      avatar_url: item.avatar_url || null,
    },
  }));
}

export function useItems({
  mode = "general",
  searchQuery,
  enabled = true,
}: UseItemsParams = {}) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const shouldFetch =
    enabled &&
    (mode === "general" ||
      mode === "search" ||
      (mode === "created" && userId) ||
      (mode === "favorited" && userId));

  const query = useInfiniteQuery({
    queryKey: ["items", mode, searchQuery, userId],
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let result: any;

      if (mode === "favorited" && userId) {
        result = await supabase
          .from("user_favorites")
          .select(
            `
            created_at,
            items_with_authors!inner(*)
          `
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (result.error) throw result.error;
        const items =
          result.data?.map((fav: any) => fav.items_with_authors) || [];
        return {
          items: transformItems(items),
          nextPage:
            items.length === ITEMS_PER_PAGE ? currentPage + 1 : undefined,
        };
      } else if (mode === "search" && searchQuery) {
        result = await supabase
          .from("items_with_authors")
          .select("*")
          .or(`title.ilike.%${searchQuery}%`)
          .order("created_at", { ascending: false })
          .range(from, to);
      } else if (mode === "created" && userId) {
        result = await supabase
          .from("items_with_authors")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .range(from, to);
      } else {
        result = await supabase
          .from("items_with_authors")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, to);
      }

      if (result.error) throw result.error;

      const transformedItems = transformItems(result.data || []);

      return {
        items: transformedItems,
        nextPage:
          transformedItems.length === ITEMS_PER_PAGE
            ? currentPage + 1
            : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!shouldFetch,
  });

  return {
    data: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
  };
}

// Convenience hooks for specific use cases
export const useGeneralItems = () => useItems({ mode: "general" });
export const useUserItems = () => useItems({ mode: "created" });
export const useFavoriteItems = () => useItems({ mode: "favorited" });
export const useSearchItems = (searchQuery: string) =>
  useItems({ mode: "search", searchQuery, enabled: !!searchQuery.trim() });
