import React from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { ArrowLeft } from "lucide-react-native";
import { useAuthFlow } from "@/hooks/useAuthFlow";

interface AuthFlowContainerProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  children: React.ReactNode;
  onBack?: () => void;
}

export const AuthFlowContainer: React.FC<AuthFlowContainerProps> = ({
  title,
  subtitle,
  showBackButton = true,
  children,
  onBack,
}) => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: 60,
        paddingBottom: 40,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <VStack space="xl" className="px-6 mb-8">
        {/* Back Button */}
        {showBackButton && (
          <Box className="self-start">
            <Pressable
              onPress={onBack}
              hitSlop={8}
              className="w-10 h-10 rounded-full bg-muted/20 items-center justify-center"
            >
              <ArrowLeft size={20} color="#000000" />
            </Pressable>
          </Box>
        )}

        {/*  Logo Placeholder */}
        <Box className="items-center">
          <Box className="w-12 h-12 bg-green-500 rounded-lg items-center justify-center mb-6">
            {/* Replace with your actual logo */}
            <Text className="text-white font-bold text-lg">A</Text>
          </Box>
        </Box>

        {/* Title */}
        <VStack space="sm" className="items-center">
          <Text className="text-2xl font-bold text-foreground text-center">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-muted-foreground text-center text-base">
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>

      {/* Content */}
      <Box className="flex-1 px-6">{children}</Box>
    </ScrollView>
  );
};
