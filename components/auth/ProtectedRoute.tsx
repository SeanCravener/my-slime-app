import { PropsWithChildren, useEffect } from "react";
import { router, type Href } from "expo-router";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: Href;
}

export function ProtectedRoute({
  children,
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're not loading and there's no session
    if (!isLoading && !session) {
      router.replace(redirectTo);
    }
  }, [session, isLoading, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null; // or a loading spinner component
  }

  // Don't render children if not authenticated
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
