import { makeObservable } from "mobx";
import { Resolution, Mat, OpenCV } from "@/types";
import { CanvasOffScreenError } from "./errors";
import { OpenCVLoader } from "@/utils/common/loadOpencv";

export class PreProcessorModel {
  protected outputCanvasEl = document.createElement("canvas");
  private _root?: HTMLDivElement;

  setRoot(el: HTMLDivElement) {
    if (el === this._root) return; // 防止重渲染
    if (el) {
      if (this._root) {
        this._root.childNodes.forEach((child) =>
          this._root?.removeChild(child)
        );
      }
      el.appendChild(this.outputCanvasEl);
      this._root = el;
    }
  }

  constructor(root?: HTMLDivElement) {
    makeObservable(this, {});
    root && this.setRoot(root);
    // this.getOpenCV(); // preload
  }

  changeSize(size: Resolution) {
    this.outputCanvasEl.style.width = `${size.x}px`;
    this.outputCanvasEl.style.height = `${size.y}px`;
  }

  /**
   * 处理函数
   * @param image 推荐使用 ImageData，数据源也可以是 CanvasElement ImageElement VideoElement
   * @param fn 实现处理逻辑，返回一个mat，注意fn中新建的mat都必须自己回收，否则会内存泄露
   * @returns
   */
  async process(
    image: ImageData | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement,
    fn: (cv: OpenCV, mat: Mat) => Mat
  ): Promise<HTMLCanvasElement> {
    if (!this.outputCanvasEl.parentElement) {
      throw new CanvasOffScreenError();
    }
    await OpenCVLoader.waitUntilReady();
    let inputMat: Mat;
    if (image instanceof ImageData) {
      inputMat = cv.matFromImageData(image);
    } else {
      inputMat = cv.imread(image);
    }
    const outputMat = fn(cv, inputMat);
    cv.imshow(this.outputCanvasEl, outputMat);
    inputMat === outputMat && inputMat.delete(); // 防止double delete
    outputMat.delete();
    return this.outputCanvasEl;
  }
}
