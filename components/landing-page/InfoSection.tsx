import Image from "next/image";

function InfoSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          Effortless Expense Management with AI-Powered Insights
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-accent/95 to-teal-500/10 p-px dark:from-teal-700 dark:to-teal-100">
              <Image
                src="/Info.webp"
                className="rounded-[15px]"
                alt="payments illustration dark"
                width={612}
                height={408}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              Gemini is evolving to be more than just the models.{" "}
              <span className="text-accent-foreground font-bold">
                It supports an entire ecosystem
              </span>{" "}
              — from products innovate.
            </p>
            <p className="text-muted-foreground">
              It supports an entire ecosystem — from products to the APIs and
              platforms helping developers and businesses innovate
            </p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>
                  ReceiptIQ&apos;s mission is to eliminate the complexities of
                  expense management by seamlessly integrating your financial
                  queries with our advanced AI agents, providing clear insights
                  into your spending without the usual hassles.
                </p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">John Doe, CEO</cite>
                  <Image
                    className="h-5 w-fit dark:invert"
                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                    alt="Nvidia Logo"
                    height="20"
                    width="20"
                  />
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
