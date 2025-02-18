import { ReactNode } from "react";
import { notFound } from "next/navigation"; // For handling unsupported locales
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/Moives/LanguageSwitcher";
import { ToastContainer } from "react-toastify";
import '../globals.css'
import { Providers } from "../providers";

export default async function LocaleLayout({
  children,
  params, // Get params directly
}: {
  children: ReactNode;
  params: { locale: string };  // Dynamic locale param
}) {
  // Await the params to get the locale correctly
  const { locale } = await params;

  // If the locale is invalid, show a 404 page
  const supportedLocales = ["en", "fr"];
  if (!supportedLocales.includes(locale)) {
    notFound();  // Trigger 404 for unsupported locales
  }

  // Ensure messages are loaded based on the current locale
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head />
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ToastContainer />
            <LanguageSwitcher />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
