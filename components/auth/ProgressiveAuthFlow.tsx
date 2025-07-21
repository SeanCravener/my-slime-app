import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useCheckEmail } from "@/hooks/useCheckEmail";
import { supabase } from "@/lib/supabase";

// Import all step components
import { InitialStep } from "./steps/InitialStep";
import { EmailStep } from "./steps/EmailStep";
import { WelcomeBackStep } from "./steps/WelcomeBackStep";
import { CreatePasswordStep } from "./steps/CreatePasswordStep";
import { UsernameStep } from "./steps/UsernameStep";
import { ForgotPasswordStep } from "./steps/ForgotPasswordStep";
import { CheckEmailStep } from "./steps/CheckEmailStep";

export const ProgressiveAuthFlow: React.FC = () => {
  const router = useRouter();
  const { signIn, signUpWithUsername } = useAuth();
  const {
    step,
    email,
    password,
    username,
    userExists,
    isLoading,
    setStep,
    setEmail,
    setPassword,
    setUsername,
    setUserExists,
    setLoading,
    resetFlow,
  } = useAuthFlow();

  // Use the email checking hook
  const {
    mutateAsync: checkEmail,
    isPending: isCheckingEmail,
    error: checkEmailError,
    reset: resetEmailCheck,
  } = useCheckEmail();

  const [error, setError] = useState<string | null>(null);

  // Helper to clear error when navigating
  const clearError = () => {
    setError(null);
    resetEmailCheck(); // Also reset email check errors
  };

  // Navigation handlers
  const handleBack = () => {
    clearError();
    switch (step) {
      case "email":
        setStep("initial");
        break;
      case "welcome-back":
      case "create-password":
        setStep("email");
        break;
      case "username":
        setStep("create-password");
        break;
      case "forgot-password":
        setStep("welcome-back");
        break;
      case "check-email":
        setStep("forgot-password");
        break;
      default:
        router.replace("/");
    }
  };

  // Step handlers
  const handleEmailSignIn = () => {
    clearError();
    setStep("email");
  };

  const handleEmailSubmit = async (emailValue: string) => {
    try {
      clearError();
      setEmail(emailValue);

      // Use the hook to check if user exists
      const result = await checkEmail(emailValue);
      setUserExists(result.exists);

      if (result.exists) {
        setStep("welcome-back");
      } else {
        setStep("create-password");
      }
    } catch (err) {
      // Error is already handled by the hook, but we can set additional context
      const error = err as Error;
      setError(error.message || "Failed to verify email. Please try again.");
    }
  };

  const handlePasswordSubmit = async (passwordValue: string) => {
    try {
      setLoading(true);
      clearError();
      setPassword(passwordValue);

      // Sign in existing user
      await signIn(email, passwordValue);
      router.replace("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePasswordSubmit = async (passwordValue: string) => {
    try {
      setLoading(true);
      clearError();
      setPassword(passwordValue);
      setStep("username");
    } catch (err) {
      setError("Failed to create password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (usernameValue: string) => {
    try {
      setLoading(true);
      clearError();
      setUsername(usernameValue);

      // Use the new signUpWithUsername method
      await signUpWithUsername(email, password, usernameValue);
      router.replace("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    clearError();
    setStep("forgot-password");
  };

  const handleForgotPasswordSubmit = async (emailValue: string) => {
    try {
      setLoading(true);
      clearError();

      const { error } = await supabase.auth.resetPasswordForEmail(emailValue, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setEmail(emailValue);
      setStep("check-email");
    } catch (err) {
      const error = err as Error;
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmailContinue = () => {
    resetFlow();
    setStep("initial");
  };

  // Social auth handlers (placeholders for future implementation)
  const handleGoogleSignIn = () => {
    console.log("Google sign in not implemented yet");
    // TODO: Implement Google OAuth
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/callback`,
    //   },
    // });
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook sign in not implemented yet");
    // TODO: Implement Facebook OAuth
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'facebook',
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/callback`,
    //   },
    // });
  };

  // Combine loading states
  const isFormLoading = isLoading || isCheckingEmail;

  // Combine errors (prioritize explicit errors over hook errors)
  const displayError = error || checkEmailError?.message;

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case "initial":
        return (
          <InitialStep
            onEmailSignIn={handleEmailSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            onFacebookSignIn={handleFacebookSignIn}
            isLoading={isFormLoading}
            onBack={handleBack}
          />
        );

      case "email":
        return (
          <EmailStep
            onSubmit={handleEmailSubmit}
            onBack={handleBack}
            isLoading={isFormLoading}
            defaultEmail={email}
          />
        );

      case "welcome-back":
        return (
          <WelcomeBackStep
            email={email}
            onSubmit={handlePasswordSubmit}
            onBack={handleBack}
            onForgotPassword={handleForgotPassword}
            isLoading={isFormLoading}
            error={displayError || undefined}
          />
        );

      case "create-password":
        return (
          <CreatePasswordStep
            onSubmit={handleCreatePasswordSubmit}
            onBack={handleBack}
            isLoading={isFormLoading}
            error={displayError || undefined}
          />
        );

      case "username":
        return (
          <UsernameStep
            onSubmit={handleUsernameSubmit}
            onBack={handleBack}
            isLoading={isFormLoading}
            error={displayError || undefined}
          />
        );

      case "forgot-password":
        return (
          <ForgotPasswordStep
            onSubmit={handleForgotPasswordSubmit}
            onBack={handleBack}
            isLoading={isFormLoading}
            defaultEmail={email}
          />
        );

      case "check-email":
        return (
          <CheckEmailStep
            email={email}
            onContinue={handleCheckEmailContinue}
            onBack={handleBack}
          />
        );

      default:
        return (
          <InitialStep
            onEmailSignIn={handleEmailSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            onFacebookSignIn={handleFacebookSignIn}
            isLoading={isFormLoading}
          />
        );
    }
  };

  return renderCurrentStep();
};
