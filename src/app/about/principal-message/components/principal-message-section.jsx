import Image from "next/image";
import { useTranslations } from "next-intl";

import { ContentRenderer } from "@/components/news-notices/content-renderer";

export function PrincipalMessageSection({ item }) {
  const t = useTranslations("principalMessage.principalMessageSection");

  return (
    <section className="mx-auto max-w-3xl space-y-10">
      <ContentRenderer content={item.content} />

      {item.signatureUrl || item.principalName ? (
        <div className="space-y-3 border-t pt-8">
          <p className="text-sm text-muted-foreground">{t("regards")}</p>
          {item.signatureUrl ? (
            <Image
              src={item.signatureUrl}
              alt={
                item.principalName
                  ? t("signatureAltNamed", { name: item.principalName })
                  : t("signatureAlt")
              }
              width={200}
              height={75}
              className="h-auto w-40 object-contain"
              unoptimized
            />
          ) : null}
          <div>
            {item.principalName ? (
              <p className="font-semibold">{item.principalName}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {item.designation || t("defaultDesignation")}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
