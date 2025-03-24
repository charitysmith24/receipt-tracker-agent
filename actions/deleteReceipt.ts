"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convex";
import { currentUser } from "@clerk/nextjs/server";

export async function deleteReceipt(receiptId: string) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    await convex.mutation(api.receipts.deleteReceipt, {
      id: receiptId as Id<"receipts">,
    });

    return { success: true, message: "Receipt deleted successfully" };
  } catch (error) {
    console.error("Error deleting receipt", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
