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

export type OcrResult = string