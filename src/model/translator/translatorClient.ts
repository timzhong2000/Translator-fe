import axios from "axios";
import { logger, LogType } from "@/utils/logger";
import { TranslatorBase } from "./base";
import { TranslateResult, TranslateLevel, TranslatorConfig } from "./types";

export enum CacheStatus {
  MISS,
  HIT,
  PUT,
}

export class TranslatorClient extends TranslatorBase {
  constructor(private config: TranslatorConfig) {
    super();
  }

  private record(status: CacheStatus) {
    logger.record(LogType.TRANSLATOR_LOCAL_CACHE, status);
  }

  protected async _translate(srcText: string) {
    const cache = this.getCache(srcText);
    if (cache) {
      this.record(CacheStatus.HIT);
      return JSON.parse(cache) as TranslateResult;
    }
    this.record(CacheStatus.MISS);
    try {
      const res = await axios.get<{ payload: TranslateResult }>(
        this.getUrl(encodeURIComponent(srcText))
      );
      const payload = res.data.payload;
      if (payload.success) {
        this.putCache(payload);
      }
      return payload;
    } catch (err) {
      return this.getFailResponse(srcText);
    }
  }

  private getUrl(srcText: string) {
    const base = `${this.config.url}/api/${this.config.provider}/${this.config.srcLang}/${this.config.destLang}/${srcText}`;
    if (this.hasKey()) return `${base}?key=${this.config.secretKey}`;
    else return base;
  }

  private getCache(srcText: string) {
    const key = JSON.stringify({
      provider: this.config.provider,
      srcLang: this.config.srcLang,
      destLang: this.config.destLang,
      srcText: srcText,
    });
    return localStorage.getItem(key);
  }

  private putCache(result: TranslateResult) {
    localStorage.setItem(result.src, JSON.stringify(result));
    this.record(CacheStatus.PUT);
  }

  private getFailResponse(srcText: string): TranslateResult {
    return {
      success: false,
      level: TranslateLevel.AI,
      src: srcText,
      dest: "服务器错误",
      srcLang: this.config.srcLang,
      destLang: this.config.destLang,
      provider: {
        uid: -1,
        name: "",
      },
    };
  }

  setConfig(config: TranslatorConfig) {
    this.config = config;
  }

  hasKey() {
    return (
      typeof this.config.secretKey === "string" && this.config.secretKey !== ""
    );
  }
}
