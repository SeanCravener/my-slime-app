import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Item, Instruction, Ingredient } from "@/types/item";

interface ItemWithDetails extends Omit<Item, "instructions" | "ingredients"> {
  instructions: Instruction[];
  ingredients: Ingredient[];
  category: string;
}

// Type guard to validate instruction format
function isValidInstruction(obj: any): obj is Instruction {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.content === "string" &&
    typeof obj["image-url"] === "string"
  );
}

// Type guard to validate ingredient format
function isValidIngredient(obj: any): obj is Ingredient {
  return obj && typeof obj === "object" && typeof obj.value === "string";
}

export function useItem(itemId: string | undefined) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn: async (): Promise<ItemWithDetails> => {
      if (!itemId) {
        throw new Error("Item ID is required");
      }

      const { data, error } = await supabase
        .from("items")
        .select(
          `
          *,
          item_categories!inner(category)
        `
        )
        .eq("id", itemId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch item: ${error.message}`);
      }

      if (!data) {
        throw new Error("Item not found");
      }

      // Transform and validate instructions
      const transformedInstructions: Instruction[] = [];
      if (data.instructions && Array.isArray(data.instructions)) {
        for (const instruction of data.instructions) {
          if (isValidInstruction(instruction)) {
            transformedInstructions.push(instruction);
          } else {
            console.warn("Invalid instruction format:", instruction);
          }
        }
      }

      // Transform and validate ingredients
      const transformedIngredients: Ingredient[] = [];
      if (data.ingredients && Array.isArray(data.ingredients)) {
        for (const ingredient of data.ingredients) {
          if (isValidIngredient(ingredient)) {
            transformedIngredients.push(ingredient);
          } else {
            console.warn("Invalid ingredient format:", ingredient);
          }
        }
      }

      // Transform the data to match expected interface
      return {
        ...data,
        category: data.item_categories.category,
        instructions: transformedInstructions,
        ingredients: transformedIngredients,
      };
    },
    enabled: !!itemId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
}
