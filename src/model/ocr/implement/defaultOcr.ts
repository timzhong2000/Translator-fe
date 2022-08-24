import { UninitializedError } from "../errors";
import { OcrBase } from "../base";
import { OcrResult, OcrStage } from "../types";

export class DefaultOcr extends OcrBase {
  constructor() {
    super();
  }

  get ocrStage() {
    return OcrStage.INIT;
  }

  // eslint-disable-next-line
  public destroy(): void {}

  // eslint-disable-next-line
  protected async _recognize(_: Blob): Promise<OcrResult> {
    throw new UninitializedError();
  }
}
