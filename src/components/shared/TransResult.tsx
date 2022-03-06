import { useContext, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ClipboardButton from "./ClipboardButton";

import { tesseractContext } from "@/context/tesseract";
import { translatorContext } from "@/context/translator";
import { DragableElement } from "@/utils/dragableElement";
import { useTranslation } from "react-i18next";

export const TransResult = () => {
  const {
    result: translateResult,
    enabled,
    setEnabled,
  } = useContext(translatorContext);
  const { result: srcText, statusList: tesseractStatus } =
    useContext(tesseractContext);
  const dragableElementEl = useRef<HTMLDivElement>(null);
  const translatorSwitchEl = useRef<HTMLButtonElement>(null);
  const srcTextCilpButton = useRef<HTMLButtonElement>(null);
  const destTextCilpButton = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();

  // 避免异常触发click事件
  useEffect(() => {
    const stopPropagation = (e: MouseEvent) => {
      e.stopPropagation();
    };
    dragableElementEl.current?.addEventListener("click", stopPropagation);
    return () =>
      void dragableElementEl.current?.removeEventListener(
        "click",
        stopPropagation
      );
  }, []);

  return (
    <DragableElement
      ref={dragableElementEl}
      style={{
        padding: "0 2",
        background: "white",
        opacity: 0.9,
        height: "200px",
        width: "1000px",
      }}
    >
      <Box
        fontSize={16}
        fontWeight={600}
        py={0.5}
      >{`(debug)状态: ${tesseractStatus.current}`}</Box>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`${t("translator.sourceText")}: ${srcText}`}
        {translateResult?.src ? (
          <ClipboardButton text={srcText} ref={srcTextCilpButton} />
        ) : null}
      </Box>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`${t("translator.destText")}: ${translateResult?.dest || ""}`}
        {translateResult?.dest ? (
          <ClipboardButton
            text={translateResult.dest}
            ref={destTextCilpButton}
          />
        ) : null}
      </Box>
      <Button onClick={() => setEnabled(!enabled)} ref={translatorSwitchEl}>
        {enabled
          ? t("translator.pauseTranslating")
          : t("translator.startTranslating")}
      </Button>
    </DragableElement>
  );
};
