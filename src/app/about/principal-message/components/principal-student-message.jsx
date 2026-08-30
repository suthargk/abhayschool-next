import { useTranslations } from "next-intl";

export function PrincipalStudentMessage() {
  const t = useTranslations("principalMessage.principalStudentMessage");

  return (
    <section className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-[#8371fa] to-[#c25ff9] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-white/80">
        {t("eyebrow")}
      </p>
      <p className="mt-6 text-xl font-medium leading-relaxed sm:text-2xl">
        {t("message")}
      </p>
    </section>
  );
}
