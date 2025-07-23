import "@/global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";
import { DeepLinkHandler } from "@/components/DeepLinkHandler";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <QueryProvider>
          <AuthProvider>
            <DeepLinkHandler />
            <SafeAreaView
              style={{ flex: 1 }}
              edges={["top", "left", "right", "bottom"]}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="item" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen
                  name="+not-found"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </SafeAreaView>
          </AuthProvider>
        </QueryProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
