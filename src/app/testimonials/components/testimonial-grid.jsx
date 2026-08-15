import Image from "next/image";
import { Quote, UserRound } from "lucide-react";

function TestimonialCard({ testimonial }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
      <Quote className="size-6 text-muted-foreground/40" />
      <p className="flex-1 text-sm leading-relaxed text-foreground">
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-3 border-t pt-4">
        <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {testimonial.photoUrl ? (
            <Image
              src={testimonial.photoUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <UserRound className="size-5 text-muted-foreground" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{testimonial.name}</p>
          {testimonial.designation ? (
            <p className="truncate text-xs text-muted-foreground">
              {testimonial.designation}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TestimonialGrid({ testimonials }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}
