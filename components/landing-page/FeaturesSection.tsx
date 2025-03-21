import { ChartBar, Search, Upload } from "lucide-react";
import React from "react";

function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              Powerful Features
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Our AI-powered platform transforms how you handle receipts and
              track expenses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900">
                <Upload className="size-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-medium">Easy Receipt Upload</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Drag and drop your receipts PDF receipts for instant scanning
                and processing.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900">
                <Search className="size-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-medium">
                Smart Expense Categorization
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Our AI automatically extracts and categorizes your receipts,
                making expense tracking a breeze.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900">
                <ChartBar className="size-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-medium">Detailed Expense Reports</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Generate detailed reports with charts and summaries to help you
                understand your spending patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
