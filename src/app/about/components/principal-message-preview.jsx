import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

function extractText(node, out = []) {
  if (!node) return out;
  if (node.text) out.push(node.text);
  if (Array.isArray(node.content)) {
    for (const child of node.content) extractText(child, out);
  }
  return out;
}

function excerptFrom(content, maxLength = 220) {
  const text = extractText(content).join(" ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function PrincipalMessagePreview({ message }) {
  const t = useTranslations("about.principalMessagePreview");

  if (!message) return null;

  const excerpt = excerptFrom(message.content);

  return (
    <section className="grid grid-cols-1 items-center gap-8 rounded-2xl border bg-card p-8 sm:grid-cols-[auto_1fr] sm:p-10">
      {message.photoUrl ? (
        <Image
          src={message.photoUrl}
          alt={message.principalName || t("principalFallback")}
          width={160}
          height={160}
          className="mx-auto size-32 rounded-full border object-cover sm:size-40"
          unoptimized
        />
      ) : null}

      <div className="space-y-4 text-center sm:text-left">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
        {excerpt ? (
          <p className="italic text-muted-foreground">&ldquo;{excerpt}&rdquo;</p>
        ) : null}
        {message.principalName ? (
          <p className="font-medium">
            — {message.principalName}, {t("principalFallback")}
          </p>
        ) : null}
        <Button asChild variant="link" className="h-auto p-0">
          <Link href="/about/principal-message">{t("readFullMessage")}</Link>
        </Button>
      </div>
    </section>
  );
}
