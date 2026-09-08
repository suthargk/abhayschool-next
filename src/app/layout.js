import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

import { ConditionalSiteChrome } from "@/components/conditional-site-chrome";
import { ThemeProvider } from "@/components/theme-provider";

const SITE_NAME = "Shri Abhay Nobles Senior Secondary School";
const SITE_DESCRIPTION =
  "Shri Abhay Nobles Senior Secondary School, Takhatgarh (Pali) — affiliated with the Rajasthan Board of Secondary Education (RBSE), welcoming students from Nursery through Class XII.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/logo.png" }],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "School",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="overflow-x-hidden">
      <body className={`antialiased overflow-x-hidden`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
