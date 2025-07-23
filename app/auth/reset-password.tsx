import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
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
import { Controller } from "react-hook-form";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react-native";
import { Spinner } from "@/components/ui/spinner";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Check if we have a valid token from deep link
  useEffect(() => {
    const checkTokenStatus = () => {
      if (params.tokenValid === "true") {
        setTokenValid(true);
      } else if (params.error) {
        setError(params.error as string);
        setTokenValid(false);
      } else {
        // No deep link params, user navigated manually
        setTokenValid(false);
        setError(
          "Please use the reset link from your email to access this page."
        );
      }
    };

    checkTokenStatus();
  }, [params]);

  const handleBack = () => {
    router.replace("/auth");
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await updatePassword(data.password);

      setIsSuccess(true);

      // Redirect to login after success
      setTimeout(() => {
        router.replace("/auth");
      }, 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    router.replace("/auth/forgot-password");
  };

  // Loading state
  if (tokenValid === null) {
    return (
      <Box className="flex-1 bg-background">
        <Box className="flex-1 justify-center items-center px-6">
          <VStack space="lg" className="items-center">
            <Spinner size="large" />
            <Text className="text-lg font-medium text-foreground">
              Checking reset link...
            </Text>
          </VStack>
        </Box>
      </Box>
    );
  }

  // Error state for invalid tokens
  if (!tokenValid || (error && !isSuccess)) {
    return (
      <ScrollView className="flex-1 bg-background">
        <Box className="flex-1 px-6 py-12">
          <VStack space="xl" className="flex-1 justify-center max-w-sm mx-auto">
            <VStack space="lg" className="items-center">
              <Box className="w-20 h-20 bg-red-100 rounded-full items-center justify-center">
                <Text className="text-3xl">❌</Text>
              </Box>

              <VStack space="sm" className="items-center">
                <Heading size="xl" className="text-foreground text-center">
                  Invalid Reset Link
                </Heading>
                <Text className="text-muted-foreground text-center text-base">
                  {error ||
                    "Please use the reset link from your email to access this page."}
                </Text>
              </VStack>
            </VStack>

            <VStack space="sm">
              <Button
                variant="solid"
                size="lg"
                onPress={handleRequestNewLink}
                className="w-full"
              >
                <ButtonText className="text-primary-foreground font-medium">
                  Request New Reset Link
                </ButtonText>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onPress={handleBack}
                className="w-full"
              >
                <ButtonText className="text-primary font-medium">
                  Back to Login
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <ScrollView className="flex-1 bg-background">
        <Box className="flex-1 px-6 py-12">
          <VStack space="xl" className="flex-1 justify-center max-w-sm mx-auto">
            <VStack space="lg" className="items-center">
              <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <CheckCircle size={40} color="#10B981" />
              </Box>

              <VStack space="sm" className="items-center">
                <Heading size="xl" className="text-foreground text-center">
                  Password Updated!
                </Heading>
                <Text className="text-muted-foreground text-center text-base">
                  Your password has been successfully updated. You can now log
                  in with your new password.
                </Text>
              </VStack>
            </VStack>

            <Text className="text-muted-foreground text-center text-sm">
              Redirecting to login in 3 seconds...
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    );
  }

  // Main reset password form
  return (
    <ScrollView className="flex-1 bg-background">
      <Box className="flex-1 px-6 py-12">
        <VStack space="xl" className="flex-1 justify-center max-w-sm mx-auto">
          {/* Header */}
          <VStack space="lg">
            <Box className="self-start">
              <Pressable onPress={handleBack} hitSlop={8}>
                <ArrowLeft size={24} color="#000000" />
              </Pressable>
            </Box>

            <VStack space="sm">
              <Heading size="xl" className="text-foreground">
                Create New Password
              </Heading>
              <Text className="text-muted-foreground text-base">
                Enter your new password below.
              </Text>
            </VStack>
          </VStack>

          {/* Success indicator */}
          <Box className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Text className="text-sm font-medium text-green-900">
              ✅ Reset link verified successfully!
            </Text>
            <Text className="text-xs text-green-800 mt-1">
              You can now set your new password below.
            </Text>
          </Box>

          {/* Form */}
          <VStack space="lg">
            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <FormControl isInvalid={!!errors.password}>
                  <FormControlLabel>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      New Password
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="lg"
                    isInvalid={!!errors.password}
                  >
                    <InputSlot className="pl-3">
                      <InputIcon as={Lock} className="text-muted-foreground" />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your new password"
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      className="text-foreground"
                    />
                    <InputSlot className="pr-3">
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={8}
                      >
                        <InputIcon
                          as={showPassword ? EyeOff : Eye}
                          className="text-muted-foreground"
                        />
                      </Pressable>
                    </InputSlot>
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.password?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormControlLabel>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="lg"
                    isInvalid={!!errors.confirmPassword}
                  >
                    <InputSlot className="pl-3">
                      <InputIcon as={Lock} className="text-muted-foreground" />
                    </InputSlot>
                    <InputField
                      placeholder="Confirm your new password"
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      className="text-foreground"
                    />
                    <InputSlot className="pr-3">
                      <Pressable
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        hitSlop={8}
                      >
                        <InputIcon
                          as={showConfirmPassword ? EyeOff : Eye}
                          className="text-muted-foreground"
                        />
                      </Pressable>
                    </InputSlot>
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.confirmPassword?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* Error Display */}
            {error && tokenValid && (
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
                {isLoading ? "Updating Password..." : "Update Password"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
