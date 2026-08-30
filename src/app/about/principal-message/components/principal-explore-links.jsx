import Link from "next/link";
import { Award, BookOpen, Building2, Images } from "lucide-react";
import { useTranslations } from "next-intl";

const LINKS = [
  { href: "/academics", icon: BookOpen, id: "academics" },
  { href: "/about/facilities", icon: Building2, id: "facilities" },
  { href: "/achievements/toppers", icon: Award, id: "achievements" },
  { href: "/gallery", icon: Images, id: "gallery" },
];

export function PrincipalExploreLinks() {
  const t = useTranslations("principalMessage.principalExploreLinks");

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("heading")}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group space-y-3 rounded-xl border bg-card p-6 transition-colors hover:border-violet-300 dark:hover:border-violet-800"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <link.icon className="size-5" />
            </span>
            <h3 className="font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400">
              {t(`links.${link.id}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(`links.${link.id}.description`)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
