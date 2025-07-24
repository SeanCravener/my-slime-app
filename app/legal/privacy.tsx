import React from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";

export default function PrivacyScreen() {
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
              Privacy Policy
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
                1. Information We Collect
              </Heading>
              <Text className="text-foreground leading-relaxed">
                We collect information you provide directly to us, such as:
                {"\n"}• Email address when you create an account
                {"\n"}• Username and profile information
                {"\n"}• Recipes, photos, and other content you post
                {"\n"}• Usage data and analytics to improve the app
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                2. How We Use Your Information
              </Heading>
              <Text className="text-foreground leading-relaxed">
                We use your information to:
                {"\n"}• Provide and maintain the app
                {"\n"}• Create and manage your account
                {"\n"}• Display your recipes to other users
                {"\n"}• Send important updates about the app
                {"\n"}• Improve our services and user experience
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                3. Information Sharing
              </Heading>
              <Text className="text-foreground leading-relaxed">
                We do not sell, trade, or share your personal information with
                third parties, except:
                {"\n"}• Content you choose to make public (recipes, usernames)
                {"\n"}• When required by law
                {"\n"}• With service providers who help us operate the app (like
                hosting services)
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                4. Data Security
              </Heading>
              <Text className="text-foreground leading-relaxed">
                We use industry-standard security measures to protect your
                information. However, no internet transmission is 100% secure,
                and we cannot guarantee absolute security.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                5. Your Rights
              </Heading>
              <Text className="text-foreground leading-relaxed">
                You have the right to:
                {"\n"}• Access and update your personal information
                {"\n"}• Delete your account and associated data
                {"\n"}• Request a copy of your data
                {"\n"}• Opt out of non-essential communications
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                6. Children's Privacy
              </Heading>
              <Text className="text-foreground leading-relaxed">
                Our app is not intended for children under 13. We do not
                knowingly collect personal information from children under 13.
                If you believe we have collected information from a child under
                13, please contact us.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                7. Third-Party Services
              </Heading>
              <Text className="text-foreground leading-relaxed">
                We use Supabase for authentication and data storage. Their
                privacy practices are governed by their own privacy policy. We
                may also use analytics services to improve the app.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                8. Changes to Privacy Policy
              </Heading>
              <Text className="text-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will
                notify you of significant changes by posting the new policy in
                the app.
              </Text>
            </VStack>

            <VStack space="sm">
              <Heading size="md" className="text-foreground">
                9. Contact Us
              </Heading>
              <Text className="text-foreground leading-relaxed">
                If you have questions about this Privacy Policy or want to
                exercise your rights, please contact us at {contactEmail}.
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
