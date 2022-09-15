import { Box, Button } from "@mui/material";
import { FC, useEffect, useState } from "react";

import DragableElement from "@/view/common/DragableElement";
import { useTranslation } from "react-i18next";
import {
  useConfig,
  useOcrModel,
  usePreProcessorModel,
  useStreamModel,
  useTranslatorModel,
} from "@/context/hook";
import { OcrResult, OcrStage, TranslateResult } from "@/model";
import { createOpencvFilter } from "@/utils/preprocessor/opencvFilter";
import { TtransError } from "@/utils/error";
import { CutArea, FilterConfig } from "@/types/globalConfig";
import ClipboardButton from "./ClipboardButton";
import "./transResult.css";
import { observer } from "mobx-react-lite";

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
        const pic = await preProcessorModel.process(
          streamModel.capture(cutArea),
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
  return (
    <DragableElement
      style={{
        padding: "0 0.5em",
        width: "1000px",
        backdropFilter: "blur(6px) brightness(110%)",
        zIndex: 1,
      }}
      onDragStart={() => {
        translatorModel.setEnabled(false);
        ocrModel.setEnabled(false);
      }}
      onDragEnd={() => {
        translatorModel.setEnabled(true);
        ocrModel.setEnabled(true);
      }}
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
      <Button
        onClick={() => translatorModel.setEnabled(!translatorModel.enabled)}
      >
        {translatorModel.enabled
          ? t("translator.pauseTranslating")
          : t("translator.startTranslating")}
      </Button>
      <Button
        onClick={() => {
          if (ocrModel.enabled) {
            translatorModel.setEnabled(false);
            ocrModel.setEnabled(false);
          } else {
            ocrModel.setEnabled(true);
          }
        }}
      >
        {ocrModel.enabled ? t("translator.pauseOcr") : t("translator.startOcr")}
      </Button>
    </DragableElement>
  );
};

export const TransResult = observer(_TransResult);
