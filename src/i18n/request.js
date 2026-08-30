import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, NAMESPACES } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const modules = await Promise.all(
    NAMESPACES.map((namespace) => import(`../../messages/${locale}/${namespace}.json`))
  );

  const messages = Object.fromEntries(
    NAMESPACES.map((namespace, index) => [namespace, modules[index].default])
  );

  return { locale, messages };
});
