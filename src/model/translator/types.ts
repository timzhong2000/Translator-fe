import ISO963_1 from "@/types/ISO963";

export enum TranslatorEvent {
  ON_REMOTE_SUCCESS,
  ON_REMOTE_ERROR,
  ON_CACHE_MISS,
  ON_CACHE_HIT,
  ON_SETTING_CHANGE,
  ON_ENABLED,
  ON_DISABLED,
  // ON_STATUS_CHANGE,
}

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
  url: string;
  secretKey: string;
  provider: string; // 翻译引擎
  srcLang: ISO963_1;
  destLang: ISO963_1;
  cache: boolean;
}
