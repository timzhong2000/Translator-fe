import { tesseractContext } from "@/context/tesseract";
import { translatorContext } from "@/context/translator";
import { transContext } from "@/context/videoProcessor";
import { Box } from "@mui/material";
import { useContext } from "react";

export const TransResult = () => {
  const { result: translateResult } = useContext(translatorContext);
  const { result: srcText, statusList: tesseractStatus } =
    useContext(tesseractContext);

  return (
    <Box px={2} sx={{ background: "white", opacity: 0.9 }} height="100%">
      <Box
        fontSize={30}
        fontWeight={600}
        py={0.5}
      >{`状态：${tesseractStatus.current}`}</Box>
      <Box fontSize={30} fontWeight={600} py={0.5}>{`原文：${srcText}`}</Box>
      <Box fontSize={30} fontWeight={600} py={0.5}>{`译文：${
        translateResult?.dest || ""
      }`}</Box>
    </Box>
  );
};
