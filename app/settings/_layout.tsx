import React from "react";
import { Stack } from "expo-router";

// TODO: Figure out optimal settings for screen options, i.e. headershown, presentation, etc.
// TODO: Decide if this layout screen is needed and if I'm fine without it.
export default function SetttingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="advanced"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
