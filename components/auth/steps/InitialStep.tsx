import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AuthFlowContainer } from "../AuthFlowContainer";

interface InitialStepProps {
  onEmailSignIn: () => void;
  onGoogleSignIn?: () => void;
  onFacebookSignIn?: () => void;
  onBack?: () => void;
  isLoading: boolean;
}

export const InitialStep: React.FC<InitialStepProps> = ({
  onEmailSignIn,
  onGoogleSignIn,
  onFacebookSignIn,
  onBack,
  isLoading,
}) => {
  return (
    <AuthFlowContainer
      title="Sign up or log in"
      subtitle="to start exploring"
      showBackButton={!!onBack}
      onBack={onBack}
    >
      <VStack space="lg" className="flex-1 justify-center">
        {/* Google Sign In */}
        <Button
          variant="solid"
          size="lg"
          onPress={onGoogleSignIn}
          isDisabled={isLoading || !onGoogleSignIn}
          className="w-full bg-blue-600"
        >
          <ButtonText className="text-white font-medium">
            Continue with Google
          </ButtonText>
        </Button>

        {/* Facebook Sign In */}
        <Button
          variant="solid"
          size="lg"
          onPress={onFacebookSignIn}
          isDisabled={isLoading || !onFacebookSignIn}
          className="w-full bg-blue-800"
        >
          <ButtonText className="text-white font-medium">
            Continue with Facebook
          </ButtonText>
        </Button>

        {/* Divider */}
        <Text className="text-center text-muted-foreground">or</Text>

        {/* Email Sign In */}
        <Button
          variant="outline"
          size="lg"
          onPress={onEmailSignIn}
          isDisabled={isLoading}
          className="w-full"
        >
          <ButtonText className="text-foreground font-medium">
            Continue with email
          </ButtonText>
        </Button>

        {/* Terms */}
        <Text className="text-xs text-muted-foreground text-center mt-8 px-4">
          By continuing to use PlaceHolderTEXT, you agree to our Terms of
          Service and Privacy Policy. Personal data added to PlaceHolderTEXT is
          public by default — refer to our Privacy FAQ to make changes.
        </Text>
      </VStack>
    </AuthFlowContainer>
  );
};
