"use client"
import { notFound , useParams } from "next/navigation"; // For handling unsupported locales
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/Moives/LanguageSwitcher";
import { ToastContainer } from "react-toastify";
import '../globals.css'
import { Providers } from "../providers";
import en from "@/messages/en.json"
import fr from "@/messages/fr.json"

const messages = {
  en, fr
}
export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Await the params to get the locale correctly
  const { locale } = useParams();
  const newlocale = locale ? String(locale) : 'en'
  // If the locale is invalid, show a 404 page
  const supportedLocales = ["en", "fr"];
  if (!supportedLocales.includes(newlocale)) {
    notFound();  // Trigger 404 for unsupported locales
  }

  // Ensure messages are loaded based on the current locale

  return (
    <html>
      <head />
      <body>
        <Providers>
          <NextIntlClientProvider locale={newlocale} messages={messages[newlocale as keyof typeof messages]}  timeZone="UTC">
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
