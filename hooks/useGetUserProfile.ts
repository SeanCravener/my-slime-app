import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Author } from "@/types/item";

type UserId = string;

export function useGetUserProfile(id: UserId) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: async (): Promise<Author[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", id)
        .limit(1);

      if (error) {
        console.error("Error fetching author:", error);
        // Return a fallback user instead of null
        return [
          {
            id: id,
            username: "Unknown User",
            avatar_url: null,
          },
        ];
      }
      console.log("Fetched author data:", data);
      return (data ?? []).map((item) => ({
        ...item,
        username: item.username ?? "Unknown User",
      }));
    },
  });
}
