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
  // logger: (ev) => console.log(ev),
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
  restartInterval: NodeJS.Timer;

  constructor(private config: TesseractOcrConfig, init: Promise<any>) {
    super(init);
    init.then((worker) => (this.worker = worker));
    (window as any).tess = this;
    this.restartInterval = setInterval(()=>this.restart(), 1000 * 60);
  }

  static async create(config: TesseractOcrConfig) {
    return new _TesseractOcr(
      config,
      _TesseractOcr.createWorker(config)
    );
  }

  static async createWorker(config: TesseractOcrConfig){
    const worker = createWorker({
      ...defaultWorkerConfig,
      ...config.workerConfig,
    });
    await worker.load();
    await worker.loadLanguage(config.language);
    await worker.initialize(config.language);
    return worker;
  }

  public async restart(){
    this.setOcrStage(OcrStage.BUSY);
    this.worker?.terminate();
    this.worker = await _TesseractOcr.createWorker(this.config)
    this.setOcrStage(OcrStage.IDLE);
  }

  public destroy() {
    clearInterval(this.restartInterval);
    this.worker?.terminate();
  }

  protected async _recognize(pic: Blob | File): Promise<OcrResult[]> {
    if (!this.worker) throw new UninitializedError();
    this.setOcrStage(OcrStage.BUSY);
    try {
      const file = new File([pic], "pic.png");
      const res = await this.worker.recognize(file);
      console.log(res.data.confidence);
      const {
        jobId,
        data: { text, confidence },
      } = res;
      return [
        {
          area: Array(4).fill({ x: 0, y: 0 }),
          text: confidence > 75 ? _TesseractOcr.removeStopWords(text): "",
          confidence: confidence,
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
