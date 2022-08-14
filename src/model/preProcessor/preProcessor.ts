import { OcrImage } from "@/utils/preprocessor/OcrImage";
import cv, { Mat } from "opencv-ts";
import { ModelBase } from "../base";
import { Resolution } from "../stream";
import { CanvasOffScreenError, OpenCVUninitializedError } from "./errors";
import { PreProcessorEvent } from "./types";
import { OpenCV } from "./types";

export class PreProcessorModel extends ModelBase<PreProcessorEvent> {
  outputCanvasEl = document.createElement("canvas");

  /// root
  private _root?: HTMLDivElement;

  get root() {
    return this._root;
  }

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

  private _cv?: OpenCV;

  get cv() {
    if (!this._cv) throw new OpenCVUninitializedError();
    return this._cv;
  }

  constructor(root?: HTMLDivElement) {
    super();
    // import("opencv-ts")
    //   .then((module) => {
    //     this._cv = module.default;
    //     this.eventBus.next(PreProcessorEvent.ON_OPENCV_LOADED);
    //   })
    //   .catch((_) => {
    //     this.eventBus.next(PreProcessorEvent.ON_OPENCV_ERROR);
    //   });
    this._cv = cv;
    this.eventBus.next(PreProcessorEvent.ON_OPENCV_LOADED);
    root && this.setRoot(root);
  }

  changeSize(size: Resolution) {
    this.outputCanvasEl.style.width = `${size.x}px`;
    this.outputCanvasEl.style.height = `${size.y}px`;
    this.eventBus.next(PreProcessorEvent.ON_SIZE_CHANGED);
  }

  /**
   * 处理函数
   * @param inputEl 数据源可以是canvasElement imageElement
   * @param fn 实现处理逻辑，返回一个mat，注意fn中新建的mat都必须自己回收，否则会内存泄露
   * @returns
   */
  process(
    inputEl: string | HTMLCanvasElement | HTMLImageElement,
    fn: (cv: OpenCV, mat: Mat) => Mat
  ): Promise<Blob> {
    if (!this.outputCanvasEl.parentElement) {
      throw new CanvasOffScreenError();
    }
    const cv = this.cv;
    const inputMat = cv.imread(inputEl);
    const outputMat = fn(cv, inputMat);
    cv.imshow(this.outputCanvasEl, outputMat);
    inputMat === outputMat && inputMat.delete(); // 防止double delete
    outputMat.delete();
    return OcrImage.canvasToBlob(this.outputCanvasEl);
  }
}
