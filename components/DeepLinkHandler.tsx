import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";

export const DeepLinkHandler = () => {
  const router = useRouter();

  useEffect(() => {
    // Handle initial URL when app opens from a deep link
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle URL when app is already open and receives a deep link
    const handleURLChange = (event: { url: string }) => {
      handleDeepLink(event.url);
    };

    const handleDeepLink = async (url: string) => {
      console.log("Received deep link:", url);

      // Check if this is a password reset link
      if (url.includes("reset-password")) {
        // Parse the URL - Supabase uses # instead of ? for parameters
        const urlParts = url.split("#");
        if (urlParts.length > 1) {
          const params = new URLSearchParams(urlParts[1]);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          const type = params.get("type");

          console.log("Parsed params:", { accessToken, refreshToken, type });

          if (accessToken && refreshToken && type === "recovery") {
            try {
              // Set the session with the tokens
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (error) {
                console.error("Session error:", error);
                router.push({
                  pathname: "/auth/reset-password",
                  params: { error: "Invalid or expired reset link" },
                });
                return;
              }

              console.log(
                "Session set successfully, navigating to reset screen"
              );
              // Navigate to reset password screen with success flag
              router.push({
                pathname: "/auth/reset-password",
                params: { tokenValid: "true" },
              });
            } catch (err) {
              console.error("Deep link error:", err);
              router.push({
                pathname: "/auth/reset-password",
                params: { error: "Failed to process reset link" },
              });
            }
          } else {
            console.log("Missing required parameters");
            router.push({
              pathname: "/auth/reset-password",
              params: { error: "Invalid reset link format" },
            });
          }
        }
      }
    };

    handleInitialURL();

    // Listen for incoming links
    const subscription = Linking.addEventListener("url", handleURLChange);

    return () => subscription?.remove();
  }, [router]);

  return null; // This component doesn't render anything
};
