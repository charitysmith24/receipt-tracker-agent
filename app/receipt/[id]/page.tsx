"use client";

import { useParams } from "next/navigation";
import React from "react";

function ReceiptPage() {
  const params = useParams<{ id: string }>();
  return (
    <div>
      <h1>Receipt</h1>
      <p>{params.id}</p>
    </div>
  );
}

export default ReceiptPage;
