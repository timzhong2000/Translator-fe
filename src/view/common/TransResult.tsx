import { Button } from "@mui/material";
import { useEffect, useState } from "react";

import DragableElement from "@/view/common/DragableElement";
import { useTranslation } from "react-i18next";
import TranslateBlock from "./TranslateBlock";
import {
  useOcrModel,
  usePreProcessorModel,
  useStreamModel,
  useTranslatorModel,
} from "@/context/hook";
import {
  ConnectedComponentType,
  OcrModelEvent,
  TranslateResult,
  TranslatorEvent,
} from "@/model";
import { createOpencvFilter } from "@/utils/preprocessor/opencvFilter";
import { TtransError } from "@/utils/error";
import { storeContext } from "@/context";
import { createConnector } from "@/context/connector";
import { CutArea, FilterConfig } from "@/types/globalConfig";

const connector = createConnector(
  storeContext,
  ({ cutArea, filterConfig }) => ({ cutArea, filterConfig }),
  () => ({})
);

const useOcrTranslate = (cutArea: CutArea, filterConfig: FilterConfig) => {
  const preProcessorModel = usePreProcessorModel();
  const translatorModel = useTranslatorModel();
  const streamModel = useStreamModel();
  const ocrModel = useOcrModel();

  const [src, setSrc] = useState("");
  const [result, setResult] = useState<TranslateResult>();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const pic = await preProcessorModel.process(
          streamModel.capture(cutArea),
          createOpencvFilter(filterConfig)
        );
        const result = await ocrModel.recognize(pic);
        const src = ocrModel.toString(result);
        if (src.length > 0) {
          setSrc(src);
          setResult(await translatorModel.translate(src));
        }
      } catch (err) {
        err instanceof TtransError && console.log(err.key);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [filterConfig, cutArea]);

  const dest = translatorModel.enabled
    ? result?.dest ?? "正在加载..."
    : "翻译已暂停";
  return { src, dest };
};

const _TransResult: ConnectedComponentType<typeof connector> = ({
  cutArea,
  filterConfig,
}) => {
  const translatorModel = useTranslatorModel([
    TranslatorEvent.ON_SETTING_CHANGE,
    TranslatorEvent.ON_ENABLED,
    TranslatorEvent.ON_DISABLED,
  ]);
  const ocrModel = useOcrModel([
    OcrModelEvent.ON_ENABLED,
    OcrModelEvent.ON_DISABLED,
  ]);

  const { t } = useTranslation();
  const { src, dest } = useOcrTranslate(cutArea, filterConfig);
  return (
    <DragableElement
      style={{
        padding: "0 0.5em",
        width: "1000px",
        backdropFilter: "blur(6px) brightness(110%)",
        zIndex: 1,
      }}
    >
      <TranslateBlock src={src} dest={dest}></TranslateBlock>
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
          ocrModel.enabled &&
            translatorModel.setEnabled(!translatorModel.enabled);
          ocrModel.setEnabled(!ocrModel.enabled);
        }}
      >
        {ocrModel.enabled ? t("translator.pauseOcr") : t("translator.startOcr")}
      </Button>
    </DragableElement>
  );
};

export const TransResult = connector(_TransResult);
