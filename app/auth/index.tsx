import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { ProgressiveAuthFlow } from "@/components/auth/ProgressiveAuthFlow";

// useEffect set up to solve problem with the bottom bar Android Back Button
// TODO: Figure out and fix Android back button issue
export default function AuthScreen() {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.replace("/(tabs)"); // Go to home tab, not back to protected tab
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [router]);

  return <ProgressiveAuthFlow />;
}
