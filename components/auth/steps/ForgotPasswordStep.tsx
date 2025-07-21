import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { EmailField } from "@/components/auth/EmailField";
import { AuthFlowContainer } from "../AuthFlowContainer";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/schemas/auth";

interface ForgotPasswordStepProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  defaultEmail?: string;
}

export const ForgotPasswordStep: React.FC<ForgotPasswordStepProps> = ({
  onSubmit,
  onBack,
  isLoading,
  defaultEmail = "",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: defaultEmail },
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: ForgotPasswordSchema) => {
    await onSubmit(data.email);
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <AuthFlowContainer
      title="Forgot your password?"
      subtitle="A password reset link will be sent to your email."
      onBack={onBack}
    >
      <VStack space="lg" className="flex-1">
        <EmailField
          control={control}
          errors={errors}
          isDisabled={isFormLoading}
        />

        <Button
          variant="solid"
          size="lg"
          onPress={handleSubmit(handleFormSubmit)}
          isDisabled={isFormLoading}
          className="w-full mt-auto"
        >
          <ButtonText className="text-primary-foreground font-medium">
            {isFormLoading ? "Sending..." : "Send email"}
          </ButtonText>
        </Button>
      </VStack>
    </AuthFlowContainer>
  );
};
