import { action, makeObservable, observable } from "mobx";
import { DisabledError, StageError, UninitializedError } from "./errors";
import { OcrEngine, OcrResult, OcrStage } from "@/types";

export type OcrImage = ImageBitmapSource;
export abstract class OcrBase {
  abstract type: OcrEngine;

  public enabled = true;
  // 组件生命周期
  public ocrStage: OcrStage = OcrStage.INIT;

  /**
   * @param init 加载函数，OcrBase等待init被resolve后进入Ready状态
   */
  constructor(init: Promise<any> = Promise.resolve()) {
    makeObservable<OcrBase>(this, {
      enabled: observable,
      ocrStage: observable,
      recognize: action,
      destroy: action,
      setEnabled: action,
      setOcrStage: action,
    });
    init
      .then(() => this.setOcrStage(OcrStage.READY))
      .catch(() => this.setOcrStage(OcrStage.FATAL));
  }

  // actions
  setOcrStage(stage: OcrStage) {
    this.ocrStage = stage;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // 抽象方法
  protected abstract _recognize(pic: OcrImage): Promise<OcrResult>;
  public abstract destroy(): void;

  // 组件外部方法
  async recognize(pic: OcrImage): Promise<OcrResult> {
    if (this.ocrStage === OcrStage.INIT) throw new UninitializedError();
    if (!this.enabled) throw new DisabledError();
    if (this.ocrStage === OcrStage.READY || this.ocrStage === OcrStage.IDLE) {
      return await this._recognize(pic);
    }
    throw new StageError(this.ocrStage);
  }

  toString(results: OcrResult): string {
    return results.map((res) => res.text).join("");
  }

  /* 返回当前步骤的状态描述文案key */
  getStageString() {
    return this.ocrStage as string;
  }
}
