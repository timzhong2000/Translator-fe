import { useContext, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";

import { translatorContext } from "@/context/translator";
import { tesseractContext } from "@/context/tesseract";
import { configContext } from "@/context/config";

const testSrcText = "こんにちは";
const TranslateTest = () => {
  const { result: translateResult } = useContext(translatorContext);
  const { setResult: setSrcText } = useContext(tesseractContext);
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const [input, setInput] = useState(testSrcText);
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12} sm={6} xl={3}>
          <TextField
            label="翻译测试"
            value={input}
            sx={{ width: "100%" }}
            onChange={(e) => setInput(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={3} xl={2}>
          <TextField
            disabled
            label="翻译结果"
            value={translateResult?.dest || ""}
            sx={{ width: "100%" }}
          />
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        onClick={() => {
          if (input === testSrcText) {
            setTranslatorConfig({
              ...translatorConfig,
              cache: false,
              srcLang: "ja",
              destLang: "zh_CN",
            });
          }
          setSrcText(input);
          setTimeout(() => {
            setTranslatorConfig({
              ...translatorConfig,
              cache: true,
            });
          }, 1000);
        }}
      >
        测试翻译
      </Button>
    </div>
  );
};

export default TranslateTest