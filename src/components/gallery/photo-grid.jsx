"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ASPECTS = ["aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-square"];

export function GalleryPhotoGrid({ images, albumTitle }) {
  const [openIndex, setOpenIndex] = useState(null);
  const open = openIndex !== null;

  function showPrev() {
    setOpenIndex((i) => (i - 1 + images.length) % images.length);
  }

  function showNext() {
    setOpenIndex((i) => (i + 1) % images.length);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={`relative mb-3 block w-full overflow-hidden rounded-md border transition-opacity hover:opacity-90 break-inside-avoid ${ASPECTS[index % ASPECTS.length]}`}
          >
            <Image
              src={image.imageUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(next) => !next && setOpenIndex(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none [&>button]:text-white">
          <DialogTitle className="sr-only">
            {albumTitle} — photo {open ? openIndex + 1 : 0} of {images.length}
          </DialogTitle>
          {open ? (
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-black">
              <Image
                src={images[openIndex].imageUrl}
                alt=""
                fill
                className="object-contain"
                unoptimized
              />
              {images.length > 1 ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={showPrev}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={showNext}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                    {openIndex + 1} / {images.length}
                  </span>
                </>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
