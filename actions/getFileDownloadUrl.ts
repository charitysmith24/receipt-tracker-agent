"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convex";
import { Id } from "@/convex/_generated/dataModel";
export async function getFileDownloadUrl(fileId: Id<"_storage"> | string) {
  try {
    // Get download URL from Convex
    const downloadUrl = await convex.query(api.receipts.generateDownloadUrl, {
      fileId: fileId as Id<"_storage">,
    });

    if (!downloadUrl) {
      throw new Error("Failed to get file download URL");
    }

    return { success: true, downloadUrl };
  } catch (error) {
    console.error("Server action getFileDownloadUrl error:", error);
    return { success: false, error: "Failed to get file download URL" };
  }
}
