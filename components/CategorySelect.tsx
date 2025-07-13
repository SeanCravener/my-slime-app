import React from "react";
import { Controller, Control, FieldValues, FieldPath } from "react-hook-form";
import { useCategories } from "@/hooks/useCategories";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";

interface CategorySelectProps<T extends FieldValues = any> {
  control: Control<T>;
  name?: FieldPath<T>;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
}

export const CategorySelect = <T extends FieldValues = any>({
  control,
  name = "category_id" as FieldPath<T>,
  label = "Category",
  disabled = false,
  required = false,
  helpText,
}: CategorySelectProps<T>) => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <FormControl isDisabled={disabled}>
        <FormControlLabel>
          <Text size="sm" className="font-medium text-foreground">
            {label}
            {required && <Text className="text-destructive"> *</Text>}
          </Text>
        </FormControlLabel>
        <Box className="py-4 items-center">
          <Spinner size="small" />
          <Text size="sm" className="text-muted-foreground mt-2">
            Loading categories...
          </Text>
        </Box>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl isInvalid>
        <FormControlLabel>
          <Text size="sm" className="font-medium text-foreground">
            {label}
            {required && <Text className="text-destructive"> *</Text>}
          </Text>
        </FormControlLabel>
        <Box className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <Text size="sm" className="text-destructive">
            Failed to load categories. Please try again.
          </Text>
        </Box>
      </FormControl>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <FormControl isDisabled={disabled}>
        <FormControlLabel>
          <Text size="sm" className="font-medium text-foreground">
            {label}
            {required && <Text className="text-destructive"> *</Text>}
          </Text>
        </FormControlLabel>
        <Text size="sm" className="text-muted-foreground">
          No categories available
        </Text>
      </FormControl>
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange },
        fieldState: { error: fieldError },
      }) => (
        <FormControl isInvalid={!!fieldError} isDisabled={disabled}>
          <FormControlLabel>
            <Text size="sm" className="font-medium text-foreground mb-2">
              {label}
              {required && <Text className="text-destructive"> *</Text>}
            </Text>
          </FormControlLabel>

          {helpText && (
            <FormControlHelper>
              <FormControlHelperText>
                <Text size="sm" className="text-muted-foreground">
                  {helpText}
                </Text>
              </FormControlHelperText>
            </FormControlHelper>
          )}

          {/* Category Pills */}
          <Box className="flex-row flex-wrap gap-2 mt-2">
            {categories.map((category) => {
              const selected = value === category.id;
              return (
                <Button
                  key={category.id}
                  variant={selected ? "solid" : "outline"}
                  size="sm"
                  onPress={disabled ? undefined : () => onChange(category.id)}
                  isDisabled={disabled}
                  className={`rounded-full ${
                    fieldError ? "border-destructive" : ""
                  }`}
                >
                  <ButtonText
                    size="sm"
                    className={
                      selected ? "text-primary-foreground" : "text-foreground"
                    }
                  >
                    {category.category}
                  </ButtonText>
                </Button>
              );
            })}
          </Box>

          {fieldError && (
            <FormControlError>
              <FormControlErrorText>{fieldError.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      )}
    />
  );
};
