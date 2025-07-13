import { useState, useCallback } from "react";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

interface LocalImage {
  uri: string;
  bucket: "item-images" | "instruction-images";
}

interface LocalImages {
  [fieldPath: string]: LocalImage;
}

interface UploadResult {
  fieldPath: string;
  url: string;
}

export function useDeferredFormImages() {
  const [localImages, setLocalImages] = useState<LocalImages>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Set a local image for a field
  const setLocalImage = useCallback(
    (
      fieldPath: string,
      uri: string,
      bucket: "item-images" | "instruction-images"
    ) => {
      setLocalImages((prev) => ({
        ...prev,
        [fieldPath]: { uri, bucket },
      }));
    },
    []
  );

  // Clear a local image
  const clearLocalImage = useCallback((fieldPath: string) => {
    setLocalImages((prev) => {
      const newImages = { ...prev };
      delete newImages[fieldPath];
      return newImages;
    });
  }, []);

  // Clear all local images
  const clearAllLocalImages = useCallback(() => {
    setLocalImages({});
  }, []);

  // Upload a single image
  const uploadImage = async (localImage: LocalImage): Promise<string> => {
    console.log("Uploading image:", localImage);
    const { uri, bucket } = localImage;

    const filename = uri.split("/").pop() ?? "";
    const extension = filename.split(".").pop()?.toLowerCase() ?? "";
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const path = `${timestamp}_${randomString}.${extension}`;

    let file;
    if (Platform.OS === "web") {
      const response = await fetch(uri);
      file = await response.blob();
    } else {
      const response = await fetch(uri);
      file = await response.blob();
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return publicUrl;
  };

  // Upload all local images and return URLs mapped to field paths
  const uploadAllImages = useCallback(async (): Promise<UploadResult[]> => {
    const entries = Object.entries(localImages);
    if (entries.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    const results: UploadResult[] = [];
    const uploadedUrls: string[] = []; // Track for cleanup if needed

    try {
      for (let i = 0; i < entries.length; i++) {
        const [fieldPath, localImage] = entries[i];

        try {
          const url = await uploadImage(localImage);
          results.push({ fieldPath, url });
          uploadedUrls.push(url);

          // Update progress
          setUploadProgress((i + 1) / entries.length);
        } catch (error) {
          // If any upload fails, clean up previously uploaded images
          console.error(`Failed to upload image for ${fieldPath}:`, error);

          // Clean up successfully uploaded images
          for (const url of uploadedUrls) {
            try {
              const path = url.split("/").pop();
              if (path) {
                const bucket = url.includes("instruction-images")
                  ? "instruction-images"
                  : "item-images";
                await supabase.storage.from(bucket).remove([path]);
              }
            } catch (cleanupError) {
              console.error("Cleanup error:", cleanupError);
            }
          }

          throw error;
        }
      }

      return results;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [localImages]);

  // Check if a field has a local image
  const hasLocalImage = useCallback(
    (fieldPath: string): boolean => {
      return fieldPath in localImages;
    },
    [localImages]
  );

  // Get local image URI for preview
  const getLocalImageUri = useCallback(
    (fieldPath: string): string | undefined => {
      return localImages[fieldPath]?.uri;
    },
    [localImages]
  );

  return {
    localImages,
    setLocalImage,
    clearLocalImage,
    clearAllLocalImages,
    uploadAllImages,
    isUploading,
    uploadProgress,
    hasLocalImage,
    getLocalImageUri,
  };
}
