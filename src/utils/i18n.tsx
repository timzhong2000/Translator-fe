import LanguageDetector from "i18next-browser-languagedetector";
import i18n from "i18next";
import enUsTrans from "../../public/locales/en-us.json";
import zhCnTrans from "../../public/locales/zh-cn.json";
import jaJpTrans from "../../public/locales/ja-jp.json";

import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enUsTrans,
      },
      zh: {
        translation: zhCnTrans,
      },
      jp: {
        translation: jaJpTrans,
      },
    },
    fallbackLng: "zh",
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
