"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, CheckCircle, Clock, TrendingUp, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Receipt Scanning", "Spending Insights", "Expense Reports"],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-4 bg-teal-500 text-teal-50"
            >
              Read our launch article <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-teal-950 dark:text-teal-50">
                Intelligent Expenses Management
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-teal-500"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-wide text-muted-foreground dark:text-accent-foreground max-w-2xl text-center mt-2">
              Managing your personal or business finances shouldn&apos;t be a
              hassle. Say goodbye to outdated, time-consuming methods and
              embrace the future of smart financial tracking with{" "}
              <span className="text-2xl  bg-linear-to-tl from-primary/85 to-teal-600/65 bg-clip-text text-transparent dark:from-teal-600/95 dark:to-teal-200 font-bold">
                ReceiptIQ {""}
              </span>
              Agent!
            </p>
            <ul className="mt-4 space-y-3 max-w-2xl mx-auto text-center">
              <li className="flex items-center justify-center gap-3">
                <CheckCircle className="text-teal-500" size={20} />
                <span className="text-teal-950 dark:text-teal-50">
                  <strong>Automate Expense Tracking</strong> – No more manual
                  data entry!
                </span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <Clock className="text-teal-500" size={20} />
                <span className="text-teal-950 dark:text-teal-50">
                  <strong>Eliminate Manual Errors</strong> – Save time & ensure
                  accuracy.
                </span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <TrendingUp className="text-teal-500" size={20} />
                <span className="text-teal-950 dark:text-teal-50">
                  <strong>Gain Actionable Insights Instantly</strong> – Make
                  data-driven decisions.
                </span>
              </li>
            </ul>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl text-center mt-5 font-semibold text-teal-600 dark:text-teal-400">
              ✨ Experience smarter, stress-free financial management! ✨
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button
              size="lg"
              className="gap-4 bg-accent/80 hover:border hover:border-primary/80 hover:bg-teal-500"
              variant="default"
            >
              Learn More <Brain className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              className="gap-4 hover:bg-teal-500 hover:text-white hover:border-teal-800 dark:border-teal-50"
              variant="outline"
            >
              Get Started <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
