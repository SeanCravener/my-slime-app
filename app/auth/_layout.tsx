import React from "react";
import { Stack } from "expo-router";

// TODO: Figure out optimal settings for screen options, i.e. headershown, presentation, etc.
// TODO: Decide if this layout screen is needed and if I'm fine without it.
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
