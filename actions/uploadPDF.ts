"use server";

import { api } from "@/convex/_generated/api";
import { currentUser } from "@clerk/nextjs/server";
import convex from "@/lib/convex";
import { getFileDownloadUrl } from "./getFileDownloadUrl";

export async function uploadPDF(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return {
        success: false,
        error: "Invalid file type. Please upload a PDF.",
      };
    }

    // Get upload URL
    const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {});
    console.log("uploadUrl", uploadUrl);

    // Create arraybuffer from file
    const fileArrayBuffer = await file.arrayBuffer();
    // Upload file to storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: new Uint8Array(fileArrayBuffer),
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `Server action uploadPDF error: ${uploadResponse.statusText}`,
      );
    }

    // Get storage ID
    const storageId = await uploadResponse.json();

    // Add receipt to database
    const receiptId = await convex.mutation(api.receipts.storeReceipt, {
      userId: user.id,
      fileName: file.name,
      fileId: storageId.storageId,
      fileSize: file.size,
      fileType: file.type,
    });
    // Generate the file URL
    const fileUrl = await getFileDownloadUrl(storageId.storageId);
    console.log("FILE URL", fileUrl);
    // Trigger inngest agent flow
    // TODO: Add agent flow

    return {
      success: true,
      data: {
        receiptId,
        fileName: file.name,
      },
    };
  } catch (error) {
    console.error("Server action uploadPDF error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}
