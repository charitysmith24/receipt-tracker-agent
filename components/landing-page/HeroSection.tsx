import React from "react";
import { Hero } from "../ui/animated-hero";
import PDFDropzone from "../PDFDropzone";

function HeroSection() {
  return (
    <section id="hero" className="pb-16 md:pb-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Hero />
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-lg shadow-primary/20 dark:shadow-teal-500/20 overflow-hidden dark:border-teal-100 dark:bg-teal-950">
            <div className="p-6 md:p-8 relative">
              <PDFDropzone />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
