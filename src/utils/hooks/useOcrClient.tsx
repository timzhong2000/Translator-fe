import { configContext } from "@/context/config";
import { tesseractContext } from "@/context/tesseract";
import { useMemo, useState, useContext, useEffect } from "react";
import { ImageLike, OcrClient, OcrImage } from "../OcrClient";

/**
 * context依赖：
 * - 当 `type` 为 `tesseract-local` 时,依赖 `tesseractContext`
 * - 依赖 `configContext` 提供翻译语言
 */
export const useOcrClient = (
  type: "tesseract-local" | "paddleocr-remote",
  imageLike: ImageLike
) => {
  const image = useMemo(() => new OcrImage(imageLike), [imageLike]);
  const [text, setText] = useState("");
  const { recognize } = useContext(tesseractContext);
  const {
    translatorConfig: { srcLang: lang },
  } = useContext(configContext);
  useEffect(() => {
    (async () => {
      if (type === "tesseract-local") {
        try {
          const result = await OcrClient.createLocalTesseractClient(
            recognize,
            lang
          ).recognize(image);
          setText(result.text);
        } catch (err) {
          console.log(err);
        }
      } else if (type === "paddleocr-remote") {
        const result = await OcrClient.createRemotePaddleOcrClient(
          ""
        ).recognize(image);
        setText(result.text);
      }
    })();
  }, [image]);
  return text;
};
