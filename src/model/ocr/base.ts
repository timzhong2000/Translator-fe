import { ModelBase } from "@/model/base";
import { DisabledError, StageError, UninitializedError } from "./errors";
import { OcrModelEvent, OcrResult, OcrStage } from "./types";

export abstract class OcrBase extends ModelBase<OcrModelEvent> {
  private _enabled = true;
  get enabled() {
    return this._enabled;
  }
  setEnabled(enabled: boolean) {
    this._enabled = enabled;
    this.eventBus.next(
      enabled ? OcrModelEvent.ON_ENABLED : OcrModelEvent.ON_DISABLED
    );
  }

  /**
   * @param init 加载函数，OcrBase等待init被resolve后进入Ready状态
   */
  constructor(init: Promise<any> = Promise.resolve()) {
    super();
    init
      .then(() => this.setOcrStage(OcrStage.READY))
      .catch(() => this.setOcrStage(OcrStage.FATAL));
  }

  // 抽象方法
  protected abstract _recognize(pic: Blob | File): Promise<OcrResult[]>;
  public abstract destroy(): void;

  // 组件生命周期
  /* 不要这个私有变量，否则不会触发变更事件。必须实现三种基础的OCR加载状态 */
  private _ocrStage: OcrStage = OcrStage.INIT;
  get ocrStage() {
    return this._ocrStage;
  }
  setOcrStage(stage: OcrStage) {
    this._ocrStage = stage;
    this.eventBus.next(OcrModelEvent.ON_STAGE_CHANGE);
  }

  // 组件外部方法
  async recognize(pic: Blob | File): Promise<OcrResult[]> {
    if (this.ocrStage === OcrStage.INIT) throw new UninitializedError();
    if (!this.enabled) throw new DisabledError();
    if (this.ocrStage === OcrStage.READY || this.ocrStage === OcrStage.IDLE) {
      return await this._recognize(pic);
    }
    throw new StageError(this.ocrStage);
  }

  toString(results: OcrResult[]): string {
    return results.map((res) => res.text).join("");
  }

  /* 返回当前步骤的状态描述文案key */
  getStageString() {
    return this.ocrStage as string;
  }
}
