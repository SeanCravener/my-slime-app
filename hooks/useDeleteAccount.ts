import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DeleteAccountData {
  password: string;
  avatarUrl?: string;
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (data: DeleteAccountData) => {
      // Step 1: Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user?.email) {
        throw new Error("Unable to verify user identity");
      }

      // Step 2: Re-authenticate with password to verify identity
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.password,
      });

      if (signInError) {
        throw new Error("Incorrect password");
      }

      // Step 3: Delete avatar from storage if exists
      if (data.avatarUrl) {
        try {
          // Extract file path from URL
          const urlParts = data.avatarUrl.split("/");
          const fileName = urlParts[urlParts.length - 1];

          if (fileName) {
            const { error: storageError } = await supabase.storage
              .from("user-avatars")
              .remove([fileName]);

            if (storageError) {
              console.warn("Failed to delete avatar:", storageError);
              // Don't throw error - continue with account deletion
            }
          }
        } catch (error) {
          console.warn("Avatar deletion failed:", error);
          // Continue with account deletion even if avatar cleanup fails
        }
      }

      // Step 4: Delete the user account (this will trigger cascade deletion)
      const { error: deleteError } = await supabase.rpc("delete_user");

      if (deleteError) {
        throw new Error(`Failed to delete account: ${deleteError.message}`);
      }

      // Step 5: Sign out (cleanup)
      await supabase.auth.signOut();

      return { success: true };
    },
  });
}
