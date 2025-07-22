import React from "react";
import { Stack } from "expo-router";

// TODO: Figure out optimal settings for screen options, i.e. headershown, presentation, etc.
// TODO: Decide if this layout screen is needed and if I'm fine without it.
export default function ItemLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="[id]/edit"
        options={{
          headerShown: false,
          presentation: "modal",
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
