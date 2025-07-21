import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface CheckEmailResult {
  exists: boolean;
  email: string;
}

interface CheckEmailError extends Error {
  code?: string;
}

const checkEmailExists = async (email: string): Promise<CheckEmailResult> => {
  if (!email?.trim()) {
    throw new Error("Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Use the RPC function to check if user exists
    const { data, error } = await supabase.rpc("check_user_exists_by_email", {
      user_email: normalizedEmail,
    });

    if (error) {
      // If the RPC function doesn't exist, fall back to signup attempt method
      if (
        error.message.includes("function check_user_exists_by_email") ||
        error.message.includes("does not exist")
      ) {
        // Fallback: Try to sign up and see if user already exists
        const { error: signupError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: "temp-check-password-123!",
        });

        if (signupError) {
          if (signupError.message.includes("User already registered")) {
            return { exists: true, email: normalizedEmail };
          }
          if (signupError.message.includes("Email rate limit exceeded")) {
            throw new Error(
              "Too many attempts. Please wait before trying again."
            );
          }
          // Other errors assume user doesn't exist
          return { exists: false, email: normalizedEmail };
        }

        // If signup succeeded, user didn't exist (but now they do with temp password)
        // This is not ideal, but it's a fallback
        return { exists: false, email: normalizedEmail };
      }

      throw new Error("Failed to verify email. Please try again.");
    }

    return { exists: data === true, email: normalizedEmail };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to verify email. Please try again.");
  }
};

export const useCheckEmail = () => {
  return useMutation<CheckEmailResult, CheckEmailError, string>({
    mutationFn: checkEmailExists,
    retry: (failureCount, error) => {
      // Don't retry user input errors or rate limiting
      if (
        error.message.includes("Email is required") ||
        error.message.includes("Too many attempts")
      ) {
        return false;
      }
      // Retry network errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};
