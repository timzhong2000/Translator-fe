export interface Point {
  x: number;
  y: number;
}

export type OcrResult = OcrResultItem[];

export interface OcrResultItem {
  area: Point[]; // 长度为4
  text: string;
  confidence: number; // 0-1
}

/**
 * model 生命周期
 */
export enum OcrStage {
  INIT = "ocr.common.init", // 初始化中
  READY = "ocr.common.ready", // 初始化完毕，刚刚就绪
  IDLE = "ocr.common.idle", // 空闲
  BUSY = "ocr.common.busy", // 阻塞新请求
  FATAL = "ocr.common.fatal", // 加载时失败
}

export enum OcrEngine {
  DefaultOcr = "default_ocr",
  PaddleOcrBackend = "paddle_ocr_backend",
  TesseractFrontend = "tesseract_frontend",
}

export type OcrLangType = "jpn" | "eng" | "chi_sim" | "chi_tra" | "japan";

export type OcrConfig = PaddleOcrConfig | TesseractOcrConfig;

export interface TesseractOcrConfig {
  type: OcrEngine.TesseractFrontend;
  workerConfig: Partial<WorkerOptions>;
  lang: OcrLangType;
}

export interface PaddleOcrConfig {
  type: OcrEngine.PaddleOcrBackend;
  url: string;
  lang: string;
}

export function isPaddleOcrConfig(
  config: OcrConfig
): config is PaddleOcrConfig {
  return config.type === OcrEngine.PaddleOcrBackend;
}

export function isTesseractOcrConfig(
  config: OcrConfig
): config is TesseractOcrConfig {
  return config.type === OcrEngine.TesseractFrontend;
}
