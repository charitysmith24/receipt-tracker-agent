import PDFDropzone from "@/components/PDFDropzone";
import ReceiptsList from "@/components/ReceiptsList";
import React from "react";

function Receipts() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-5 lg:px-8 md:py-20 lg:py-36">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <PDFDropzone />
        <ReceiptsList />
      </div>
    </div>
  );
}

export default Receipts;
