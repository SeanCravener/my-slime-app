import React from "react";
import { Stack } from "expo-router";

export default function LegalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms of Service",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
