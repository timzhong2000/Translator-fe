import { logger, LogType } from "../logger";

export class OpenCVLoader {
  private static readonly scriptId = "opencv-js-core";
  private static cvLoadPromise: Promise<void> | null = null;
  /**
   * 必须先执行 waitUntilReady 再读取 cv，否则可能为空
   */
  static getOpenCV() {
    return window.cv;
  }

  static reload() {
    this.cvLoadPromise = this.createLoadPromise();
    return this.cvLoadPromise;
  }

  static waitUntilReady(timeout: number = 1000 * 10) {
    const cvPromise = this.cvLoadPromise ? this.cvLoadPromise : this.reload();
    return Promise.race([
      cvPromise,
      new Promise((_, reject) => {
        const timeoutHandler = setTimeout(
          () => reject(new Error("load opencv timeout")),
          timeout
        );
        cvPromise.then(() => clearTimeout(timeoutHandler));
      }),
    ]);
  }

  private static createLoadPromise() {
    const EndOpenLoadTimer = logger.timing(LogType.OPENCV_START);
    const exist = document.getElementById(this.scriptId);
    exist && exist.parentNode?.removeChild(exist);
    const scriptEl = document.createElement("script");
    scriptEl.id = this.scriptId;
    scriptEl.src = "/vendor/opencv/opencv.js";
    scriptEl.defer = true;
    scriptEl.async = true;
    const promise = new Promise<void>((resolve, reject) => {
      scriptEl.onload = () => {
        EndOpenLoadTimer();
        resolve();
      };
      scriptEl.onerror = (err) => {
        logger.print(LogType.OPENCV_CRASH, "load opencv error", err);
        reject();
      };
    });
    document.body.appendChild(scriptEl);
    return promise;
  }
}
