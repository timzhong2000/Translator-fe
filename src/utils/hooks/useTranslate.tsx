import { TranslatorConfig } from "@/types/globalConfig";
import { useEffect, useState } from "react";
import { TranslateLevel, TranslateResult } from "@/types/Payload";
import axios from "axios";

export const useTranslate = (config: TranslatorConfig, srcText: string) => {
  const [result, setResult] = useState<TranslateResult>();
  useEffect(() => {
    if (!srcText) return;
    (async function () {
      const url = `${config.url}/api/${config.provider}/${config.srcLang}/${config.destLang}/${srcText}`;
      console.log(`[translate hook] translate start ${url}`);
      const key = JSON.stringify({
        provider: config.provider,
        srcLang: config.srcLang,
        destLang: config.destLang,
        srcText: srcText,
      });
      const cache = localStorage.getItem(key);
      if (cache) {
        console.log("[Translate Hook] cache hit");
        setResult(JSON.parse(cache));
        console.log(`[translate hook] translate end ${url}`);
        return;
      }
      console.log("[Translate Hook] cache miss");
      try {
        const result = (await axios.get<{ payload: TranslateResult }>(url)).data
          .payload;
        if (result.success) {
          setResult(result)
          localStorage.setItem(key, JSON.stringify(result));
          console.log("[Translate Hook] cache put");
        }
      } catch (err) {
        setResult({
          success: false,
          level: TranslateLevel.AI,
          src: srcText,
          dest: "服务器错误",
          srcLang: config.srcLang,
          destLang: config.destLang,
          provider: {
            uid: -1,
            name: "",
          },
        });
        console.log(err);
      }
      console.log(`[translate hook] translate end ${url}`);
    })();
  }, [config, srcText]);
  return result;
};
