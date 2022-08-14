import { FC } from "react";
import { Box } from "@mui/material";
import ClipboardButton from "./ClipboardButton";

const TranslateBlock: FC<{ src: string; dest: string }> = ({ src, dest }) => {
  // const { t } = useTranslation();
  return (
    <div id={String(Math.random())}>
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
        {/* {`${t("translator.sourceText")}: ${src}`} */}
        {src}
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
        {/* {`${t("translator.destText")}: ${dest || ""}`} */}
        {dest ?? ""}
        {dest ? <ClipboardButton text={dest} /> : null}
      </Box>
    </div>
  );
};

export default TranslateBlock;
