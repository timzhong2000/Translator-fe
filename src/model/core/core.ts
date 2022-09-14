import { ExhaustiveCheckError } from "@/utils/common/error";
import { action, makeObservable, observable, reaction } from "mobx";
import { Config } from "../config";
import {
  createPaddleOcr,
  createTesseractOcr,
  DefaultOcr,
  OcrBase,
  OcrConfig,
  OcrEngine,
} from "../ocr";

export class TCore {
  config: Config = new Config();
  ocr: OcrBase = new DefaultOcr();

  constructor() {
    makeObservable(this, {
      ocr: observable,
      setOcr: action,
    });

    // 单例不需要回收
    reaction(
      () => this.config.ocrConfig,
      () => this.switchOcrEngine(this.config.ocrConfig),
      { fireImmediately: true }
    );
  }

  setOcr(ocr: OcrBase) {
    this.ocr = ocr;
  }

  async switchOcrEngine(config: OcrConfig) {
    const type = config.type;

    switch (type) {
      case OcrEngine.PaddleOcrBackend:
        this.setOcr(await createPaddleOcr(config));
        break;
      case OcrEngine.TesseractFrontend:
        this.setOcr(await createTesseractOcr(config));
        break;
      default: {
        const exhaustiveCheck: never = type;
        throw new ExhaustiveCheckError(exhaustiveCheck);
      }
    }
  }
}

// 单例
export const core = new TCore();
