import { LogType, PerformanceData } from "./types";
import { ignorePrint } from "./config";
const emptyPerformanceData: PerformanceData = {
  [LogType.CAPTURE_VIDEO_FRAME]: [],
  [LogType.OPENCV_CRASH]: [],
  [LogType.OPENCV_PROCESS]: [],
  [LogType.OPENCV_START]: [],
  [LogType.TESSERACT_CRASH]: [],
  [LogType.TESSERACT_PROCESS]: [],
  [LogType.TESSERACT_START]: [],
  [LogType.MEMORY_HEAP_LIMIT]: [],
  [LogType.MEMORY_HEAP_SIZE]: [],
  [LogType.MEMORY_HEAP_USED]: [],
  [LogType.TRANSLATOR_LOCAL_CACHE]: [],
  [LogType.TRANSLATOR_ERROR]: [],
  [LogType.TRANSFORM_IMAGE_FORMAT]: [],
};

class Logger {
  performance = emptyPerformanceData;

  constructor() {
    const interval = setInterval(() => {
      const meminfo = ((performance as any).memory as {
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
      }) ?? { jsHeapSizeLimit: -1, totalJSHeapSize: -1, usedJSHeapSize: -1 };
      if (meminfo.jsHeapSizeLimit === -1) {
        console.log("not support memory performance trace");
        clearInterval(interval);
        return;
      }
      this.record(LogType.MEMORY_HEAP_LIMIT, meminfo.jsHeapSizeLimit);
      this.record(LogType.MEMORY_HEAP_SIZE, meminfo.totalJSHeapSize);
      this.record(LogType.MEMORY_HEAP_USED, meminfo.usedJSHeapSize);
    }, 1000 * 60);
  }

  timing(type: LogType) {
    const startTime = Date.now();
    const obj = { stack: "" };
    Error.captureStackTrace(obj);

    const timeout = setTimeout(() => {
      console.error(type + " 性能计时器已超时");
      console.log(obj.stack);
    }, 1000 * 60); // 一分钟还没结束的timing认为是忘记结束计时
    return () => {
      const endTime = Date.now();
      const timeCost = endTime - startTime;
      this.record(type, timeCost);
      this.print(type, `cost: ${timeCost}ms`);
      clearTimeout(timeout);
    };
  }

  record(type: LogType, val: number) {
    this.performance[type].push(val);
  }

  print(type: LogType, msg: string, data?: any) {
    if (ignorePrint.find((ingoreType) => ingoreType === type)) {
      return;
    }
    console.log(`[${type}]\t${msg}`, data);
  }

  // 上传计时数据和基本performance数据
  upload() {
    console.log(this.performance);
  }
}

export const logger = new Logger();
(window as any).logger = logger;
