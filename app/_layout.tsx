import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <QueryProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  title: "Home",
                  headerShown: false,
                }}
              />
            </Stack>
          </FavoritesProvider>
        </AuthProvider>
      </QueryProvider>
    </GluestackUIProvider>
  );
}
