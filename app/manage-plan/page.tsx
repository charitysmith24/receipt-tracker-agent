"use client";

import SchematicComponent from "@/components/schematic/SchematicComponent";
import { useEffect, useState, JSX } from "react";

function ManagePlan() {
  const [component, setComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    SchematicComponent({
      componentId:
        process.env.NEXT_PUBLIC_SCHEMATIC_CUSTOMER_PORTAL_COMPONENT_ID!,
    }).then((result) => {
      console.log("SchematicComponent Results: ", result);
      if (result instanceof Error) {
        console.error(result);
      } else {
        setComponent(result);
      }
    });
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-0">
      <h1 className="text-2xl font-bold mb-4 my-8">Manage Your Plan</h1>
      <p className=" text-gray-600 dark:text-white/80 mb-8">
        Manage your subscription and billing details here.
      </p>
      {component}
    </div>
  );
}
export default ManagePlan;
