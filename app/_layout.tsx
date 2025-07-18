import "@/global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <QueryProvider>
          <AuthProvider>
            <SafeAreaView
              style={{ flex: 1 }}
              edges={["top", "left", "right", "bottom"]}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="auth"
                  options={{ headerShown: true, presentation: "modal" }}
                />
              </Stack>
            </SafeAreaView>
          </AuthProvider>
        </QueryProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
