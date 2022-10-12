import { createWorker, OEM, PSM, WorkerOptions } from "tesseract.js";
import { UninitializedError } from "..";
import { OcrBase, OcrImage } from "../base";
import { OcrEngine, OcrResult, OcrStage, TesseractOcrConfig } from "@/types";
import { simd } from "wasm-feature-detect";
import { ImageHelper } from "@timzhong2000/browser-image-helper";
import { logger, LogType } from "@/utils/logger";

const createDefaultWorkerConfig = (enableSimd: boolean) => {
  return {
    corePath: `/vendor/tesseract/tesseract-core${
      enableSimd ? "-simd" : ""
    }.wasm.js`,
    langPath: "/vendor/tesseract/tessdata",
    workerPath: "/vendor/tesseract/worker.min.js",
    errorHandler: (err) => console.error(err),
    // logger: (ev) => console.log(ev),
    gzip: false,
    cacheMethod: "none",
  } as Partial<WorkerOptions>;
};

export type TesseractStatus =
  | "loading tesseract core"
  | "loading tesseract core failed"
  | "initializing tesseract"
  | "initializing tesseract failed"
  | "initializing api"
  | "initializing api failed"
  | "recognizing text"
  | "idle";

class TesseractOcr extends OcrBase {
  readonly type = OcrEngine.TesseractFrontend;

  private worker?: Tesseract.Worker;
  restartInterval: NodeJS.Timer;

  constructor(private config: TesseractOcrConfig, init: Promise<any>) {
    super(init);
    init.then((worker) => (this.worker = worker));
    (window as any).tess = this;
    this.restartInterval = setInterval(() => this.restart(), 1000 * 60);
  }

  static async create(config: TesseractOcrConfig) {
    return new TesseractOcr(config, TesseractOcr.createWorker(config));
  }

  static async createWorker(config: TesseractOcrConfig) {
    const tesseractInitEnd = logger.timing(LogType.TESSERACT_START);
    const worker = createWorker({
      ...createDefaultWorkerConfig(await simd()),
      ...config.workerConfig,
      errorHandler: (err) => {
        logger.print(LogType.TESSERACT_CRASH, "receive error", err);
      },
    });
    await worker.load();
    await worker.loadLanguage(config.lang);
    await worker.initialize(config.lang);
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
    tesseractInitEnd();
    return worker;
  }

  public async restart() {
    this.setOcrStage(OcrStage.BUSY);
    this.worker?.terminate();
    this.worker = await TesseractOcr.createWorker(this.config);
    this.setOcrStage(OcrStage.IDLE);
  }

  public destroy() {
    clearInterval(this.restartInterval);
    this.worker?.terminate();
  }

  protected async _recognize(pic: OcrImage): Promise<OcrResult> {
    if (!this.worker) throw new UninitializedError();
    this.setOcrStage(OcrStage.BUSY);
    try {
      const endImageHelperTimer = logger.timing(LogType.TRANSFORM_IMAGE_FORMAT);
      const imageFile = await new ImageHelper(pic).toFile("pic.png");
      endImageHelperTimer();
      const endTesseractProcessTimer = logger.timing(LogType.TESSERACT_PROCESS);
      const res = await this.worker.recognize(imageFile);
      endTesseractProcessTimer();
      const {
        data: { symbols, confidence },
      } = res;
      if (confidence < 70) return [];
      return symbols.map((symbol) => ({
        area: [
          { x: symbol.bbox.x0, y: symbol.bbox.y0 },
          { x: symbol.bbox.x1, y: symbol.bbox.y0 },
          { x: symbol.bbox.x1, y: symbol.bbox.y1 },
          { x: symbol.bbox.x0, y: symbol.bbox.y1 },
        ],
        text: TesseractOcr.removeStopWords(symbol.text),
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
    return TesseractOcr.removeStopWords(
      results.map((res) => res.text).join("")
    );
  }

  static replaceRule = [/\s|\d/g, "。", /[-|[\]「\n]/g];

  private static removeStopWords(text: string) {
    this.replaceRule.forEach((rule) => (text = text.replaceAll(rule, "")));
    return text;
  }
}

export const createTesseractOcr = TesseractOcr.create;
