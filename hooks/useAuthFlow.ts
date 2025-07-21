import { useState, useCallback, useRef } from "react";

export type AuthFlowStep =
  | "initial"
  | "email"
  | "welcome-back"
  | "create-password"
  | "username"
  | "forgot-password"
  | "check-email";

interface AuthFlowState {
  email: string;
  password: string;
  username: string;
  step: AuthFlowStep;
  userExists: boolean;
  isLoading: boolean;
}

const initialState: AuthFlowState = {
  email: "",
  password: "",
  username: "",
  step: "initial",
  userExists: false,
  isLoading: false,
};

export function useAuthFlow() {
  const [state, setState] = useState<AuthFlowState>(initialState);

  const updateState = useCallback((updates: Partial<AuthFlowState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setEmail = useCallback(
    (email: string) => {
      updateState({ email: email.trim().toLowerCase() });
    },
    [updateState]
  );

  const setPassword = useCallback(
    (password: string) => {
      updateState({ password });
    },
    [updateState]
  );

  const setUsername = useCallback(
    (username: string) => {
      updateState({ username: username.trim() });
    },
    [updateState]
  );

  const setStep = useCallback(
    (step: AuthFlowStep) => {
      updateState({ step });
    },
    [updateState]
  );

  const setUserExists = useCallback(
    (userExists: boolean) => {
      updateState({ userExists });
    },
    [updateState]
  );

  const setLoading = useCallback(
    (isLoading: boolean) => {
      updateState({ isLoading });
    },
    [updateState]
  );

  const resetFlow = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    // State
    ...state,

    // Actions
    setEmail,
    setPassword,
    setUsername,
    setStep,
    setUserExists,
    setLoading,
    updateState,
    resetFlow,
  };
}
