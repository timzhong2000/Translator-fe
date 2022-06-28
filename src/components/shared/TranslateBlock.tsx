import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import ClipboardButton from "./ClipboardButton";

const TranslateBlock = forwardRef<
  HTMLDivElement,
  { src: string; dest: string }
>(({ src, dest }, ref) => {
  const { t } = useTranslation();
  return (
    <div ref={ref}>
      <Box
        fontSize={32}
        fontWeight={600}
        py={0.5}
        textAlign="center"
        sx={{
          textShadow:
            "-2px -2px 3px white, \
            -2px 2px 3px white, \
            2px -2px 3px white, \
            2px 2px 3px white",
        }}
      >
        {`${t("translator.sourceText")}: ${src}`}
        {src ? <ClipboardButton text={src} /> : null}
      </Box>
      <Box
        fontSize={32}
        fontWeight={600}
        py={0.5}
        textAlign="center"
        sx={{
          textShadow:
            "-2px -2px 3px white, \
            -2px 2px 3px white, \
            2px -2px 3px white, \
            2px 2px 3px white",
        }}
      >
        {`${t("translator.destText")}: ${dest || ""}`}
        {dest ? <ClipboardButton text={dest} /> : null}
      </Box>
    </div>
  );
});

export default TranslateBlock;
