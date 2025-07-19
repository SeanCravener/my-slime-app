import { useEffect, useRef } from "react";
import { useRouter, type Href } from "expo-router";
import { useAuth } from "@/context/AuthContext";

interface UseRequireAuthOptions {
  redirectTo?: Href;
  enabled?: boolean;
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { redirectTo = "/auth", enabled = true } = options;
  const { isAuthenticated, isLoading, session } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Redirect unauthenticated users
    if (enabled && !isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;

      // Defer redirect to avoid render conflicts
      setTimeout(() => {
        router.replace(redirectTo);
      }, 0);
    }

    // Reset redirect flag when user becomes authenticated
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
