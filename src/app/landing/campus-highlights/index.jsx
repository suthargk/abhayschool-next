"use client";
import React, { useRef } from "react";
import webpImage from "../../../../public/copter.webp";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Stars from "../../../../public/icons/stars";
import { campusImages, campusLowerImages, mobileImages } from "./data";
import { HighlightRow } from "./highlight-row";

const CampusHighlights = () => {
  const containerRef = useRef(null);
  const t = useTranslations("landing.campusHighlights");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const imageValue = useTransform(scrollYProgress, [0, 1], ["500%", "-100%"]);

  return (
    <section ref={containerRef} className="relative">
      <motion.div
        className="pointer-events-none absolute top-0 -z-10"
        style={{ translateX: imageValue }}
      >
        <Image
          width={500}
          height={500}
          src={webpImage}
          alt=""
          draggable={false}
        />
      </motion.div>

      <div className="flex flex-col items-center gap-2 px-4">
        <h4 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          <span>{t("heading")}</span>
        </h4>
        <div className="text-zinc-700 text-center dark:text-zinc-500 max-w-md">
          {t("description")}
        </div>
        <Stars />
      </div>

      <div className="flex flex-col gap-6 px-4 md:hidden">
        <div className="rounded-2xl bg-violet-50 dark:bg-zinc-900 px-6 py-5 text-center">
          <h2 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#df4fca] to-[#ed4492]">
            {t("mobileHeading")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mobileImages.map((img, index) => (
            <div
              key={`${img.id}-${index}`}
              className="rounded-2xl overflow-hidden aspect-square relative bg-violet-50 dark:bg-zinc-900"
            >
              <Image
                src={img.imgUrl}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-center object-cover"
                alt={img.alt}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex md:flex-col gap-14 lg:gap-20">
        <HighlightRow images={campusImages} />
        <HighlightRow images={campusLowerImages} />
      </div>
    </section>
  );
};

export default CampusHighlights;
