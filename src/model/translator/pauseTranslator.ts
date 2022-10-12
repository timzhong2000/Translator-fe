import { TranslatorBase } from "./base";
import { TranslateResult, TranslateLevel, TranslatorConfig } from "@/types";

export class PauseTranslator extends TranslatorBase {
  get config() {
    return this._config;
  }

  set config(config) {
    this._config = config;
  }

  constructor(private _config: TranslatorConfig) {
    super();
  }

  async _translate(srcText: string): Promise<TranslateResult> {
    return {
      success: false,
      level: TranslateLevel.AI,
      src: srcText,
      dest: "翻译已暂停",
      srcLang: this.config.srcLang,
      destLang: this.config.destLang,
      provider: {
        uid: -1,
        name: "",
      },
    };
  }
}
