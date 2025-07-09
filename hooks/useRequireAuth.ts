import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Replace current route with auth, so back button works correctly
      router.replace("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  return { isAuthenticated, isLoading };
};
