import { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { configContext } from "@/context/config";
import { useTranslation } from "react-i18next";
import { useTranslate } from "@/utils/hooks/useTranslate";
import LazyInput from "../shared/LazyInput";

const testSrcText = "こんにちは";
const TranslateTest = () => {
  const [srcText, setSrcText] = useState(testSrcText);
  const { translatorConfig } = useContext(configContext);
  const translateResult = useTranslate(translatorConfig, srcText);
  const { t } = useTranslation();

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12} sm={6} xl={3}>
          <LazyInput
            label={t("setting.translator.testText")}
            value={srcText}
            onSave={(e) => setSrcText(e)}
            saveBtnTextFn={() => "测试翻译"}
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
    </div>
  );
};

export default TranslateTest;
