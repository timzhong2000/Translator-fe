import { UninitializedError } from "../errors";
import { OcrBase } from "../base";
import { OcrEngine, OcrResult, OcrStage } from "@/types/ocr";

export class DefaultOcr extends OcrBase {
  readonly type = OcrEngine.DefaultOcr;

  constructor() {
    super();
    this.setOcrStage(OcrStage.INIT);
  }

  // eslint-disable-next-line
  public destroy(): void {}

  // eslint-disable-next-line
  protected async _recognize(_: Blob): Promise<OcrResult> {
    throw new UninitializedError();
  }
}
