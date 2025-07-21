import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { AuthFlowContainer } from "../AuthFlowContainer";
import { usernameSchema, UsernameSchema } from "@/schemas/auth";

interface UsernameStepProps {
  onSubmit: (username: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

export const UsernameStep: React.FC<UsernameStepProps> = ({
  onSubmit,
  onBack,
  isLoading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsernameSchema>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: UsernameSchema) => {
    await onSubmit(data.username);
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <AuthFlowContainer title="Enter your name" onBack={onBack}>
      <VStack space="lg" className="flex-1">
        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.username}>
              <Text className="text-sm font-medium text-foreground mb-2">
                Username
              </Text>
              <Input variant="outline" size="lg" isInvalid={!!errors.username}>
                <InputField
                  placeholder="Enter your username"
                  value={value || ""}
                  onChangeText={onChange}
                  editable={!isFormLoading}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {errors.username?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />

        {/* Error Display */}
        {error && (
          <Text className="text-destructive text-sm text-center">{error}</Text>
        )}

        <Button
          variant="solid"
          size="lg"
          onPress={handleSubmit(handleFormSubmit)}
          isDisabled={isFormLoading}
          className="w-full mt-auto"
        >
          <ButtonText className="text-primary-foreground font-medium">
            {isFormLoading ? "Setting up account..." : "Finish"}
          </ButtonText>
        </Button>
      </VStack>
    </AuthFlowContainer>
  );
};
