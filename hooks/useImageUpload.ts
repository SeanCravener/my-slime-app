import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";
import { deleteStorageFile } from "@/lib/storage";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
  };

  const uploadImage = async (
    uri: string,
    bucket: "item-images" | "instruction-images",
    oldImageUrl?: string
  ) => {
    try {
      setIsUploading(true);

      // Delete old image if it exists
      if (oldImageUrl) {
        await deleteStorageFile(oldImageUrl);
      }

      const filename = uri.split("/").pop() ?? "";
      const extension = filename.split(".").pop()?.toLowerCase() ?? "";
      const path = `${Date.now()}.${extension}`;

      let file;
      if (Platform.OS === "web") {
        const response = await fetch(uri);
        file = await response.blob();
      } else {
        const response = await fetch(uri);
        const blob = await response.blob();
        file = blob;
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      return publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    pickImage,
    uploadImage,
    isUploading,
  };
}
