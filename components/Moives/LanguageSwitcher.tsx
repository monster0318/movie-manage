"use client";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const path = usePathname();
  const {locale} = useParams()
  const changeLanguage = (locale: string) => {
    router.replace(`/${locale}/${path.split('/').slice(2).join('/')}`)
  };

  return (
    <div className="switch-language-bar inline-flex gap-2 w-full justify-center">
      <button className={`switch-lang-btn ${ locale == 'en' ? 'selected' : '' }`} onClick={() => changeLanguage("en")}>🇬🇧 English</button>
      <button className={`switch-lang-btn ${ locale == 'fr' ? 'selected' : '' }`}  onClick={() => changeLanguage("fr")}>🇫🇷 Français</button>
    </div>
  );
}
