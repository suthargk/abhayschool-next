import Image from "next/image";
import { useTranslations } from "next-intl";

export function HighlightRow({ images }) {
  const t = useTranslations("landing.campusHighlights");

  return (
    <div className="flex gap-5 lg:gap-10 [--tr-scale:0.75] lg:[--tr-scale:1]">
      {images.map((img) => {
        const transform = `translateY(calc(var(--tr-scale) * ${img.translateY}px)) translateX(calc(var(--tr-scale) * ${img.translateX}px)) rotate(calc(var(--tr-scale) * ${img.rotate}deg))`;

        if (img.captionKey) {
          return (
            <div
              key={img.id}
              style={{ transform }}
              className="min-w-60 lg:min-w-72"
            >
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold  bg-clip-text text-transparent bg-gradient-to-b from-[#df4fca] to-[#ed4492] text-center w-full">
                {t(img.captionKey)}
              </h2>
            </div>
          );
        }

        return (
          <div
            key={img.id}
            style={{ transform }}
            className="rounded-2xl md:rounded-3xl overflow-hidden w-full h-36 md:h-44 lg:h-52 relative bg-violet-50 dark:bg-zinc-900"
          >
            <Image
              src={img.imgUrl}
              width={500}
              height={500}
              className="w-full h-full object-center object-cover absolute"
              alt={img.alt}
              draggable="false"
            />
          </div>
        );
      })}
    </div>
  );
}
