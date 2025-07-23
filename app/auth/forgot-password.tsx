import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
} from "@/components/ui/form-control";
import { Pressable } from "@/components/ui/pressable";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react-native";
import { Controller } from "react-hook-form";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((email) => email.toLowerCase().trim()),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/auth");
    }
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await resetPassword(data.email);

      setSentEmail(data.email);
      setEmailSent(true);
    } catch (err) {
      const error = err as Error;
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues("email");
    if (email) {
      await onSubmit({ email });
    }
  };

  const handleBackToLogin = () => {
    router.replace("/auth");
  };

  if (emailSent) {
    return (
      <ScrollView className="flex-1 bg-background">
        <Box className="flex-1 px-6 py-12">
          <VStack space="xl" className="flex-1 justify-center max-w-sm mx-auto">
            {/* Back Button */}
            <Box className="self-start">
              <Pressable onPress={handleBack} hitSlop={8}>
                <ArrowLeft size={24} color="#000000" />
              </Pressable>
            </Box>

            {/* Success Icon */}
            <VStack space="lg" className="items-center">
              <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <CheckCircle size={40} color="#10B981" />
              </Box>

              <VStack space="sm" className="items-center">
                <Heading size="xl" className="text-foreground text-center">
                  Check your email
                </Heading>
                <Text className="text-muted-foreground text-center text-base">
                  We sent a password reset link to
                </Text>
                <Text className="text-foreground font-medium text-center">
                  {sentEmail}
                </Text>
              </VStack>
            </VStack>

            {/* Instructions */}
            <VStack space="md">
              <Text className="text-muted-foreground text-center text-sm leading-relaxed">
                Didn't receive the email? Check your spam folder or try
                resending.
              </Text>

              <VStack space="sm">
                <Button
                  variant="outline"
                  size="lg"
                  onPress={handleResendEmail}
                  isDisabled={isLoading}
                  className="w-full"
                >
                  <ButtonText className="text-primary font-medium">
                    {isLoading ? "Sending..." : "Resend Email"}
                  </ButtonText>
                </Button>

                <Button
                  variant="solid"
                  size="lg"
                  onPress={handleBackToLogin}
                  className="w-full"
                >
                  <ButtonText className="text-primary-foreground font-medium">
                    Back to Login
                  </ButtonText>
                </Button>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Box className="flex-1 px-6 py-12">
        <VStack space="xl" className="flex-1 justify-center max-w-sm mx-auto">
          {/* Header */}
          <VStack space="lg">
            {/* Back Button */}
            <Box className="self-start">
              <Pressable onPress={handleBack} hitSlop={8}>
                <ArrowLeft size={24} color="#000000" />
              </Pressable>
            </Box>

            {/* Title */}
            <VStack space="sm">
              <Heading size="xl" className="text-foreground">
                Forgot your password?
              </Heading>
              <Text className="text-muted-foreground text-base">
                Don't worry! Enter your email address and we'll send you a link
                to reset your password.
              </Text>
            </VStack>
          </VStack>

          {/* Form */}
          <VStack space="lg">
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <FormControl isInvalid={!!errors.email}>
                  <FormControlLabel>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      Email Address
                    </Text>
                  </FormControlLabel>
                  <Input variant="outline" size="lg" isInvalid={!!errors.email}>
                    <InputSlot className="pl-3">
                      <InputIcon as={Mail} className="text-muted-foreground" />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      textContentType="emailAddress"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      className="text-foreground"
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.email?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Error Display */}
            {error && (
              <Box className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <Text className="text-destructive text-sm text-center">
                  {error}
                </Text>
              </Box>
            )}

            {/* Submit Button */}
            <Button
              variant="solid"
              size="lg"
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
              className="w-full"
            >
              <ButtonText className="text-primary-foreground font-medium">
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </ButtonText>
            </Button>

            {/* Back to Login */}
            <HStack space="sm" className="justify-center">
              <Text className="text-muted-foreground text-sm">
                Remember your password?
              </Text>
              <Pressable onPress={handleBackToLogin}>
                <Text className="text-primary text-sm font-medium">
                  Back to Login
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
