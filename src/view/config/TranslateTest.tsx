import { useState } from "react";

import { useTranslation } from "react-i18next";
import LazyInput from "../common/LazyInput";
import { useAsync } from "react-async-hook";
import { Grid, TextField } from "@mui/material";
import { core } from "@/model/core";
import { observer } from "mobx-react-lite";

const testSrcText = "こんにちは";
const TranslateTest = () => {
  const [srcText, setSrcText] = useState(testSrcText);
  const translator = core.translator;
  const { result, loading } = useAsync(
    (srcText: string) => translator.translate(srcText),
    [srcText]
  );
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
            value={loading ? "loading..." : result?.dest ?? ""}
            sx={{ width: "100%" }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(TranslateTest);
