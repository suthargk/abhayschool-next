import { prisma } from "@/lib/prisma";

import { ShareTestimonialDialog } from "./components/share-testimonial-dialog";
import { TestimonialGrid } from "./components/testimonial-grid";

export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ position: "asc" }],
  });

  return (
    <div className="min-h-screen px-4 pb-16 pt-[100px] md:px-10 md:pt-[102px] lg:px-20">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                What Parents & Alumni Say
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Stories from the families and students who have been part of
                the Abhay Nobles community.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">
                  {testimonials.length}
                </span>{" "}
                {testimonials.length === 1 ? "testimonial" : "testimonials"}
              </span>
            </div>
          </div>
          <ShareTestimonialDialog />
        </div>

        {testimonials.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Testimonials will be published here soon.
            </p>
          </div>
        ) : (
          <TestimonialGrid testimonials={testimonials} />
        )}
      </div>
    </div>
  );
}
