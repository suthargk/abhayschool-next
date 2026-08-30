import { Video } from "lucide-react";
import { useTranslations } from "next-intl";

function toEmbedUrl(videoUrl) {
  let url;
  try {
    url = new URL(videoUrl);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (url.pathname.startsWith("/embed/")) {
      return `https://www.youtube-nocookie.com${url.pathname}`;
    }
    return null;
  }

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }

  if (host === "player.vimeo.com") {
    return url.href;
  }

  return null;
}

export function PrincipalVideo({ videoUrl }) {
  const t = useTranslations("principalMessage.principalVideo");
  const embedUrl = videoUrl ? toEmbedUrl(videoUrl) : null;
  if (!embedUrl) return null;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
          <Video className="size-4" />
          {t("badge")}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("heading")}
        </h2>
      </div>

      <div className="aspect-video overflow-hidden rounded-2xl border bg-card">
        <iframe
          src={embedUrl}
          title={t("iframeTitle")}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
