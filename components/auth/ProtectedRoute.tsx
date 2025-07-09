import { PropsWithChildren } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session } = useAuth();

  if (!session) {
    router.replace("/auth");
    return null; // Prevent rendering while redirecting
  }

  return <>{children}</>;
}
