import { Database } from "./supabase";

type Tables = Database["public"]["Tables"];

export type Item = Tables["items"]["Row"];
export type Category = Tables["item_categories"]["Row"];
export type Rating = Tables["item_ratings"]["Row"];
export type Profile = Tables["profiles"]["Row"];
export type Favorite = Tables["user_favorites"]["Row"];
