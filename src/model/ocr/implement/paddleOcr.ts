import axios from "axios";
import { OcrBase, OcrImage } from "../base";
import { OcrEngine, OcrResult, PaddleOcrConfig, Point } from "@/types/ocr";
import { ImageHelper } from "@timzhong2000/browser-image-helper";
import { logger, LogType } from "@/utils/logger";

export class PaddleOcr extends OcrBase {
  readonly type = OcrEngine.PaddleOcrBackend;

  constructor(protected config: PaddleOcrConfig) {
    super();
  }

  static async create(config: PaddleOcrConfig) {
    return new PaddleOcr(config);
  }

  // eslint-disable-next-line
  public destroy() {}

  protected async _recognize(img: OcrImage): Promise<OcrResult> {
    const form = new FormData();
    const endImageHelperTimer = logger.timing(LogType.TRANSFORM_IMAGE_FORMAT);
    const image = new ImageHelper(img);
    form.append("pic", await image.toBlob());
    endImageHelperTimer();
    const result = (
      await axios.post<[[number, number][], [string, number]][]>(
        this.config.url,
        form
      )
    ).data;
    return result.map((val) => ({
      area: val[0].map((point) => ({ x: point[0], y: point[1] } as Point)),
      text: val[1][0],
      confidence: val[1][1],
    }));
  }

  imageToBlob(img: OcrImage) {
    if (img instanceof ImageData) {
      return new Blob([img.data], { type: "" });
    }
  }
}

export const createPaddleOcr = PaddleOcr.create;
