import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignInSchema,
  SignUpSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/schemas";
import { EmailField } from "@/components/auth/EmailField";
import { PasswordField } from "@/components/auth/PasswordField";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";

interface AuthFormProps {
  mode: "signIn" | "signUp";
  onSubmit: (data: SignInSchema | SignUpSchema) => Promise<void>;
  isLoading: boolean;
  error?: Error | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  isLoading,
  error,
}) => {
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mode === "signIn" ? signInSchema : signUpSchema),
    defaultValues:
      mode === "signIn"
        ? { email: "", password: "" }
        : { email: "", password: "", confirmPassword: "" },
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleSubmitForm = async (data: any) => {
    await onSubmit(data);
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    console.log("Forgot password clicked");
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <VStack space="lg" className="px-6 flex-1">
      {/* Email Field */}
      <EmailField
        control={control}
        errors={errors}
        isDisabled={isFormLoading}
      />

      {/* Password Field */}
      <PasswordField
        control={control}
        errors={errors}
        name="password"
        label="Password"
        placeholder="Enter your password"
        isDisabled={isFormLoading}
      />

      {/* Confirm Password Field (Sign Up Only) */}
      {mode === "signUp" && (
        <PasswordField
          control={control}
          errors={errors}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          isDisabled={isFormLoading}
        />
      )}

      {/* Sign In extras */}
      {mode === "signIn" && (
        <HStack space="md" className="justify-between items-center">
          <Checkbox
            value="remember"
            isChecked={rememberMe}
            onChange={setRememberMe}
            isDisabled={isFormLoading}
            size="sm"
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>
              <Text className="text-sm text-muted-foreground ml-2">
                Remember me
              </Text>
            </CheckboxLabel>
          </Checkbox>

          <Pressable onPress={handleForgotPassword} disabled={isFormLoading}>
            <Text
              className={`text-sm font-medium ${
                isFormLoading ? "text-muted-foreground" : "text-primary"
              }`}
            >
              Forgot Password?
            </Text>
          </Pressable>
        </HStack>
      )}

      {/* Error Display */}
      {error && (
        <Box className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <Text className="text-destructive text-sm text-center">
            {error.message || "An error occurred"}
          </Text>
        </Box>
      )}

      {/* Submit Button */}
      <Button
        variant="solid"
        size="lg"
        onPress={handleSubmit(handleSubmitForm)}
        isDisabled={isFormLoading}
        className="w-full mt-4"
      >
        <ButtonText className="text-primary-foreground font-medium">
          {isFormLoading
            ? mode === "signIn"
              ? "Signing in..."
              : "Signing up..."
            : mode === "signIn"
            ? "Sign In"
            : "Sign Up"}
        </ButtonText>
      </Button>

      {/* Additional Sign Up Info */}
      {mode === "signUp" && (
        <Text className="text-xs text-muted-foreground text-center px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      )}
    </VStack>
  );
};
