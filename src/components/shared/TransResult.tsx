// wip: 使用解耦合的TranslateBlock代替这个组件

import { useContext, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ClipboardButton from "./ClipboardButton";

import { tesseractContext } from "@/context/tesseract";
import { translatorContext } from "@/context/translator";
import { DragableElement } from "@/utils/dragableElement";
import { useTranslation } from "react-i18next";
import TranslateBlock from "./TranslateBlock";

export const TransResult: React.FC<{ style?: React.CSSProperties }> = (
  props
) => {
  const {
    result: translateResult,
    enabled,
    setEnabled,
  } = useContext(translatorContext);
  const { result: srcText, statusList: tesseractStatus } =
    useContext(tesseractContext);
  const dragableElementEl = useRef<HTMLDivElement>(null);
  const translatorSwitchEl = useRef<HTMLButtonElement>(null);

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
        ...props.style,
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
      <TranslateBlock src={translateResult!.src} dest={translateResult!.dest}></TranslateBlock>
      <Button onClick={() => setEnabled(!enabled)} ref={translatorSwitchEl}>
        {enabled
          ? t("translator.pauseTranslating")
          : t("translator.startTranslating")}
      </Button>
    </DragableElement>
  );
};
