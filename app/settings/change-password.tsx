import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
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

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { updatePassword, signIn, user } = useAuth();
  const { shouldRender, isLoading: authLoading } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Auth loading state
  if (authLoading) {
    return (
      <Box className="flex-1 items-center justify-center px-6">
        <VStack space="md" className="items-center">
          <Text className="text-lg text-muted-foreground">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  // Not authenticated
  if (!shouldRender) {
    return null;
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // First verify the current password by attempting to sign in
      if (user?.email) {
        try {
          await signIn(user.email, data.currentPassword);
        } catch (signInError) {
          throw new Error("Current password is incorrect");
        }
      }

      // Update to new password
      await updatePassword(data.newPassword);

      setIsSuccess(true);
      reset(); // Clear form

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
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

            <VStack space="lg" className="items-center">
              <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <CheckCircle size={40} color="#10B981" />
              </Box>

              <VStack space="sm" className="items-center">
                <Heading size="xl" className="text-foreground text-center">
                  Password Updated!
                </Heading>
                <Text className="text-muted-foreground text-center text-base">
                  Your password has been successfully updated. You're still
                  logged in.
                </Text>
              </VStack>
            </VStack>

            <Button
              variant="solid"
              size="lg"
              onPress={handleBack}
              className="w-full"
            >
              <ButtonText className="text-primary-foreground font-medium">
                Done
              </ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    );
  }

  // Main form
  return (
    <ScrollView className="flex-1 bg-background">
      <Box className="flex-1 px-6 py-12">
        <VStack space="xl" className="flex-1 max-w-sm mx-auto">
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
                Change Password
              </Heading>
              <Text className="text-muted-foreground text-base">
                Enter your current password and choose a new one.
              </Text>
            </VStack>
          </VStack>

          {/* Form */}
          <VStack space="lg">
            {/* Current Password Field */}
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <FormControl isInvalid={!!errors.currentPassword}>
                  <FormControlLabel>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      Current Password
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="lg"
                    isInvalid={!!errors.currentPassword}
                  >
                    <InputSlot className="pl-3">
                      <InputIcon as={Lock} className="text-muted-foreground" />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your current password"
                      secureTextEntry={!showCurrentPassword}
                      autoComplete="current-password"
                      textContentType="password"
                      value={value || ""}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isLoading}
                      className="text-foreground"
                    />
                    <InputSlot className="pr-3">
                      <Pressable
                        onPress={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        hitSlop={8}
                      >
                        <InputIcon
                          as={showCurrentPassword ? EyeOff : Eye}
                          className="text-muted-foreground"
                        />
                      </Pressable>
                    </InputSlot>
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.currentPassword?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            />

            {/* New Password Field */}
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <FormControl isInvalid={!!errors.newPassword}>
                  <FormControlLabel>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      New Password
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="lg"
                    isInvalid={!!errors.newPassword}
                  >
                    <InputSlot className="pl-3">
                      <InputIcon as={Lock} className="text-muted-foreground" />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your new password"
                      secureTextEntry={!showNewPassword}
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
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        hitSlop={8}
                      >
                        <InputIcon
                          as={showNewPassword ? EyeOff : Eye}
                          className="text-muted-foreground"
                        />
                      </Pressable>
                    </InputSlot>
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.newPassword?.message}
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
                      Confirm New Password
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
                {isLoading ? "Updating Password..." : "Update Password"}
              </ButtonText>
            </Button>

            {/* Security Note */}
            <Box className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text className="text-xs text-blue-800">
                Choose a strong password with at least 8 characters, including
                uppercase, lowercase, numbers, and special characters.
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
