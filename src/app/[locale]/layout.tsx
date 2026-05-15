import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DirectionSync from "@/components/DirectionSync";
import Chatbot from "@/components/Chatbot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: {
      default: "NASMO",
      template: "%s | NASMO",
    },
    description:
      "NASMO - Professional maintenance services for heavy trucks, construction engines, and industrial vehicles across Algeria. 10+ years of experience.",
    keywords: [
      "NASMO",
      "heavy equipment maintenance",
      "truck maintenance",
      "construction machinery",
      "Algeria",
      "GCB",
      "Cosider",
      "mobile maintenance",
    ],
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dir}";`,
        }}
      />
      <Providers>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DirectionSync />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Chatbot />
        </NextIntlClientProvider>
      </Providers>
    </>
  );
}
