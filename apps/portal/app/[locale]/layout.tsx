import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { AIChatWidget } from "@/components/ai-chat/AIChatWidget";
import { locales } from "@/navigation";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HiWhale Robotics",
  description: "Intelligent warehousing and material handling solutions",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansSC.variable}`}
    >
      <body className="antialiased">
        <Providers locale={locale} messages={messages} timeZone="Asia/Shanghai">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
          </div>
          <AuthModal />
          <AIChatWidget />
        </Providers>
        {/* Cloudflare Web Analytics（免费、无 Cookie、GDPR 友好） */}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "f15bf66a9a93456f983387535ab649f8"}'
        />
      </body>
    </html>
  );
}
