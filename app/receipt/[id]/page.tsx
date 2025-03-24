"use client";

import { getFileDownloadUrl } from "@/actions/getFileDownloadUrl";
import {
  TableBody,
  TableFooter,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  Table,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { deleteReceipt } from "@/actions/deleteReceipt";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { useQuery } from "convex/react";
import { ChevronLeft, FileText, Lightbulb, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function ReceiptPage() {
  const params = useParams<{ id: string }>();
  const [receiptId, setReceiptId] = useState<Id<"receipts"> | null>(null);
  const router = useRouter();
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if summaries are enabled on users subscription
  const isSummariesEnabled = useSchematicFlag("summary");

  console.log("isSummariesEnabled", isSummariesEnabled);

  // Fetch receipt data
  const receipt = useQuery(
    api.receipts.getReceiptById,
    receiptId ? { id: receiptId } : "skip",
  );

  // Get file download URL (for the view button)
  const fileId = receipt?.fileId;
  const downloadUrl = useQuery(
    api.receipts.getReceiptDownloadUrl,
    fileId ? { fileId } : "skip",
  );

  // Handle download receipt
  const handleDownloadReceipt = async () => {
    if (!receipt || !receiptId) return;
    try {
      setIsLoadingDownload(true);
      const result = await getFileDownloadUrl(receipt.fileId);

      if (!result.success) {
        toast.error("Your action to download the receipt failed");
        throw new Error(result.error || "Failed to download receipt");
      }

      // create a temporary anchor element
      const link = document.createElement("a");
      if (result.downloadUrl) {
        link.href = result.downloadUrl;
        link.download = receipt.fileName || "receipt.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading receipt", error);
      toast.error("Failed to download receipt");
    } finally {
      setIsLoadingDownload(false);
      toast.success("Receipt downloaded successfully");
    }
  };

  // Handle delete receipt
  const handleDeleteReceipt = async () => {
    if (!receipt || !receiptId) return;
    if (
      window.confirm(
        "Are you sure you want to delete this receipt? This action cannot be undone.",
      )
    ) {
      try {
        setIsDeleting(true);
        const result = await deleteReceipt(receiptId);
        if (!result?.success) {
          throw new Error(result?.error);
        }
        toast.success(result?.message);
        router.push("/receipts");
      } catch (error) {
        console.error("Error deleting receipt", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to delete receipt",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Convert the URL string ID to a convex ID
  useEffect(() => {
    try {
      const id = params.id as Id<"receipts">;
      setReceiptId(id);
    } catch (error) {
      console.error("Invalid receipt ID", error);
      router.push("/"); // Redirect to the home page
    }
  }, [params.id, router]);

  if (receipt === undefined) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full size-12 border-t-2 border-b-2 border-primary/75 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (receipt === null) {
    return (
      <div className="container h-screen mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="mb-6">
            The receipt you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            className="px-6 py-2 bg-primary/30 text-white rounded hover:bg-primary/75"
            href="/"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Format the upload date
  const uploadDate = new Date(receipt.fileUploadedAt).toLocaleString();

  // Check if receipt has extracted data
  const hasExtractedData = !!(
    receipt.merchantName &&
    receipt.merchantContact &&
    receipt.transactionDate &&
    receipt.transactionAmount
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6">
          <Link
            href="/receipts"
            className="text-primary/60 hover:underline flex items-center"
          >
            <ChevronLeft className="size-4 mr-1" />
            Back to Receipts
          </Link>
        </nav>
        <div className="bg-white/10 dark:bg-primary/10 border border-gray-200 dark:border-teal-500 rounded-lg shadow-md dark:shadow-xl dark:shadow-teal-200/20 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold mb-4">
                {receipt.fileDisplayName || receipt.fileName}
              </h1>
              <div className="flex items-center">
                {receipt.fileStatus === "pending" ? (
                  <div className="mr-2">
                    <div className="animate-spin rounded-full size-4 border-b-2 border-yellow-800"></div>
                  </div>
                ) : null}
                <span
                  className={`px-3 py-1 rounded-full text-xs ${receipt.fileStatus === "pending" ? "bg-yellow-100 text-yellow-800 shadow-sm shadow-yellow-900" : receipt.fileStatus === "processed" ? "bg-green-100 text-primary/80 dark:bg-teal-100 dark:text-teal-700 shadow-sm shadow-primary/90 dark:shadow-teal-300" : "bg-red-100 text-red-800 shadow-sm shadow-red-900"}`}
                >
                  {receipt.fileStatus.charAt(0).toUpperCase() +
                    receipt.fileStatus.slice(1)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-4 rounded-lg">
              {/* Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm lg:text-2xl font-bold text-primary/500 dark:text-teal-50">
                    File Information
                  </h3>
                  <div className="mt-2 bg-gray-50 dark:bg-teal-600/8 p-4 rounded-lg shadow-md dark:shadow-sm dark:shadow-teal-200/20">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-primary-500 dark:text-teal-50 font-bold">
                          Uploaded
                        </p>
                        <p className="text-primary-300 dark:text-teal-50 font-medium">
                          {uploadDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-primary-500 dark:text-teal-50 font-bold">
                          Size
                        </p>
                        <p className="text-primary-300 font-medium">
                          {formatFileSize(receipt.fileSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-primary-500 dark:text-teal-50 font-bold">
                          Type
                        </p>
                        <p className="text-primary-300 font-medium">
                          {receipt.fileType}
                        </p>
                      </div>
                      <div>
                        <p className="text-primary-500 dark:text-teal-50 font-bold">
                          ID
                        </p>
                        <p
                          className="text-primary-300 font-medium truncate"
                          title={receipt._id}
                        >
                          {receipt._id.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Download Button */}
              <div className="flex items-center justify-center p-8 mt-[28px] lg:mt-10 bg-primary/20 dark:bg-primary/10 rounded-lg shadow-md dark:shadow-sm dark:shadow-teal-200/20">
                <div className="text-center">
                  <FileText className="size-12 text-primary/80 dark:text-teal-50 ml-6 " />
                  <p className="text-primary/80 dark:text-teal-50 text-sm my-4">
                    PDF Preview
                  </p>
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      className="mt-2 px-4 py-2 bg-primary/30 text-white rounded lg:rounded-lg shadow-sm shadow-primary/60 dark:shadow-teal-200 hover:bg-primary/75 dark:hover:bg-[#00191e]"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>
              {/* Extracted Data */}
              {hasExtractedData && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm lg:text-2xl font-bold text-primary/500 dark:text-teal-50">
                    Receipt Details
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                    {/* Merchant */}
                    <div className="bg-gray-50 dark:bg-teal-600/8 p-4 rounded-lg shadow-md dark:shadow-sm dark:shadow-teal-200/20">
                      <h4 className="text-sm lg:text-xl font-medium text-primary/500 dark:text-teal-500 mb-2 underline underline-offset-4 decoration-primary/500 dark:decoration-teal-500">
                        Merchant Information
                      </h4>
                      <div className="space-y-2">
                        {receipt.merchantName && (
                          <div>
                            <p className="text-primary-500 dark:text-teal-50 font-bold">
                              Merchant Name
                            </p>
                            <p className="text-primary-300 font-medium">
                              {receipt.merchantName}
                            </p>
                          </div>
                        )}
                        {receipt.merchantAddress && (
                          <div>
                            <p className="text-primary-500 dark:text-teal-50 font-bold">
                              Merchant Address
                            </p>
                            <p className="text-primary-300 font-medium">
                              {receipt.merchantAddress}
                            </p>
                          </div>
                        )}
                        {receipt.merchantContact && (
                          <div>
                            <p className="text-primary-500 dark:text-teal-50 font-bold">
                              Merchant Contact
                            </p>
                            <p className="text-primary-300 font-medium">
                              {receipt.merchantContact}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Transaction */}
                    <div className="bg-gray-50 dark:bg-teal-600/8 p-4 rounded-lg shadow-md dark:shadow-sm dark:shadow-teal-200/20">
                      <h4 className="font-medium lg:text-xl text-primary/500 dark:text-teal-500 mb-2 underline underline-offset-4 decoration-primary/500 dark:decoration-teal-500">
                        Transaction Details
                      </h4>
                      <div className="space-y-2">
                        {receipt.transactionDate && (
                          <div>
                            <p className="text-primary-500 dark:text-teal-50 font-bold">
                              Transaction Date
                            </p>
                            <p className="text-primary-300 font-medium">
                              {receipt.transactionDate}
                            </p>
                          </div>
                        )}
                        {receipt.transactionAmount && (
                          <div>
                            <p className="text-primary-500 dark:text-teal-50 font-bold">
                              Transaction Amount
                            </p>
                            <p className="text-primary-300 font-medium">
                              {formatCurrency(
                                receipt.transactionAmount,
                                receipt.currency || "",
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Receipt Summary */}
                  {receipt.receiptSummary && (
                    <>
                      {isSummariesEnabled ? (
                        <div className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-4 rounded-lg border border-primary/20 dark:border-teal-500 shadow-sm dark:shadow-teal-500">
                          <div className="flex items-center mb-4">
                            <h4 className="font-semibold text-primary/500 dark:text-teal-50">
                              AI Summary
                            </h4>
                            <div>
                              <Sparkles className="size-3.5 ml-2 text-yellow-600 dark:text-yellow-500" />
                              {/* <Sparkles className="size-3 text-yellow-400 -ml-1" /> */}
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-primary/20 dark:border-teal-500">
                            <p className="text-sm whitespace-pre-line leading-relaxed text-gray-700">
                              {receipt.receiptSummary}
                            </p>
                            <div className="mt-3 text-xs text-primary-600 italic flex items-center">
                              <Lightbulb className="size-3 mr-1 text-yellow-500" />
                              <span className="text-gray-700 dark:text-teal-800">
                                AI-generated summary base on receipt data
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-4 rounded-lg border border-primary/20 dark:border-teal-500 shadow-sm dark:shadow-teal-500">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <h4 className="font-semibold text-primary/500 dark:text-teal-50">
                                AI Summary
                              </h4>
                              <div className="ml-2 flex">
                                <Sparkles className="size-3.5 ml-2 text-yellow-500" />
                                <Sparkles className="size-3 text-yellow-400 -ml-1" />
                              </div>
                            </div>
                            <Lock className="size-4 text-primary/500 dark:text-teal-50" />
                          </div>
                          <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-primary/50 flex flex-col items-center justify-center">
                            <Link
                              href="/manage-plan"
                              className="text-center py-4"
                            >
                              <Lock className="size-4 mr-2" />
                              <p className="text-sm text-primary-500 mb-2">
                                AI summary is a PRO level feature
                              </p>
                              <button className="mt-2 px-4 py-1.5 bg-primary-500 text-white text-sm rounded hover:bg-primary-800 inline-block">
                                Upgrade to PRO
                              </button>
                            </Link>
                          </div>
                          <div className="mt-3 text-xs text-primary-600 italic flex items-center">
                            <Lightbulb className="size-4 text-primary/500 dark:text-teal-50" />
                            <span>
                              Get AI-powered insights from your receipts
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Itemized Data */}
              {receipt.receiptItems && receipt.receiptItems.length > 0 ? (
                <div className="mt-8">
                  <h4 className="text-sm lg:text-2xl font-bold text-primary/500 dark:text-teal-50">
                    Items ({receipt.receiptItems.length})
                  </h4>
                  <div className="mt-4 bg-white/55 dark:bg-primary/10 border border-gray-200 dark:border-teal-900 rounded-lg shadow-md dark:shadow-sm dark:shadow-teal-200/20 overflow-hidden">
                    <div className="overflow-w-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-white/55 dark:bg-primary/40">
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {receipt.receiptItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {item.name}
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                {formatCurrency(
                                  item.unitPrice,
                                  receipt.currency || "",
                                )}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(
                                  item.totalPrice,
                                  receipt.currency || "",
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter className="bg-white/55 dark:bg-primary/10">
                          <TableRow>
                            <TableCell colSpan={3} className="text-right">
                              Total
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(
                                receipt.receiptItems.reduce(
                                  (sum, item) => sum + item.totalPrice,
                                  0,
                                ),
                                receipt.currency || "",
                              )}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <h4 className="text-sm lg:text-2xl font-bold text-primary/500 dark:text-teal-50">
                    Items
                  </h4>
                  <p className="text-gray-500 dark:text-teal-50">
                    No items extracted from receipt
                  </p>
                </div>
              )}
              {/* Actions Section */}
              <div className="mt-8 border-t pt-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`px-4 py-2 bg-white border border-gray-300 rounded lg:rounded-lg text-sm text-gray-700 dark:text-teal-900 ${isLoadingDownload ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                    onClick={handleDownloadReceipt}
                    disabled={isLoadingDownload}
                  >
                    {isLoadingDownload ? "Downloading..." : "Download Receipt"}
                  </button>
                  <button
                    className={`px-4 py-2 bg-white border border-gray-300 rounded lg:rounded-lg text-sm text-gray-700 dark:text-teal-900 ${isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                    onClick={handleDeleteReceipt}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Receipt"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPage;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatCurrency(amount: number, currency: string): string {
  return `${amount.toFixed(2)}${currency ? ` ${currency}` : ""}`;
}
