"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { styled } from "@stitches/react";

const TestimonialCaption = styled("figcaption", {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  alignItems: "center",
});

const TestimonialQuote = styled("blockquote", {});

const TestimonialItem = ({ testimonial }) => {
  return (
    <div className="rounded-2xl p-4 bg-violet-50 dark:bg-zinc-900 dark:shadow-[inset_0_3px_0_0_rgb(39,39,42)] shadow-[inset_0_3px_0_0_rgb(237,233,254,1)]">
      <TestimonialCaption>
        {testimonial.photoUrl ? (
          <Image
            src={testimonial.photoUrl}
            alt=""
            width={50}
            height={50}
            unoptimized
            className="size-[50px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-zinc-800">
            <UserRound className="size-5 text-muted-foreground" />
          </span>
        )}
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>{testimonial.name}</div>
          {testimonial.designation ? <div>{testimonial.designation}</div> : null}
        </div>
      </TestimonialCaption>
      <TestimonialQuote>{testimonial.quote}</TestimonialQuote>
    </div>
  );
};

export default TestimonialItem;
