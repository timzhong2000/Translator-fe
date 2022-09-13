import { Config } from "../config";

export class TCore {
  config = new Config();
}

// 单例
export const core = new TCore();
