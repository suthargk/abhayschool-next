import React from "react";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
// TODO: swap these placeholder illustrations for real campus/student photography or a short video.
import webpImage from "../../../../public/peppa_hero.png";
import peppaPigImage from "../../../../public/peppa_pig.png";
import peppaPigFairyImage from "../../../../public/peppa_fairy.png";

import { Button } from "@/components/ui/button";
import { GlitterBackground } from "@/components/backgrounds/glitter-background";
import { FestivalBanner } from "@/components/festival-banner";
import { getActiveFestival } from "@/lib/festival";

const Hero = () => {
  const festival = getActiveFestival();
  const t = useTranslations("landing.hero");

  return (
    <div className="relative flex flex-col items-center gap-8">
      <GlitterBackground
        preset="festive"
        colors={festival?.blobColors}
        sparkleColors={festival?.sparkleColors}
        sparkleCount={24}
      />
      <div className="flex flex-col items-center gap-6 text-center pt-24">
        <FestivalBanner />
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8371fa] dark:text-[#c25ff9]">
          {t("schoolName")}
        </p>
        <h1 className="flex flex-col">
          <span className="text-6xl font-semibold">
            {t("taglineLine1")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
              {t("taglineLine2")}
            </span>
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {t("description")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/about">{t("exploreSchool")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#admissions">{t("admissions")}</Link>
          </Button>
        </div>

        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
          {t("affiliation")}
        </p>
      </div>

      <div className="flex">
        <Image
          src={webpImage}
          alt="Students at Shri Abhay Nobles Senior Secondary School"
          draggable={false}
          width={500}
          height={500}
        />
        <div className="flex flex-col justify-between">
          <Image
            src={peppaPigFairyImage}
            alt=""
            className="self-end"
            draggable={false}
            width={200}
            height={200}
          />
          <Image src={peppaPigImage} alt="" draggable={false} width={200} height={200} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
