import "@/global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Theme wrapper component that provides the current theme to GluestackUI
function ThemedApp() {
  const { activeTheme, isLoading } = useTheme();

  // Show loading spinner while theme is being loaded
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <GluestackUIProvider mode={activeTheme}>
      <QueryProvider>
        <AuthProvider>
          <SafeAreaView
            style={{ flex: 1 }}
            edges={["top", "left", "right", "bottom"]}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="item" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="legal" options={{ headerShown: false }} />
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
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
