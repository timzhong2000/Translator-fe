export enum LogType {
  /*******************
   * image transform *
   *******************/

  /**
   * 从 HTMLVideoElement 提取 ImageBitmap 耗时
   *
   * 目前提取 ImageBitmap 耗时就是 ImageHelper 执行转换的耗时（TRANSFORM_IMAGE_FORMAT）
   */
  CAPTURE_VIDEO_FRAME = "capture_video_frame",

  /**
   * 把 ImageBitmap 编码为 File 的耗时，用于 tesseract 输入
   * @TODO 修改 tesseract 支持 zero-copy 图像传输
   */
  TRANSFORM_IMAGE_FORMAT = "transform_image_format",

  /*************
   * Tesseract *
   *************/

  /** Tesseract 执行 OCR 耗时 */
  TESSERACT_PROCESS = "tesseract_process",

  /** Tesseract 加载和启动耗时 */
  TESSERACT_START = "tesseract_start",

  /** Tesseract 错误处理 */
  TESSERACT_CRASH = "tesseract_crash",

  /**********
   * OpenCV *
   **********/

  /** OpenCV 预处理图像耗时 */
  OPENCV_PROCESS = "opencv_process",

  /** OpenCV 加载和启动耗时 */
  OPENCV_START = "opencv_start",

  /** OpenCV 错误处理 */
  OPENCV_CRASH = "opencv_crash",

  /***************
   * Memory Info *
   ***************/
  MEMORY_HEAP_LIMIT = "memory_heap_limit",
  MEMORY_HEAP_SIZE = "memory_heap_size",
  MEMORY_HEAP_USED = "memory_heap_used",

  /**************
   * Translator *
   **************/

  /** 0未命中 1命中 2写缓存成功 */
  TRANSLATOR_LOCAL_CACHE = "translator_local_cache",
  TRANSLATOR_ERROR = "translator_error",
}

export type PerformanceData = { [key in LogType]: (number | string)[] };
