import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UpdateProfileData {
  username: string;
  avatar_url?: string;
}

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!userId) throw new Error("Must be logged in to update profile");

      const { data: profile, error } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          avatar_url: data.avatar_url || null,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return profile;
    },
    onSuccess: () => {
      // Invalidate profile queries for immediate UI update
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
}
