import { reject } from "lodash-es";
import { createWorker, OEM, PSM, WorkerOptions } from "tesseract.js";
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
    this.restartInterval = setInterval(() => this.restart(), 1000 * 60);
  }

  static async create(config: TesseractOcrConfig) {
    return new _TesseractOcr(config, _TesseractOcr.createWorker(config));
  }

  static async createWorker(config: TesseractOcrConfig) {
    const worker = createWorker({
      ...defaultWorkerConfig,
      ...config.workerConfig,
    });
    await worker.load();
    await worker.loadLanguage(config.language);
    await worker.initialize(config.language);
    await worker.setParameters({
      tessedit_ocr_engine_mode: OEM.TESSERACT_ONLY,
      tessedit_pageseg_mode: PSM.AUTO,
      preserve_interword_spaces: "1",
      tessjs_create_box: "0",
      tessjs_create_hocr: "0",
      tessjs_create_osd: "0",
      tessjs_create_tsv: "0",
      tessjs_create_unlv: "0",
    });
    return worker;
  }

  public async restart() {
    this.setOcrStage(OcrStage.BUSY);
    this.worker?.terminate();
    this.worker = await _TesseractOcr.createWorker(this.config);
    this.setOcrStage(OcrStage.IDLE);
  }

  public destroy() {
    clearInterval(this.restartInterval);
    this.worker?.terminate();
  }

  protected async _recognize(pic: Blob | File): Promise<OcrResult> {
    if (!this.worker) throw new UninitializedError();
    this.setOcrStage(OcrStage.BUSY);
    try {
      console.time("test");
      const file = new File([pic], "pic.png");
      const res = await this.worker.recognize(file);
      // console.log(res.data);
      const {
        jobId,
        data: { text, confidence },
      } = res;
      console.timeEnd("test");
      if (confidence < 70) return [];
      return res.data.symbols.map((symbol) => ({
        area: [
          { x: symbol.bbox.x0, y: symbol.bbox.y0 },
          { x: symbol.bbox.x1, y: symbol.bbox.y0 },
          { x: symbol.bbox.x1, y: symbol.bbox.y1 },
          { x: symbol.bbox.x0, y: symbol.bbox.y1 },
        ],
        text: _TesseractOcr.removeStopWords(symbol.text),
        confidence: symbol.confidence,
      }));
    } catch (err) {
      console.log(err);
      return [];
    } finally {
      this.setOcrStage(OcrStage.IDLE);
    }
  }

  toString(results: OcrResult): string {
    return _TesseractOcr.removeStopWords(
      results.map((res) => res.text).join("")
    );
  }

  static replaceRule = [/\s|\d/g, "。", /[-|[\]「\n]/g];
  private static removeStopWords(text: string) {
    this.replaceRule.forEach((rule) => (text = text.replaceAll(rule, "")));
    return text;
  }
}

export type TesseractOcr = typeof _TesseractOcr;
export const createTesseractOcr = _TesseractOcr.create;
