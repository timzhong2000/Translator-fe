import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import ClipboardButton from "./ClipboardButton";
import { forwardRef } from "react";
const TranslateBlock = forwardRef<
  HTMLDivElement,
  { src: string; dest: string }
>(({ src, dest }, ref) => {
  const { t } = useTranslation();
  return (
    <div ref={ref}>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`${t("translator.sourceText")}: ${src}`}
        {src ? <ClipboardButton text={src} /> : null}
      </Box>
      <Box fontSize={24} fontWeight={600} py={0.5}>
        {`${t("translator.destText")}: ${dest || ""}`}
        {dest ? <ClipboardButton text={dest} /> : null}
      </Box>
    </div>
  );
});

export default TranslateBlock;
