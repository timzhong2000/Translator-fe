import { TranslatorBase } from "./base";
import { TranslateResult, TranslateLevel, TranslatorEvent, TranslatorConfig } from "./types";

export class PauseTranslator extends TranslatorBase {
  get config() {
    return this._config;
  }

  set config(config) {
    this._config = config;
    this.eventBus.next(TranslatorEvent.ON_SETTING_CHANGE);
  }

  constructor(private _config: TranslatorConfig) {
    super();
  }

  async translate(srcText: string): Promise<TranslateResult> {
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
