import "./globals.css";

import { ConditionalSiteChrome } from "@/components/conditional-site-chrome";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
