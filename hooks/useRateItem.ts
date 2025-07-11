import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function useRateItem(id: string) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const ratingMutation = useMutation({
    mutationFn: async (rating: number) => {
      console.log("Attempting to save rating:", rating, "for item:", id);
      console.log("Session:", session?.user?.id);

      if (!session) throw new Error("Must be logged in to rate");

      const { data, error } = await supabase.from("item_ratings").upsert({
        item_id: id,
        user_id: session.user.id,
        rating,
      });

      console.log("Supabase response:", { data, error });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log("Rating saved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["item", id] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      console.log("Rating save failed:", error);
    },
  });

  return {
    saveRating: (rating: number) => ratingMutation.mutateAsync(rating),
    isSaving: ratingMutation.isPending,
    isError: ratingMutation.isError,
    error: ratingMutation.error,
  };
}
