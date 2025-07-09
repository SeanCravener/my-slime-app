import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <QueryProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="auth"
                options={{ headerShown: false, presentation: "modal" }}
              />
            </Stack>
          </FavoritesProvider>
        </AuthProvider>
      </QueryProvider>
    </GluestackUIProvider>
  );
}
