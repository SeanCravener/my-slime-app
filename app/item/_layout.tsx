// app/item/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function ItemLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false, // Let the component handle its own header
        }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{
          headerShown: false,
          presentation: "modal", // Nice for edit screens
        }}
      />
      <Stack.Screen
        name="[id]/instructions"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
