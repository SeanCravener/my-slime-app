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

export interface FilterOptions {
  categories?: number[];
  ratings?: number[];
}

// Extend the existing UseItemsParams instead of creating a new interface
interface ExtendedUseItemsParams extends UseItemsParams {
  filters?: FilterOptions;
}

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

function applyClientSideFilters(items: any[], filters?: FilterOptions): any[] {
  if (!filters) return items;

  return items.filter((item) => {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(item.category_id)) {
        return false;
      }
    }

    // Rating filter - show items that match any of the selected rating ranges
    if (filters.ratings && filters.ratings.length > 0) {
      const itemRating = item.average_rating || 0;
      const matchesRating = filters.ratings.some((rating) => {
        // Rating 5 = 4.5-5.0, Rating 4 = 3.5-4.49, etc.
        const minRating = rating - 0.5;
        const maxRating = rating + 0.49;
        return itemRating >= minRating && itemRating <= maxRating;
      });
      if (!matchesRating) {
        return false;
      }
    }

    return true;
  });
}

export function useItems({
  mode = "general",
  searchQuery,
  enabled = true,
  sortBy = "date",
  sortOrder = "desc",
  filters,
}: ExtendedUseItemsParams = {}) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const shouldFetch =
    enabled &&
    (mode === "general" ||
      mode === "search" ||
      (mode === "created" && userId) ||
      (mode === "favorited" && userId));

  const query = useInfiniteQuery({
    queryKey: ["items", mode, searchQuery, userId, sortBy, sortOrder, filters],
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let result: any;
      const sortColumn = getSortColumn(sortBy);
      const ascending = sortOrder === "asc";

      if (mode === "favorited" && userId) {
        // For favorites, get items and apply filters/sorting client-side
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
        let items =
          result.data?.map((fav: any) => fav.items_with_authors) || [];

        // Apply filters client-side
        items = applyClientSideFilters(items, filters);

        // Apply client-side sorting
        items = items.sort((a: any, b: any) => {
          let aValue = a[sortColumn];
          let bValue = b[sortColumn];

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
        // Build the search query
        let query = supabase
          .from("items_with_authors")
          .select("*")
          .or(`title.ilike.%${searchQuery}%`)
          .order(sortColumn, { ascending });

        // Apply category filter
        if (filters?.categories && filters.categories.length > 0) {
          query = query.in("category_id", filters.categories);
        }

        // Apply rating filter (simplified for server-side)
        if (filters?.ratings && filters.ratings.length > 0) {
          const minRating = Math.min(...filters.ratings) - 0.5;
          query = query.gte("average_rating", minRating);
        }

        result = await query.range(from, to);
      } else if (mode === "created" && userId) {
        // Build the created items query
        let query = supabase
          .from("items_with_authors")
          .select("*")
          .eq("user_id", userId)
          .order(sortColumn, { ascending });

        // Apply category filter
        if (filters?.categories && filters.categories.length > 0) {
          query = query.in("category_id", filters.categories);
        }

        // Apply rating filter
        if (filters?.ratings && filters.ratings.length > 0) {
          const minRating = Math.min(...filters.ratings) - 0.5;
          query = query.gte("average_rating", minRating);
        }

        result = await query.range(from, to);
      } else {
        // Build the general items query
        let query = supabase
          .from("items_with_authors")
          .select("*")
          .order(sortColumn, { ascending });

        // Apply category filter
        if (filters?.categories && filters.categories.length > 0) {
          query = query.in("category_id", filters.categories);
        }

        // Apply rating filter
        if (filters?.ratings && filters.ratings.length > 0) {
          const minRating = Math.min(...filters.ratings) - 0.5;
          query = query.gte("average_rating", minRating);
        }

        result = await query.range(from, to);
      }

      if (result.error) throw result.error;

      let transformedItems = transformItems(result.data || []);

      // Apply client-side rating filter for precise matching (except favorites which are already filtered)
      if (
        mode !== "favorited" &&
        filters?.ratings &&
        filters.ratings.length > 0
      ) {
        transformedItems = transformedItems.filter((item) => {
          const itemRating = item.average_rating || 0;
          return filters.ratings!.some((rating) => {
            const minRating = rating - 0.5;
            const maxRating = rating + 0.49;
            return itemRating >= minRating && itemRating <= maxRating;
          });
        });
      }

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

// Keep the existing convenience hooks unchanged to maintain compatibility
export const useGeneralItems = () => useItems({ mode: "general" });
export const useUserItems = () => useItems({ mode: "created" });
export const useFavoriteItems = () => useItems({ mode: "favorited" });
export const useSearchItems = (searchQuery: string) =>
  useItems({ mode: "search", searchQuery, enabled: !!searchQuery.trim() });
