# Ocr Model

## 公共方法

``` ts
// 组件外部方法
interface {
  /* 识别图片 */
  recognize: (pic: Blob | File) => Promise<OcrResult[]>;

  /* 结构化ocr结果转换为字符串 */
  toString: (results: OcrResult[]) => string;

  /* 返回当前步骤的状态的文案key */
  getStageString: () => string;
}
```

## 生命周期
``` ts
export enum OcrStage {
  INIT = "ocr.common.init", // 初始化中
  READY = "ocr.common.ready", // 初始化完毕，刚刚就绪
  IDLE = "ocr.common.idle", // 空闲
  BUSY = "ocr.common.busy", // 阻塞新请求
  FATAL = "ocr.common.fatal", // 加载时失败
}
```