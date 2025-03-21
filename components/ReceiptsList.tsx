"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ChevronRight, FileText } from "lucide-react";

function ReceiptList() {
  const { user } = useUser();
  const receipts = useQuery(api.receipts.getReceipts, {
    userId: user?.id || "",
  });

  const router = useRouter();

  if (!user) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">
          Please sign in to view your receipts.
        </p>
      </div>
    );
  }

  if (!receipts) {
    return (
      <div className="w-full p-2 text-center">
        <div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-teal-500 mx-auto">
          <p className="mt-2 text-teal-600">Loading receipts...</p>
        </div>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="w-full p-8 text-center border border-teal-200 rounded-lg shadow-md bg-teal-50">
        <p className="text-muted-foreground">
          No receipts have been uploaded yet.
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Receipts</h2>
      <div className="bg-white/55 dark:bg-primary/10 border border-gray-200 dark:border-teal-500 rounded-lg shadow-md dark:shadow-xl dark:shadow-teal-500/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="text-primary/80 dark:text-teal-50">
                Name
              </TableHead>
              <TableHead className="text-primary/80 dark:text-teal-50">
                Uploaded
              </TableHead>
              <TableHead className="text-primary/80 dark:text-teal-50">
                Size
              </TableHead>
              <TableHead className="text-primary/80 dark:text-teal-50">
                Total
              </TableHead>
              <TableHead className="text-primary/80 dark:text-teal-50">
                Status
              </TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt: Doc<"receipts">) => (
              <TableRow
                key={receipt._id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  router.push(`/receipts/${receipt._id}`);
                }}
              >
                <TableCell className="py-2">
                  <FileText className="size-6 text-red-500" />
                </TableCell>
                <TableCell className="py-2">
                  {receipt.fileDisplayName || receipt.fileName}
                </TableCell>
                <TableCell className="py-2">
                  {new Date(receipt.fileUploadedAt).toLocaleString()}
                </TableCell>
                <TableCell className="py-2">
                  {formatFileSize(receipt.fileSize)}
                </TableCell>
                <TableCell className="py-2">
                  {receipt.transactionAmount
                    ? `${receipt.transactionAmount} ${receipt.currency} || ""`
                    : "-"}
                </TableCell>
                <TableCell className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${receipt.fileStatus === "pending" ? "bg-yellow-100 text-yellow-800" : receipt.fileStatus === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {receipt.fileStatus.charAt(0).toUpperCase() +
                      receipt.fileStatus.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  <ChevronRight className="size-6 text-gray-500" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ReceiptList;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
