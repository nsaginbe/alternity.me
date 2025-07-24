import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import kz from "./locales/kz.json";

i18n
  .use(LanguageDetector) // определение языка из браузера
  .use(initReactI18next) // подключение к React
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      kz: { translation: kz }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // для React не нужно экранировать
    }
  });

export default i18n;
