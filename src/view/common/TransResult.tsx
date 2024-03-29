import { Box, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
// Components
import DragableElement from "@/view/common/DragableElement";
import ClipboardButton from "./ClipboardButton";
import "./transResult.css";
// Other Moduless
import {
  useConfig,
  useOcrModel,
  usePreProcessorModel,
  useStreamModel,
  useTranslatorModel,
} from "@/context/hook";
import { createOpencvFilter } from "@/utils/preprocessor/opencv/opencvFilter";
import { TtransError } from "@/utils/error";
import {
  CutArea,
  FilterConfig,
  OcrResult,
  OcrStage,
  TranslateResult,
} from "@/types";

const useOcrTranslate = (cutArea: CutArea, filterConfig: FilterConfig) => {
  const preProcessorModel = usePreProcessorModel();
  const translatorModel = useTranslatorModel();
  const streamModel = useStreamModel();
  const ocrModel = useOcrModel();

  const [src, setSrc] = useState("");
  const [result, setResult] = useState<TranslateResult>();
  const [ocrResult, setOcrResult] = useState<OcrResult>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        (ocrModel.ocrStage !== OcrStage.IDLE &&
          ocrModel.ocrStage !== OcrStage.READY) ||
        !ocrModel.enabled
      )
        return;
      try {
        const capturedImage = await streamModel.capture(cutArea);
        const pic = await preProcessorModel.process(
          capturedImage,
          createOpencvFilter(filterConfig)
        );
        const ocrResult = await ocrModel.recognize(pic);
        setOcrResult(ocrResult);
        const src = ocrModel.toString(ocrResult);
        if (src.length > 0) {
          setSrc(src);
          setResult(await translatorModel.translate(src));
        }
      } catch (err) {
        err instanceof TtransError && console.log(err.key);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [filterConfig, cutArea]);

  const dest = translatorModel.enabled
    ? result?.dest ?? "正在加载..."
    : "翻译已暂停";
  return { src, dest, ocrResult };
};

const _TransResult: FC = () => {
  const { cutAreaConfig: cutArea, filterConfig } = useConfig();
  const translatorModel = useTranslatorModel();
  const ocrModel = useOcrModel();
  const { t } = useTranslation();
  const { src, dest, ocrResult } = useOcrTranslate(cutArea, filterConfig);

  const pause = () => {
    translatorModel.setEnabled(false);
    ocrModel.setEnabled(false);
  };

  const start = () => {
    translatorModel.setEnabled(true);
    ocrModel.setEnabled(true);
  };

  return (
    <DragableElement
      style={{
        padding: "0 0.5em",
        width: "1000px",
        backdropFilter: "blur(6px) brightness(110%)",
        zIndex: 1,
      }}
      onDragStart={() => ocrModel.setEnabled(false)}
      onDragEnd={() => ocrModel.setEnabled(true)}
    >
      <div>
        <Box fontSize={32} fontWeight={600} py={0.5} textAlign="center">
          {ocrResult.map((part, index) => (
            <span className="text-border ocr-container" key={index}>
              <span
                className="text"
                style={{
                  textDecoration:
                    part.confidence < 85 ? "underline wavy red" : "",
                }}
              >
                {part.text}
              </span>
              <span className="confidence">
                ({part.confidence.toFixed(0)}%)
              </span>
            </span>
          ))}
          {src ? <ClipboardButton text={src} /> : null}
        </Box>
        <Box
          fontSize={32}
          fontWeight={600}
          py={0.5}
          textAlign="center"
          className="text-border"
        >
          {dest ?? ""}
          {dest ? <ClipboardButton text={dest} /> : null}
        </Box>
      </div>
      {/* {error && <Button onClick={() => set()}>重试翻译</Button>} */}
      <Button onClick={() => (translatorModel.enabled ? pause() : start())}>
        {translatorModel.enabled
          ? t("translator.pauseTranslating")
          : t("translator.startTranslating")}
      </Button>
    </DragableElement>
  );
};

export const TransResult = observer(_TransResult);
