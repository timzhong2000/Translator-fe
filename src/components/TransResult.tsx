import { useContext } from "react";
import { Box, Button } from "@mui/material";

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
  const { t } = useTranslation();

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
      >{`(debug)状态: ${tesseractStatus.current}`}</Box>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`${t("translator.sourceText")}: ${srcText}`}
        {translateResult?.src ? <ClipboardButton text={srcText} /> : null}
      </Box>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`${t("translator.destText")}: ${translateResult?.dest || ""}`}
        {translateResult?.dest ? (
          <ClipboardButton text={translateResult.dest} />
        ) : null}
      </Box>
      <Button onClick={() => setEnabled(!enabled)}>
        {enabled
          ? t("translator.pauseTranslating")
          : t("translator.startTranslating")}
      </Button>
    </DragableElement>
  );
};
