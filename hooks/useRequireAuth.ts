// hooks/useRequireAuth.ts
import { useEffect, useRef } from "react";
import { useRouter, type Href } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface UseRequireAuthOptions {
  redirectTo?: Href;
  enabled?: boolean;
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { redirectTo = "/auth", enabled = true } = options;
  const { isAuthenticated, isLoading, session } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Reset redirect flag when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      hasRedirected.current = false;
    }, [])
  );

  useEffect(() => {
    if (enabled && !isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => {
        router.push(redirectTo);
      }, 0);
    }

    if (isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isLoading, isAuthenticated, router, redirectTo, enabled]);

  return {
    isAuthenticated,
    isLoading,
    session,
    shouldRender: !isLoading && isAuthenticated && !!session,
  };
};
