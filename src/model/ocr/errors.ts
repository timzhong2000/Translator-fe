import { tagWithPrefix, TtransError } from "@/utils/error";
import { OcrStage } from "./types";

const tag = tagWithPrefix("ocr.error.");

@tag("default", "ocr默认错误")
export class OcrBaseError extends TtransError {}

@tag("stage_error", "在错误的阶段请求了识别函数")
export class StageError extends OcrBaseError {
  constructor(public stage: OcrStage, message?: string) {
    super(message);
  }
}

@tag("uninitialized", "ocr组件未初始化完毕")
export class UninitializedError extends OcrBaseError {}
