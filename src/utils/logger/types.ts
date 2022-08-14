export enum LogType {
  BLOB_TO_DATAURL = "blob_to_dataurl",
  CAPTURE_VIDEO_FRAME = "capture_video_frame",
  /* tesseract */
  TESSERACT_PROCESS = "tesseract_process",
  TESSERACT_START = "tesseract_start",
  TESSERACT_CRASH = "tesseract_crash",
  /* opencv */
  OPENCV_PROCESS = "opencv_process",
  OPENCV_START = "opencv_start",
  OPENCV_CRASH = "opencv_crash",
  /* memory */
  MEMORY_HEAP_LIMIT = "memory_heap_limit",
  MEMORY_HEAP_SIZE = "memory_heap_size",
  MEMORY_HEAP_USED = "memory_heap_used",
  /* translator */
  TRANSLATOR_LOCAL_CACHE = "translator_local_cache", // 0未命中 1命中 2写缓存成功
  TRANSLATOR_ERROR = "translator_error",
}

export type PerformanceData = { [key in LogType]: (number | string)[] };
