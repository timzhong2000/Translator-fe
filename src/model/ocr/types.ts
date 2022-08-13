
export interface Point {
  x: number;
  y: number;
}

export interface OcrResult {
  area: Point[]; // 长度为4
  text: string;
  confidence: number; // 0-1
}

/**
 * modal生命周期
 */
export enum OcrStage {
  INIT = "ocr.common.init", // 初始化中
  READY = "ocr.common.ready", // 初始化完毕，刚刚就绪
  IDLE = "ocr.common.idle", // 空闲
  BUSY = "ocr.common.busy", // 阻塞新请求
  FATAL = "ocr.common.fatal", // 加载时失败
}

export enum OcrBackend {
  PaddleOcrBackend = "paddle_ocr_backend",
  TesseractFrontend = "tesseract_frontend",
}

export enum OcrModelEvent {
  ON_STAGE_CHANGE,
  ON_ENABLED,
  ON_DISABLED,
}

export type OcrLangType = "jpn" | "eng" | "chi_sim" | "chi_tra" | "japan";
export interface OcrConfig {
  url?: string;
  type: OcrBackend;
  lang: OcrLangType;
}