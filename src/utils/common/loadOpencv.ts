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

  static waitUntilReady() {
    return this.cvLoadPromise ? this.cvLoadPromise : this.reload();
  }

  private static createLoadPromise() {
    const exist = document.getElementById(this.scriptId);
    exist && exist.parentNode?.removeChild(exist);
    const scriptEl = document.createElement("script");
    scriptEl.id = this.scriptId;
    scriptEl.src = "/vendor/opencv/opencv.js";
    scriptEl.defer = true;
    scriptEl.async = true;
    const promise = new Promise<void>((resolve, reject) => {
      scriptEl.onload = () => resolve();
      scriptEl.onerror = () => reject();
    });
    document.body.appendChild(scriptEl);
    return promise;
  }
}
