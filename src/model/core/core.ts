import { ExhaustiveCheckError } from "@/utils/common/error";
import { action, makeObservable, observable, reaction } from "mobx";
import { config, Config } from "../config";
import {
  createPaddleOcr,
  createTesseractOcr,
  DefaultOcr,
  OcrBase,
  OcrConfig,
  OcrEngine,
} from "../ocr";
import { PreProcessorModel } from "../preProcessor";
import {
  TranslatorBase,
  TranslatorClient,
  TranslatorConfig,
} from "../translator";
import { PauseTranslator } from "../translator/pauseTranslator";

export class TCore {
  config: Config = config;

  /* observable start */
  ocr: OcrBase = new DefaultOcr();
  translator: TranslatorBase = new PauseTranslator(
    this.config.translatorConfig
  );
  preProcessor: PreProcessorModel = new PreProcessorModel();
  /* observable end */

  constructor() {
    makeObservable(this, {
      ocr: observable,
      translator: observable,
      preProcessor: observable,
      switchOcrEngine: action,
      switchTranslator: action,
    });

    // 单例不需要回收
    reaction(
      () => this.config.ocrConfig,
      () => this.switchOcrEngine(this.config.ocrConfig),
      { fireImmediately: true }
    );

    reaction(
      () => this.config.translatorConfig,
      () => this.switchTranslator(this.config.translatorConfig),
      { fireImmediately: true }
    );
  }

  async switchOcrEngine(config: OcrConfig) {
    const type = config.type;
    switch (type) {
      case OcrEngine.PaddleOcrBackend:
        this.ocr = await createPaddleOcr(config);
        break;
      case OcrEngine.TesseractFrontend:
        this.ocr = await createTesseractOcr(config);
        break;
      default: {
        const exhaustiveCheck: never = type;
        throw new ExhaustiveCheckError(exhaustiveCheck);
      }
    }
  }

  switchTranslator(config: TranslatorConfig) {
    if (!config.enabled) {
      this.translator = new PauseTranslator(config);
      return;
    }

    if (this.translator instanceof TranslatorClient) {
      this.translator.setConfig(config);
    } else {
      this.translator = new TranslatorClient(config);
    }
  }
}

// 单例
export const core = new TCore();
