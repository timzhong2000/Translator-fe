import axios from "axios";
import { OcrBase } from "../base";
import { OcrResult, Point } from "../types";

export interface PaddleOcrConfig {
  url: string;
  lang: string;
}

export class _PaddleOcr extends OcrBase {
  constructor(protected config: PaddleOcrConfig) {
    super();
  }

  static async create(config: PaddleOcrConfig) {
    return new _PaddleOcr(config);
  }

  // eslint-disable-next-line
  public destroy() {}

  protected async _recognize(pic: Blob | File): Promise<OcrResult> {
    const form = new FormData();
    form.append("pic", pic);
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
}

export type PaddleOcr = typeof _PaddleOcr;
export const createPaddleOcr = _PaddleOcr.create;
