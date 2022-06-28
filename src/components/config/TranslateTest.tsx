import { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { tesseractContext } from "@/context/tesseract";
import { configContext } from "@/context/config";
import { useTranslation } from "react-i18next";
import { useTranslate } from "@/utils/hooks/useTranslate";

const testSrcText = "こんにちは";
const TranslateTest = () => {
  const { setResult: setSrcText,result:srcText  } = useContext(tesseractContext);
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const translateResult = useTranslate(translatorConfig, srcText)
  const {t} = useTranslation()

  const [input, setInput] = useState(testSrcText);
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12} sm={6} xl={3}>
          <TextField
            label={t("setting.translator.testText")}
            value={input}
            sx={{ width: "100%" }}
            onChange={(e) => setInput(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={3} xl={2}>
          <TextField
            disabled
            label={t("setting.translator.testResult")}
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
        {t("setting.translator.testTranslator")}
      </Button>
    </div>
  );
};

export default TranslateTest