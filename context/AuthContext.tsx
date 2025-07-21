// context/AuthContext.tsx - Complete updated file
import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useCallback,
} from "react";
import { Session, AuthChangeEvent, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  session: Session | null;
  user: Session["user"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    confirmPassword?: string
  ) => Promise<void>;
  signUpWithUsername: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

interface AuthState {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    isLoading: true,
  });

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session fetch error:", error);
          // Don't throw here, just log and continue
        }

        if (isMounted) {
          setAuthState({ session, isLoading: false });
        }
      } catch (error) {
        console.error("Unexpected session error:", error);
        if (isMounted) {
          setAuthState({ session: null, isLoading: false });
        }
      }
    };

    initSession();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (isMounted) {
        setAuthState((prevState) => ({ ...prevState, session }));

        // Clear favorites cache on auth changes
        if (event === "SIGNED_OUT") {
          queryClient.removeQueries({ queryKey: ["favorites"] });
          queryClient.removeQueries({ queryKey: ["items", "favorited"] });
        } else if (event === "SIGNED_IN") {
          queryClient.invalidateQueries({ queryKey: ["favorites"] });
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Input validation
    if (!email?.trim() || !password?.trim()) {
      throw new Error("Email and password are required");
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // Map Supabase errors to user-friendly messages
        const friendlyError = mapAuthError(error);
        throw new Error(friendlyError);
      }

      // Session will be updated via onAuthStateChange
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, confirmPassword?: string) => {
      // Input validation
      if (!email?.trim() || !password?.trim()) {
        throw new Error("Email and password are required");
      }

      if (confirmPassword && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          const friendlyError = mapAuthError(error);
          throw new Error(friendlyError);
        }

        // For email confirmation flow
        if (data.user && !data.session) {
          throw new Error(
            "Please check your email and click the confirmation link"
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }
    },
    []
  );

  const signUpWithUsername = useCallback(
    async (email: string, password: string, username: string) => {
      // Input validation
      if (!email?.trim() || !password?.trim() || !username?.trim()) {
        throw new Error("Email, password, and username are required");
      }

      try {
        // Create auth user
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          const friendlyError = mapAuthError(error);
          throw new Error(friendlyError);
        }

        // Update profile with username
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              username: username.trim(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.user.id);

          if (profileError) {
            console.error("Error updating profile:", profileError);
            // Don't throw here, the user is created successfully
          }
        }

        // For email confirmation flow
        if (data.user && !data.session) {
          throw new Error(
            "Please check your email and click the confirmation link"
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw new Error("Failed to sign out");
      }
      // Session will be updated via onAuthStateChange, which will trigger redirect
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
    router.replace("/");
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!email?.trim()) {
      throw new Error("Email is required");
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        const friendlyError = mapAuthError(error);
        throw new Error(friendlyError);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }, []);

  const value: AuthContextType = {
    session: authState.session,
    user: authState.session?.user ?? null,
    isLoading: authState.isLoading,
    isAuthenticated: !!authState.session?.user,
    signIn,
    signUp,
    signUpWithUsername,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Helper function to map auth errors to user-friendly messages
function mapAuthError(error: AuthError): string {
  switch (error.message) {
    case "Invalid login credentials":
      return "Invalid email or password";
    case "Email not confirmed":
      return "Please confirm your email address";
    case "User already registered":
      return "An account with this email already exists";
    case "Password should be at least 6 characters":
      return "Password must be at least 6 characters long";
    case "Signup disabled":
      return "New registrations are currently disabled";
    case "Email rate limit exceeded":
      return "Too many requests. Please wait before trying again";
    default:
      return error.message || "An error occurred during authentication";
  }
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
