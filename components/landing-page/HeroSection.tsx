import React from "react";
import { Hero } from "../ui/animated-hero";

function HeroSection() {
  return (
    <section>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Hero />
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden dark:border-teal-100 dark:bg-teal-950">
          <div className="p-6 md:p-8 relative">
            <p>PDF</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
