import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Item, Instruction } from "@/types/item";

interface ItemWithDetails extends Omit<Item, "instructions"> {
  instructions: Instruction[];
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

      // Transform the data to match expected interface
      return {
        ...data,
        category: data.item_categories.category,
        instructions: transformedInstructions,
      };
    },
    enabled: !!itemId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
}
