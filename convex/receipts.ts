import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

// Store receipt
export const storeReceipt = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    // Store receipt metadata
    const receiptId = await ctx.db.insert("receipts", {
      userId: args.userId,
      fileName: args.fileName,
      fileId: args.fileId,
      fileSize: args.fileSize,
      fileType: args.fileType,
      fileUploadedAt: Date.now(),
      fileStatus: "pending",
      // initialize extracted data
      merchantName: undefined,
      merchantAddress: undefined,
      merchantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      currency: undefined,
      receiptItems: [],
    });
    return receiptId;
  },
});

// Get receipts for user
export const getReceipts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get receipts for user
    const receipts = await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
    return receipts;
  },
});

// Get receipt by ID
export const getReceiptById = query({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    // Get receipt by ID
    const receipt = await ctx.db.get(args.id);

    // Verify user has access to receipt
    if (receipt) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || identity.subject !== receipt.userId) {
        throw new Error("Not Unauthorized to Access Receipt");
      }
    }
    return receipt;
  },
});

// Generate download URL
export const generateDownloadUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Generate download URL
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Process receipt
export const processReceipt = mutation({
  args: {
    id: v.id("receipts"),
    fileStatus: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user has access to receipt
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== receipt.userId) {
      throw new Error("Not Unauthorized to Access Receipt");
    }

    // Update receipt status
    await ctx.db.patch(args.id, {
      fileStatus: args.fileStatus,
    });
    return true;
  },
});

// Delete receipt
export const deleteReceipt = mutation({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    // Verify user has access to receipt
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== receipt.userId) {
      throw new Error("Not Unauthorized to Access Receipt");
    }

    // Delete receipt file from storage
    await ctx.storage.delete(receipt.fileId);

    // Delete receipt
    await ctx.db.delete(args.id);
    return true;
  },
});

// Update receipt with extracted data
export const updateReceiptWithExtractedData = mutation({
  args: {
    id: v.id("receipts"),
    extractedData: v.object({
      fileDisplayName: v.string(),
      merchantName: v.optional(v.string()),
      merchantAddress: v.optional(v.string()),
      merchantContact: v.optional(v.string()),
      transactionDate: v.optional(v.string()),
      transactionAmount: v.optional(v.number()),
      currency: v.optional(v.string()),
      receiptItems: v.array(
        v.object({
          name: v.string(),
          quantity: v.number(),
          unitPrice: v.number(),
          totalPrice: v.number(),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    // Verify the receipt exists
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Update receipt with extracted data
    await ctx.db.patch(args.id, {
      fileDisplayName: args.extractedData.fileDisplayName,
      merchantName: args.extractedData.merchantName,
      merchantAddress: args.extractedData.merchantAddress,
      merchantContact: args.extractedData.merchantContact,
      transactionDate: args.extractedData.transactionDate,
      transactionAmount: args.extractedData.transactionAmount,
      currency: args.extractedData.currency,
      receiptItems: args.extractedData.receiptItems,
      fileStatus: "processed",
    });

    return {
      userId: receipt.userId,
    };
  },
});
