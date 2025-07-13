import { Item as DbItem, Profile } from "./database";

export interface Ingredient {
  value: string;
}

export interface Instruction {
  content: string;
  "image-url": string;
}

export interface Item extends Omit<DbItem, "instructions" | "ingredients"> {
  instructions: Instruction[];
  ingredients: Ingredient[];
  category: string;
}

export interface ItemSummary {
  id: string;
  user_id: string;
  title: string;
  main_image: string;
  average_rating: number | null;
  category_id: number | null;
  category: string;
}

export interface Author {
  id: string;
  username: string;
  avatar_url: string | null;
}

// NEW: Enhanced type with author info
export interface ItemSummaryWithAuthor extends ItemSummary {
  author: Author;
}

export type ItemFormData = {
  title: string;
  description: string;
  main_image: string;
  category_id: number | null;
  ingredients: Ingredient[];
  instructions: Instruction[];
};

// NEW: Export the fetch mode type
export type ItemFetchMode = "general" | "search" | "created" | "favorited";

// NEW: Hook parameters interface
export interface UseItemsParams {
  mode?: ItemFetchMode;
  searchQuery?: string;
  enabled?: boolean;
}
