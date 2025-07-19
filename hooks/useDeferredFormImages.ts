import { useState, useCallback } from "react";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

interface LocalImage {
  uri: string;
  bucket: "item-images" | "instruction-images";
  fileName?: string;
  fileType?: string;
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

  const setLocalImage = useCallback(
    (
      fieldPath: string,
      uri: string,
      bucket: "item-images" | "instruction-images"
    ) => {
      const fileName = uri.split("/").pop() || `image_${Date.now()}.jpg`;
      const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;

      setLocalImages((prev) => ({
        ...prev,
        [fieldPath]: { uri, bucket, fileName, fileType },
      }));
    },
    []
  );

  const clearLocalImage = useCallback((fieldPath: string) => {
    setLocalImages((prev) => {
      const newImages = { ...prev };
      delete newImages[fieldPath];
      return newImages;
    });
  }, []);

  const clearAllLocalImages = useCallback(() => {
    setLocalImages({});
  }, []);

  const uploadImage = async (localImage: LocalImage): Promise<string> => {
    const { uri, bucket, fileName, fileType } = localImage;

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = fileName?.split(".").pop() || "jpg";
    const path = `${timestamp}_${randomString}.${extension}`;

    try {
      let file: Blob;

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        file = await response.blob();
      } else {
        // Mobile platform - use direct file object
        const fileObject = {
          uri,
          type: fileType || "image/jpeg",
          name: fileName || `image_${timestamp}.jpg`,
        } as any;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(path, fileObject, {
            contentType: fileType || "image/jpeg",
            upsert: false,
          });

        if (error) {
          throw new Error(`Upload failed: ${error.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(path);

        return publicUrl;
      }

      // Web upload path
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType: fileType || "image/jpeg",
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      throw new Error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const uploadAllImages = useCallback(async (): Promise<UploadResult[]> => {
    const entries = Object.entries(localImages);
    if (entries.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    const results: UploadResult[] = [];
    const uploadedPaths: { bucket: string; path: string }[] = [];

    try {
      for (let i = 0; i < entries.length; i++) {
        const [fieldPath, localImage] = entries[i];

        try {
          const url = await uploadImage(localImage);
          results.push({ fieldPath, url });

          // Track for cleanup on error
          const path = url.split("/").pop();
          if (path) {
            uploadedPaths.push({ bucket: localImage.bucket, path });
          }

          setUploadProgress((i + 1) / entries.length);
        } catch (error) {
          // Clean up uploaded images on error
          for (const { bucket, path } of uploadedPaths) {
            try {
              await supabase.storage.from(bucket).remove([path]);
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

  const hasLocalImage = useCallback(
    (fieldPath: string): boolean => {
      return fieldPath in localImages;
    },
    [localImages]
  );

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
