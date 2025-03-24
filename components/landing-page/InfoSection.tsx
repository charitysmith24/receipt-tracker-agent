import Image from "next/image";

function InfoSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          It&apos;s Like Having a Team of AI Experts Managing My Expenses 24/7
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
              ReceiptIQ&apos;s AI agents are incredible - I just ask questions
              naturally and{" "}
              <span className="text-accent-foreground font-bold">
                they understand exactly what I need to know about my expenses
              </span>{" "}
              — whether it&apos;s finding specific receipts or analyzing
              spending trends.
            </p>
            <p className="text-muted-foreground">
              What amazes me is how the AI agents work together - one analyzes
              my receipts, another categorizes expenses, and another provides
              detailed reports. It&apos;s like having a whole finance department
              in my pocket.
            </p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>
                  The AI agents have transformed our expense management
                  completely. They catch errors I would&apos;ve missed, flag
                  unusual spending patterns, and even suggest ways to optimize
                  our business expenses. It&apos;s not just automation -
                  it&apos;s like having intelligent financial advisors working
                  for me around the clock.
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
