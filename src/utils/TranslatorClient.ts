import { TranslatorConfig } from "@/types/globalConfig";
import { TranslateLevel, TranslateResult } from "@/types/Payload";
import axios from "axios";
import { logger, LogType } from "@/utils/logger";
export enum CacheStatus {
  MISS,
  HIT,
  PUT,
}

export declare class TranslatorClient {
  translate(srcText: string): Promise<TranslateResult>;
}

export class TranslatorClientBase implements TranslatorClient {
  constructor(
    private config: TranslatorConfig,
    private onError: (err: any) => any
  ) {}

  private record(status: CacheStatus) {
    logger.record(LogType.TRANSLATOR_LOCAL_CACHE, status);
  }

  async translate(srcText: string) {
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
      this.onError(err);
      return this.getFailResponse(srcText);
    }
  }

  hasKey() {
    return typeof this.config.key === "string" && this.config.key !== "";
  }

  private getUrl(srcText: string) {
    const base = `${this.config.url}/api/${this.config.provider}/${this.config.srcLang}/${this.config.destLang}/${srcText}`;
    if (this.hasKey()) return `${base}?key=${this.config.key}`;
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
}
