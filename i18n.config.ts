import kurdish from "@/locales/kr.json";
import arabic from "@/locales/ar.json";
import english from "@/locales/en.json";

export default defineI18nConfig(() => ({
  locale: "kr",
  messages: {
    kr: kurdish,
    en: english,
    ar: arabic,
  },
}));
