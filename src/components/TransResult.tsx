import { useContext } from "react";
import { Box, Button } from "@mui/material";

import ClipboardButton from "./ClipboardButton";

import { tesseractContext } from "@/context/tesseract";
import { translatorContext } from "@/context/translator";
import { DragableElement } from "@/utils/dragableElement";

export const TransResult = () => {
  const {
    result: translateResult,
    enabled,
    setEnabled,
  } = useContext(translatorContext);
  const { result: srcText, statusList: tesseractStatus } =
    useContext(tesseractContext);

  return (
    <DragableElement
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
      >{`状态：${tesseractStatus.current}`}</Box>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`原文：${srcText}`}
        {true ? <ClipboardButton text={srcText} /> : null}
      </Box>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`译文：${translateResult?.dest || ""}`}
        {translateResult?.dest ? (
          <ClipboardButton text={translateResult.dest} />
        ) : null}
      </Box>
      <Button onClick={() => setEnabled(!enabled)}>
        {enabled ? "暂停翻译" : "开始翻译"}
      </Button>
    </DragableElement>
  );
};
