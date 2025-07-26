import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface IncrementViewParams {
  itemId: string;
}

export function useIncrementView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId }: IncrementViewParams) => {
      const { error } = await supabase.rpc("increment_view_count", {
        item_id: itemId,
      });

      if (error) {
        console.error("Error incrementing view count:", error);
        throw error;
      }
    },
    onSuccess: (_, { itemId }) => {
      // Invalidate the specific item query to refetch updated view count
      queryClient.invalidateQueries({
        queryKey: ["item", itemId],
      });

      // Optionally invalidate items lists that might show view counts
      // TODO: This might cause a lot of API calls to the server, so might remove. Need to test.
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },
    onError: (error) => {
      console.error("Failed to increment view count:", error);
      // Might want to add toast notifications here
    },
  });
}
