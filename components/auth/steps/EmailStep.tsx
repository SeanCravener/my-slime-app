import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { EmailField } from "@/components/auth/EmailField";
import { AuthFlowContainer } from "../AuthFlowContainer";
import { emailSchema, EmailSchema } from "@/schemas/auth";

interface EmailStepProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  defaultEmail?: string;
}

export const EmailStep: React.FC<EmailStepProps> = ({
  onSubmit,
  onBack,
  isLoading,
  defaultEmail = "",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: defaultEmail },
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: EmailSchema) => {
    await onSubmit(data.email);
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <AuthFlowContainer title="Let's start with email" onBack={onBack}>
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
            {isFormLoading ? "Checking..." : "Continue"}
          </ButtonText>
        </Button>
      </VStack>
    </AuthFlowContainer>
  );
};
