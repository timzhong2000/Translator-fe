import { reject } from "lodash-es";
import { createWorker, WorkerOptions } from "tesseract.js";
import { UninitializedError } from "..";
import { OcrBase } from "../base";
import { OcrLangType, OcrResult, OcrStage } from "../types";

export interface TesseractOcrConfig {
  workerConfig: Partial<WorkerOptions>;
  language: OcrLangType;
}

const defaultWorkerConfig: Partial<WorkerOptions> = {
  corePath: "/vendor/tesseract/tesseract-core.wasm.js",
  langPath: "/vendor/tesseract/tessdata_fast",
  workerPath: "/vendor/tesseract/worker.min.js",
  errorHandler: (err) => console.error(err),
  logger: (ev) => console.log(ev),
  gzip: false,
  cacheMethod: "none",
};

// tesseract输入blob有问题
// wip: 解决tesseract的blob输入问题
function blobToDataURL(blob: Blob) {
  return new Promise<string>((resolve) => {
    const a = new FileReader();
    a.onload = (e) => {
      e.target?.result
        ? resolve(e.target.result as string)
        : reject("raed file error");
    };
    a.readAsDataURL(blob);
  });
}

export type TesseractStatus =
  | "loading tesseract core"
  | "loading tesseract core failed"
  | "initializing tesseract"
  | "initializing tesseract failed"
  | "initializing api"
  | "initializing api failed"
  | "recognizing text"
  | "idle";

class _TesseractOcr extends OcrBase {
  private worker?: Tesseract.Worker;

  constructor(protected config: TesseractOcrConfig, init: Promise<any>) {
    super(init);
    init.then((worker) => (this.worker = worker));
    (window as any).tess = this;
  }

  static async create(config: TesseractOcrConfig) {
    return new _TesseractOcr(
      config,
      (async () => {
        const worker = createWorker({
          ...defaultWorkerConfig,
          ...config.workerConfig,
        });
        await worker.load();
        await worker.loadLanguage(config.language);
        await worker.initialize(config.language);
        return worker;
      })()
    );
  }

  public destroy() {
    this.worker?.terminate();
  }

  protected async _recognize(pic: Blob | File): Promise<OcrResult[]> {
    if (!this.worker) throw new UninitializedError();
    this.setOcrStage(OcrStage.BUSY);
    try {
      const {
        data: { text: text },
      } = await this.worker.recognize(await blobToDataURL(pic));
      return [
        {
          area: Array(4).fill({ x: 0, y: 0 }),
          text: _TesseractOcr.removeStopWords(text),
          confidence: 1,
        },
      ];
    } catch (err) {
      console.log(err);
      return [];
    } finally {
      this.setOcrStage(OcrStage.IDLE);
    }
  }

  private static removeStopWords(text: string) {
    text = text.replaceAll(/\s|\d/g, "");
    text = text.replaceAll("。", "; ");
    text = text.replaceAll(/[|[\]「\n]/g, "");
    return text;
  }
}

export type TesseractOcr = typeof _TesseractOcr;
export const createTesseractOcr = _TesseractOcr.create;
