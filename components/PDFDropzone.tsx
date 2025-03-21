"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import React, { startTransition, useCallback, useRef, useState } from "react";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { toast } from "sonner";
import { uploadPDF } from "@/actions/uploadPDF";
import { AlertCircle, CheckCircle, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

function PDFDropzone() {
  // State
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const user = useUser();
  const router = useRouter();
  // TODO: get user from session
  /* const { session } = useSession();
  const user = session?.user; */

  // Get user Schematic subscription status
  const {
    value: isFeatureEnabled,
    featureUsage,
    featureUsageExceeded,
    featureAllocation,
  } = useSchematicEntitlement("scans");
  console.log("isFeatureEnabled", isFeatureEnabled);
  console.log("featureUsage", featureUsage);
  console.log("featureUsageExceeded", featureUsageExceeded);
  console.log("featureAllocation", featureAllocation);

  // File Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set up sensors for drag detection
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle upload
  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!user) {
        toast("Please sign in to upload files");
        return;
      }

      // Filter out non-PDF files TODO: look add support for other file types
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf",
      );

      if (pdfFiles.length === 0) {
        toast("Please select at least one PDF file");
        return;
      }

      startTransition(() => {
        setIsUploading(true);
      });

      try {
        // Upload files to storage
        const newUploadedFiles: string[] = [];
        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const response = await uploadPDF(formData);

          if (!response.success) {
            toast("Failed to upload file");
            console.error("Failed to upload PDF FILE:", response.error);
            throw new Error("Failed to upload file");
          }
          console.log("response", response);
          newUploadedFiles.push(file.name);
        }

        console.log("newUploadedFiles", newUploadedFiles);
        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
        toast.success("Files uploaded successfully");
        // Clear uploaded files after 5 seconds
        setTimeout(() => {
          setUploadedFiles([]);
        }, 5000);

        router.push("/receipts");
      } catch (error) {
        console.error("Upload failed:", error);
        toast(
          `Upload failed: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [user, router],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);

      if (!user) {
        alert("Please sign in to upload files");
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [user, handleUpload],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload],
  );

  const isUserSignedIn = !!user;
  const canUpload = isUserSignedIn && isFeatureEnabled;

  return (
    <>
      <DndContext sensors={sensors}>
        <div className="w-full max-w-md mx-auto">
          <div
            onDragOver={canUpload ? handleDragOver : undefined}
            onDragLeave={canUpload ? handleDragLeave : undefined}
            onDrop={canUpload ? handleDrop : undefined}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? "border-teal-700" : "border-primary/50 dark:border-teal-500"} ${!canUpload ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-teal-500 dark:border-teal-300">
                  <p className="text-sm text-teal-600 dark:text-teal-300">
                    Uploading...
                  </p>
                </div>
              </div>
            ) : !isUserSignedIn ? (
              <>
                <CloudUpload className="size-12 mx-auto text-teal-600 dark:text-teal-300" />
                <p className="mt-2 text-sm text-teal-600 dark:text-teal-300">
                  Please sign in to upload files
                </p>
              </>
            ) : (
              <>
                <CloudUpload className="size-12 mx-auto text-primary/80 dark:text-teal-300" />
                <p className="mt-2 text-sm text-primary/80 dark:text-teal-300">
                  Drag & Drop your PDF files here, or click to select files
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <Button
                  variant="default"
                  className="mt-4 px-4 py-2 bg-primary/80 dark:bg-teal-500 text-white rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFeatureEnabled}
                  onClick={triggerFileInput}
                >
                  {isFeatureEnabled ? "Select files" : "Upgrade to upload"}
                </Button>
              </>
            )}
          </div>
          <div className="mt-4">
            {featureUsageExceeded && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                <AlertCircle className="size-5 mr-2 flex-shrink-0" />
                <p className="text-red-500">
                  You have exceeded your limit of {featureAllocation} scans.
                  Please upgrade to continue uploading files.
                </p>
              </div>
            )}
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-4 w-full">
              <h3 className="font-medium text-teal-900 dark:text-teal-300">
                Uploaded files:
              </h3>
              <ul className="text-sm my-2 text-teal-600 dark:text-teal-100 space-y-1">
                {uploadedFiles.map((fileName, i) => (
                  <li key={i}>
                    <CheckCircle className="size-5 text-teal-500 mr-2" />
                    {fileName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DndContext>
    </>
  );
}

export default PDFDropzone;
