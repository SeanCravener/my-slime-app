import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthFlowContainer } from "../AuthFlowContainer";
import { createPasswordSchema, CreatePasswordSchema } from "@/schemas/auth";

interface CreatePasswordStepProps {
  onSubmit: (password: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

export const CreatePasswordStep: React.FC<CreatePasswordStepProps> = ({
  onSubmit,
  onBack,
  isLoading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePasswordSchema>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: CreatePasswordSchema) => {
    await onSubmit(data.password);
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <AuthFlowContainer title="Create a password" onBack={onBack}>
      <VStack space="lg" className="flex-1">
        <PasswordField
          control={control}
          errors={errors}
          name="password"
          label="Password"
          placeholder="Create a secure password"
          isDisabled={isFormLoading}
        />

        <PasswordField
          control={control}
          errors={errors}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          isDisabled={isFormLoading}
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
            {isFormLoading ? "Creating account..." : "Continue"}
          </ButtonText>
        </Button>
      </VStack>
    </AuthFlowContainer>
  );
};
