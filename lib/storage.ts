import { supabase } from "./supabase";

export async function deleteStorageFile(url: string) {
  try {
    const path = url.split("/").pop();
    if (!path) return;

    // Determine which bucket the file is in
    const bucket = url.includes("instruction-images")
      ? "instruction-images"
      : "item-images";

    await supabase.storage.from(bucket).remove([path]);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export async function cleanupItemImages(
  oldImages: string[],
  newImages: string[]
) {
  const imagesToDelete = oldImages.filter(
    (oldImage) => !newImages.includes(oldImage)
  );

  await Promise.all(imagesToDelete.map((image) => deleteStorageFile(image)));
}
