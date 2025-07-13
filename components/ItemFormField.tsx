import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Pressable } from "@/components/ui/pressable";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
// Type for Lucide icon names
type IconComponent = React.ComponentType<any>;

interface ItemFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  customOnChange?: (text: string) => void;
  required?: boolean;
  helpText?: string;
  leftIcon?: IconComponent;
  rightIcon?: IconComponent;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  disabled?: boolean;
}

export const ItemFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  multiline = false,
  customOnChange,
  required = false,
  helpText,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  disabled = false,
}: ItemFormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <FormControl isInvalid={!!error} isDisabled={disabled}>
          <VStack space="sm">
            {/* Label */}
            <FormControlLabel>
              <Text size="sm" className="font-medium text-foreground">
                {label}
                {required && <Text className="text-destructive"> *</Text>}
              </Text>
            </FormControlLabel>

            {/* Help Text */}
            {helpText && (
              <FormControlHelper>
                <FormControlHelperText>
                  <Text size="sm" className="text-muted-foreground">
                    {helpText}
                  </Text>
                </FormControlHelperText>
              </FormControlHelper>
            )}

            {/* Input Field */}
            {multiline ? (
              <Textarea>
                <TextareaInput
                  value={value || ""}
                  onChangeText={(text) => {
                    onChange(text);
                    customOnChange?.(text);
                  }}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  style={{ minHeight: 100 }}
                />
              </Textarea>
            ) : (
              <Input variant="outline">
                {/* Left Icon */}
                {leftIcon && (
                  <InputSlot className="pl-3">
                    {onLeftIconPress ? (
                      <Pressable onPress={onLeftIconPress}>
                        <InputIcon
                          as={leftIcon}
                          className="text-muted-foreground"
                        />
                      </Pressable>
                    ) : (
                      <InputIcon
                        as={leftIcon}
                        className="text-muted-foreground"
                      />
                    )}
                  </InputSlot>
                )}

                <InputField
                  value={value || ""}
                  onChangeText={(text) => {
                    onChange(text);
                    customOnChange?.(text);
                  }}
                  onBlur={onBlur}
                  placeholder={placeholder}
                />

                {/* Right Icon */}
                {rightIcon && (
                  <InputSlot className="pr-3">
                    {onRightIconPress ? (
                      <Pressable onPress={onRightIconPress}>
                        <InputIcon
                          as={rightIcon}
                          className="text-muted-foreground"
                        />
                      </Pressable>
                    ) : (
                      <InputIcon
                        as={rightIcon}
                        className="text-muted-foreground"
                      />
                    )}
                  </InputSlot>
                )}
              </Input>
            )}

            {/* Error Message */}
            {error && (
              <FormControlError>
                <FormControlErrorText>{error.message}</FormControlErrorText>
              </FormControlError>
            )}
          </VStack>
        </FormControl>
      )}
    />
  );
};
