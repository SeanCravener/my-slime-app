import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { PasswordField } from "@/components/auth/PasswordField";
import { AuthFlowContainer } from "../AuthFlowContainer";
import { passwordSchema, PasswordSchema } from "@/schemas/auth";

interface WelcomeBackStepProps {
  email: string;
  onSubmit: (password: string) => Promise<void>;
  onBack: () => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  error?: string;
}

export const WelcomeBackStep: React.FC<WelcomeBackStepProps> = ({
  email,
  onSubmit,
  onBack,
  onForgotPassword,
  isLoading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: PasswordSchema) => {
    await onSubmit(data.password);
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <AuthFlowContainer title="Welcome back" onBack={onBack}>
      <VStack space="lg" className="flex-1">
        <PasswordField
          control={control}
          errors={errors}
          name="password"
          label="Password"
          placeholder="Enter your password"
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
          className="w-full"
        >
          <ButtonText className="text-primary-foreground font-medium">
            {isFormLoading ? "Signing in..." : "Continue"}
          </ButtonText>
        </Button>

        <Pressable
          onPress={onForgotPassword}
          disabled={isFormLoading}
          className="self-center mt-4"
        >
          <Text className="text-primary font-medium">Forgot password</Text>
        </Pressable>
      </VStack>
    </AuthFlowContainer>
  );
};
