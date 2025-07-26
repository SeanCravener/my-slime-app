import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  ItemSummaryWithAuthor,
  UseItemsParams,
  SortOption,
  SortOrder,
} from "@/types/item";

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
    view_count: item.view_count || 0,
    author: {
      id: item.profile_id || item.user_id,
      username: item.username || "Unknown User",
      avatar_url: item.avatar_url || null,
    },
  }));
}

function getSortColumn(sortBy: SortOption): string {
  switch (sortBy) {
    case "date":
      return "created_at";
    case "rating":
      return "average_rating";
    case "views":
      return "view_count";
    default:
      return "created_at";
  }
}

export function useItems({
  mode = "general",
  searchQuery,
  enabled = true,
  sortBy = "date",
  sortOrder = "desc",
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
    queryKey: ["items", mode, searchQuery, userId, sortBy, sortOrder],
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let result: any;
      const sortColumn = getSortColumn(sortBy);
      const ascending = sortOrder === "asc";

      if (mode === "favorited" && userId) {
        // For favorites, we need to sort by the item data, not the favorite creation date
        // This is more complex as we need to join and sort properly
        result = await supabase
          .from("user_favorites")
          .select(
            `
            created_at,
            items_with_authors!inner(*)
          `
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false }) // Keep favorites ordered by when they were favorited
          .range(from, to);

        if (result.error) throw result.error;
        let items =
          result.data?.map((fav: any) => fav.items_with_authors) || [];

        // Apply client-side sorting for favorites since Supabase sorting is limited here
        items = items.sort((a: any, b: any) => {
          let aValue = a[sortColumn];
          let bValue = b[sortColumn];

          // Handle null values
          if (aValue === null && bValue === null) return 0;
          if (aValue === null) return ascending ? -1 : 1;
          if (bValue === null) return ascending ? 1 : -1;

          if (sortColumn === "created_at") {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }

          if (ascending) {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });

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
          .order(sortColumn, { ascending })
          .range(from, to);
      } else if (mode === "created" && userId) {
        result = await supabase
          .from("items_with_authors")
          .select("*")
          .eq("user_id", userId)
          .order(sortColumn, { ascending })
          .range(from, to);
      } else {
        result = await supabase
          .from("items_with_authors")
          .select("*")
          .order(sortColumn, { ascending })
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

// Updated convenience hooks with sorting support
export const useGeneralItems = (sortBy?: SortOption, sortOrder?: SortOrder) =>
  useItems({ mode: "general", sortBy, sortOrder });

export const useUserItems = (sortBy?: SortOption, sortOrder?: SortOrder) =>
  useItems({ mode: "created", sortBy, sortOrder });

export const useFavoriteItems = (sortBy?: SortOption, sortOrder?: SortOrder) =>
  useItems({ mode: "favorited", sortBy, sortOrder });

export const useSearchItems = (
  searchQuery: string,
  sortBy?: SortOption,
  sortOrder?: SortOrder
) =>
  useItems({
    mode: "search",
    searchQuery,
    enabled: !!searchQuery.trim(),
    sortBy,
    sortOrder,
  });
