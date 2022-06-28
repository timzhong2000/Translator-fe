// wip: 使用解耦合的TranslateBlock代替这个组件

import { useContext, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { tesseractContext } from "@/context/tesseract";
import { DragableElement } from "@/utils/dragableElement";
import { useTranslation } from "react-i18next";
import TranslateBlock from "./TranslateBlock";
import { useTranslate } from "@/utils/hooks/useTranslate";
import { configContext } from "@/context/config";

export const TransResult: React.FC<{ style?: React.CSSProperties }> = (
  props
) => {
  const { result: srcText, statusList: tesseractStatus } =
    useContext(tesseractContext);
  const { translatorConfig } = useContext(configContext);
  const [enabled, setEnabled] = useState(true);

  const translateResult = useTranslate(
    translatorConfig,
    enabled ? srcText : ""
  );

  const dragableElementEl = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // 避免异常触发click事件
  useEffect(() => {
    const stopPropagation = (e: MouseEvent) => {
      const tagName = (e.target as HTMLElement).tagName.toLowerCase();
      // 子组件存在多个按钮，需要继续传递事件
      if (["button", "path", "svg"].findIndex((e) => e === tagName) === -1)
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
        padding: "0 0.5em",
        width: "1000px",
        backdropFilter: "blur(6px) brightness(110%)",
      }}
    >
      <Box
        fontSize={16}
        fontWeight={600}
        py={0.5}
      >{`(debug)状态: ${tesseractStatus.current}`}</Box>
      <TranslateBlock
        src={srcText}
        dest={enabled ? translateResult?.dest || "正在加载..." : "翻译已暂停"}
      ></TranslateBlock>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setEnabled((e) => !e);
        }}
      >
        {enabled
          ? t("translator.pauseTranslating")
          : t("translator.startTranslating")}
      </Button>
    </DragableElement>
  );
};
