import React, { ComponentProps } from "react";
import { useRouter } from "expo-router";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { FileText } from "lucide-react-native";

interface TermsButtonProp extends ComponentProps<typeof Button> {}

export const TermsButton: React.FC<TermsButtonProp> = ({
  variant = "outline",
  size = "md",
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/legal/terms");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handlePress}
      isDisabled={disabled ?? undefined}
      className="w-full"
    >
      <ButtonIcon as={FileText} size="sm" />
      <ButtonText className="text-primary">Terms and Conditions</ButtonText>
    </Button>
  );
};
