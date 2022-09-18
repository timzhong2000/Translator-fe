import ISO963_1 from "./ISO963";

export enum TranslateLevel {
  "AI",
  "USER",
  "VERIFIED",
}

export interface TranslateResult {
  success: boolean;
  level: TranslateLevel;
  src: string;
  dest: string;
  srcLang: string;
  destLang: string;
  provider: {
    uid: number;
    name: string;
  };
}

export interface TranslatorConfig {
  enabled: boolean;
  url: string;
  secretKey: string;
  provider: string; // 翻译引擎
  srcLang: ISO963_1;
  destLang: ISO963_1;
  cache: boolean;
}
