import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AuthFlowContainer } from "../AuthFlowContainer";

interface CheckEmailStepProps {
  email: string;
  onContinue: () => void;
  onBack: () => void;
}

export const CheckEmailStep: React.FC<CheckEmailStepProps> = ({
  email,
  onContinue,
  onBack,
}) => {
  return (
    <AuthFlowContainer title="Check your email" onBack={onBack}>
      <VStack space="lg" className="flex-1 justify-center items-center">
        <Text className="text-center text-muted-foreground text-base px-4">
          We sent an email to {email} to help you log in.
        </Text>

        <Button
          variant="solid"
          size="lg"
          onPress={onContinue}
          className="w-full mt-8"
        >
          <ButtonText className="text-primary-foreground font-medium">
            Log in
          </ButtonText>
        </Button>
      </VStack>
    </AuthFlowContainer>
  );
};
