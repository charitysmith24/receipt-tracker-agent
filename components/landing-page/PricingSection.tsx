"use client";

import { useState } from "react";
import { RadioGroup, Radio } from "@headlessui/react";
import { CheckIcon } from "lucide-react";

type Frequency = {
  value: "monthly" | "annually";
  label: string;
  priceSuffix: string;
};

type Tier = {
  name: string;
  id: string;
  href: string;
  price: { monthly: string; annually: string };
  description: string;
  features: string[];
  mostPopular: boolean;
};

const frequencies: Frequency[] = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];

const tiers: Tier[] = [
  {
    name: "Free",
    id: "tier-free",
    href: "/manage-plan",
    price: { monthly: "$0.00", annually: "$0.00" },
    description: "A free trial of our platform! All you need to do is sign up.",
    features: ["2 Scans", "Basic Data Extraction", "7-Day History"],
    mostPopular: false,
  },
  {
    name: "Starter",
    id: "tier-starter",
    href: "/manage-plan",
    price: { monthly: "$5.99", annually: "$59.00" },
    description: "A taste of expensing goodness!",
    features: ["50 Scans", "Advanced Data Extraction", "30-Day History"],
    mostPopular: true,
  },
  {
    name: "Pro",
    id: "tier-creator",
    href: "/manage-plan",
    price: { monthly: "$9.99", annually: "$99.00" },
    description: "Pro features for the power user!",
    features: [
      "300 Scans",
      "Advanced Data Extraction",
      "AI Analysis",
      "Expense categories & tags",
      "Advanced export options",
      "Unlimited History",
    ],
    mostPopular: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function PricingSection() {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 ">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-accent/90 dark:text-teal-700">
            Pricing
          </h2>
          <p className="mt-2 text-5xl font-semibold tracking-tight text-muted-foreground dark:text-white sm:text-6xl">
            Pricing that grows with you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 dark:text-gray-300 sm:text-xl">
          Choose an affordable plan that’s packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </p>
        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Payment frequency">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-400 dark:bg-white/5 p-1 text-center text-xs font-semibold text-white"
            >
              {frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className="cursor-pointer rounded-full px-2.5 py-1 data-checked:bg-accent/80 dark:data-checked:bg-teal-500"
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.id;
            const isDefaultSelected = !selectedTier && tier.mostPopular; // Ensure the most popular tier is preselected only if no selection is made.

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={classNames(
                  isSelected || isDefaultSelected
                    ? "bg-gradient-to-br from-white to-accent/50 dark:from-primary/0 dark:to-primary/10 ring-4 ring-accent/80 shadow-lg scale-105 transition-transform"
                    : "ring-1 ring-white/10",
                  "rounded-3xl p-8 xl:p-10 cursor-pointer transition-all duration-200",
                )}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      isSelected || isDefaultSelected
                        ? "text-accent/90 dark:text-teal-800"
                        : "text-gray-400 dark:text-white/50",
                      "text-lg font-semibold",
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p
                      className={classNames(
                        isSelected || isDefaultSelected
                          ? "bg-accent/80 dark:bg-teal-700 text-white"
                          : "text-gray-400 dark:text-white/50",
                        "rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200",
                      )}
                    >
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p
                  className={classNames(
                    isSelected || isDefaultSelected
                      ? "text-accent/95 dark:text-white"
                      : "text-gray-400 dark:text-white/50",
                    "mt-4 prose lg:prose-sm",
                  )}
                >
                  {tier.description}
                </p>
                <p
                  className={classNames(
                    isSelected || isDefaultSelected
                      ? "text-accent dark:text-white p-2 rounded-md"
                      : "text-gray-400 dark:text-white/50",
                    "mt-6 flex items-baseline gap-x-1 transition-all duration-200",
                  )}
                >
                  <span className="text-4xl font-semibold tracking-tight">
                    {tier.price[frequency.value]}
                  </span>
                  <span className="text-sm font-semibold">
                    {frequency.priceSuffix}
                  </span>
                </p>

                <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={classNames(
                    isSelected || isDefaultSelected
                      ? "bg-accent/80 dark:bg-teal-700 text-white shadow-sm hover:bg-accent/60 focus-visible:outline-accent/60"
                      : "bg-primary/50 text-white hover:bg-white/20 focus-visible:outline-white",
                    "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2",
                  )}
                >
                  {!tier.id.includes("free") ? "Buy Plan" : "Get started"}
                </a>
                <ul
                  role="list"
                  className={classNames(
                    isSelected || isDefaultSelected
                      ? "text-accent/95 dark:text-teal-50"
                      : "text-gray-400 dark:text-white/50",
                    "mt-8 xl:mt-10 space-y-3 text-sm",
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        aria-hidden="true"
                        className={classNames(
                          isSelected || isDefaultSelected
                            ? "text-accent/90 dark:text-teal-700"
                            : "text-gray-400 dark:text-white/50",
                          "h-6 w-5 flex-none",
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PricingSection;
