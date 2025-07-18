import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { AddItemForm } from "@/components/AddItemForm";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AddItem() {
  return (
    <ProtectedRoute>
      <AddItemScreen />
    </ProtectedRoute>
  );
}

function AddItemScreen() {
  const { session } = useAuth();
  const router = useRouter();

  //   if (!session?.user?.id) {
  //     return (
  //       <Center className="flex-1 px-6">
  //         <VStack space="md" className="items-center">
  //           <Text size="lg" className="text-destructive font-medium text-center">
  //             Authentication Required
  //           </Text>
  //           <Text size="md" className="text-muted-foreground text-center">
  //             You must be signed in to add a recipe.
  //           </Text>
  //         </VStack>
  //       </Center>
  //     );
  //   }

  const handleSuccess = (item: { id: string }) => {
    router.replace(`/item/${item.id}`);
  };

  return (
    <ProtectedRoute>
      {/* TODO: Possibly temporary workaround. Might be able to figure out better way */}
      {session?.user?.id && (
        <AddItemForm userId={session.user.id} onSuccess={handleSuccess} />
      )}
    </ProtectedRoute>
  );
}
