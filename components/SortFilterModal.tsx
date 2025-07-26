import React from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { useCategories } from "@/hooks/useCategories";
import { FilterState, SortState } from "@/hooks/useFilterSort";
import { SortOption } from "@/types/item";

interface SortFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  sort: SortState;
  onToggleCategory: (categoryId: number) => void;
  onToggleRating: (rating: number) => void;
  onUpdateSort: (sortBy: SortOption) => void;
  onClear: () => void;
  onApply: () => void;
}

const RATING_OPTIONS = [1, 2, 3, 4, 5];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date", label: "Date Added" },
  { value: "views", label: "Views" },
  { value: "rating", label: "Rating" },
];

export const SortFilterModal: React.FC<SortFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  sort,
  onToggleCategory,
  onToggleRating,
  onUpdateSort,
  onClear,
  onApply,
}) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleApply = () => {
    onApply();
    onClose();
  };

  const FilterButton: React.FC<{
    isSelected: boolean;
    onPress: () => void;
    children: React.ReactNode;
  }> = ({ isSelected, onPress, children }) => (
    <Button
      variant={isSelected ? "solid" : "outline"}
      size="sm"
      onPress={onPress}
      className={`rounded-full ${
        isSelected ? "bg-primary" : "bg-background border-border"
      }`}
    >
      <ButtonText
        size="sm"
        className={isSelected ? "text-primary-foreground" : "text-foreground"}
      >
        {children}
      </ButtonText>
    </Button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className="bg-white">
        <ModalHeader className="border-b border-border">
          <Text className="text-xl font-semibold text-foreground">
            Sort & Filter
          </Text>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody className="p-6">
          <VStack space="xl">
            {/* Sort Section */}
            <VStack space="md">
              <Text className="text-base font-medium text-foreground">
                Sort by
              </Text>
              <HStack space="sm" className="flex-wrap">
                {SORT_OPTIONS.map((option) => (
                  <FilterButton
                    key={option.value}
                    isSelected={sort.sortBy === option.value}
                    onPress={() => onUpdateSort(option.value)}
                  >
                    {option.label}
                    {sort.sortBy === option.value &&
                      option.value === "date" &&
                      " ↓"}
                  </FilterButton>
                ))}
              </HStack>
            </VStack>

            {/* Rating Section */}
            <VStack space="md">
              <Text className="text-base font-medium text-foreground">
                Rating
              </Text>
              <HStack space="sm" className="flex-wrap">
                {RATING_OPTIONS.map((rating) => (
                  <FilterButton
                    key={rating}
                    isSelected={filters.ratings.includes(rating)}
                    onPress={() => onToggleRating(rating)}
                  >
                    {rating} ⭐
                  </FilterButton>
                ))}
              </HStack>
            </VStack>

            {/* Categories Section */}
            <VStack space="md">
              <Text className="text-base font-medium text-foreground">
                Categories
              </Text>
              {categoriesLoading ? (
                <Text className="text-sm text-muted-foreground">
                  Loading categories...
                </Text>
              ) : (
                <VStack space="sm">
                  {/* First row of categories */}
                  <HStack space="sm" className="flex-wrap">
                    {categories?.slice(0, 3).map((category) => (
                      <FilterButton
                        key={category.id}
                        isSelected={filters.categories.includes(category.id)}
                        onPress={() => onToggleCategory(category.id)}
                      >
                        {category.category}
                      </FilterButton>
                    ))}
                  </HStack>

                  {/* Second row of categories */}
                  {categories && categories.length > 3 && (
                    <HStack space="sm" className="flex-wrap">
                      {categories.slice(3, 6).map((category) => (
                        <FilterButton
                          key={category.id}
                          isSelected={filters.categories.includes(category.id)}
                          onPress={() => onToggleCategory(category.id)}
                        >
                          {category.category}
                        </FilterButton>
                      ))}
                    </HStack>
                  )}

                  {/* Third row if needed */}
                  {categories && categories.length > 6 && (
                    <HStack space="sm" className="flex-wrap">
                      {categories.slice(6).map((category) => (
                        <FilterButton
                          key={category.id}
                          isSelected={filters.categories.includes(category.id)}
                          onPress={() => onToggleCategory(category.id)}
                        >
                          {category.category}
                        </FilterButton>
                      ))}
                    </HStack>
                  )}
                </VStack>
              )}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter className="border-t border-border">
          <HStack space="md" className="w-full">
            <Button
              variant="outline"
              size="lg"
              onPress={onClear}
              className="flex-1"
            >
              <ButtonText>Clear</ButtonText>
            </Button>
            <Button
              variant="solid"
              size="lg"
              onPress={handleApply}
              className="flex-1"
            >
              <ButtonText>Apply</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
