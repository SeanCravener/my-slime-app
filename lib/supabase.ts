import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { Database } from "@/types/database/supabase";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Create a proper storage adapter for web and native
const createStorageAdapter = () => {
  if (Platform.OS === "web") {
    // Use localStorage directly for web
    return {
      getItem: (key: string) => {
        if (typeof window !== "undefined") {
          return Promise.resolve(window.localStorage.getItem(key));
        }
        return Promise.resolve(null);
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, value);
        }
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(key);
        }
        return Promise.resolve();
      },
    };
  }

  // For native platforms, use SecureStore (you'll need to install it)
  const SecureStore = require("expo-secure-store");
  return {
    getItem: (key: string) => {
      return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
      return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
      return SecureStore.deleteItemAsync(key);
    },
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});
