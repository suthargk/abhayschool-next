import Image from "next/image";
import { MessageCircleHeart } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrincipalHero({ item }) {
  const t = useTranslations("principalMessage.principalHero");
  const name = item?.principalName || t("defaultName");
  const designation = item?.designation || t("defaultDesignation");

  return (
    <section className="flex flex-col items-center gap-6 px-4 pb-4 pt-28 text-center sm:pt-32">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
        <MessageCircleHeart className="size-4" />
        {t("badge")}
      </span>

      <h1 className="text-3xl font-semibold sm:text-5xl">
        <span className="block">{t("titleLine1")}</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#8371fa] to-[#c25ff9]">
          {t("titleLine2")}
        </span>
      </h1>

      {item?.photoUrl ? (
        <Image
          src={item.photoUrl}
          alt={name}
          width={320}
          height={320}
          className="size-32 rounded-full border object-cover sm:size-40"
          unoptimized
        />
      ) : null}

      {item?.quote ? (
        <p className="max-w-2xl text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
          &ldquo;{item.quote}&rdquo;
        </p>
      ) : null}

      <div className="space-y-0.5">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{designation}</p>
      </div>
    </section>
  );
}
