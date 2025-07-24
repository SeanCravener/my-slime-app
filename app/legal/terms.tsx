import React from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";

export default function TermsScreen() {
  const lastUpdated = "July 24, 2025";
  const appName = "My Slime App";
  const contactEmail = "support@support.com"; // Need to change to my actual email

  return (
    <ScrollView className="flex-1 bg-background">
      <Box className="px-6 py-6">
        <VStack space="lg">
          {/* Header */}
          <VStack space="sm">
            <Heading size="xl" className="text-foreground">
              Terms of Service
            </Heading>
            <Text className="text-muted-foreground">
              Last updated: {lastUpdated}
            </Text>
          </VStack>

          <Divider />

          {/* Content */}
          <VStack space="md">
            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                1. Acceptance of Terms
              </Heading>
              <Text className="text-foreground leading-relaxed">
                By using {appName}, you agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use
                the app.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                2. Description of Service
              </Heading>
              <Text className="text-foreground leading-relaxed">
                {appName} is a recipe sharing platform that allows users to
                create, share, and discover recipes. Users can upload their own
                recipes, browse recipes from other users, and save favorites.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                3. User Accounts
              </Heading>
              <Text className="text-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You must provide accurate information when creating
                your account.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                4. User Content
              </Heading>
              <Text className="text-foreground leading-relaxed">
                You retain ownership of content you post. By posting content,
                you grant us a license to display and distribute your content
                within the app. You are responsible for ensuring your content
                doesn't violate any laws or third-party rights.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                5. Prohibited Uses
              </Heading>
              <Text className="text-foreground leading-relaxed">
                You may not use the app to post inappropriate, harmful, or
                illegal content. This includes but is not limited to spam,
                harassment, copyrighted material, or dangerous recipes.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                6. Privacy
              </Heading>
              <Text className="text-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect and use your information.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                7. Limitation of Liability
              </Heading>
              <Text className="text-foreground leading-relaxed">
                The app is provided "as is" without warranties. We are not
                liable for any damages arising from your use of the app. Always
                use common sense when following recipes and cooking
                instructions.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                8. Changes to Terms
              </Heading>
              <Text className="text-foreground leading-relaxed">
                We may update these terms from time to time. Continued use of
                the app after changes constitutes acceptance of the new terms.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                9. Contact Information
              </Heading>
              <Text className="text-foreground leading-relaxed">
                If you have questions about these Terms of Service, please
                contact us at {contactEmail}.
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
