import { tagWithPrefix, TtransError } from "@/utils/error";

const tag = tagWithPrefix("preprocessor.error.");

@tag("default", "默认错误")
export class PreProcessorError extends TtransError {}

@tag("opencv_uninitialized", "opencv还未加载完毕")
export class OpenCVUninitializedError extends PreProcessorError {}

@tag("canvas_off_screen", "canvas离屏无法进行缓冲区读取")
export class CanvasOffScreenError extends PreProcessorError {}

@tag("opencv_load_failed", "opencv加载失败")
export class OpenCVLoadFailedError extends PreProcessorError {}
