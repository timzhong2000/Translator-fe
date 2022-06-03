import { useContext, useState } from "react";
import Grid from "@mui/material/Grid";

import { configContext } from "@/context/config";
import { useTranslation } from "react-i18next";
import LazyInput from "../shared/LazyInput";

const TranslateServerConfig = () => {
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const { t } = useTranslation();

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item sm={12} md={6} xl={3}>
          <LazyInput
            label={t("setting.translator.server")}
            initValue={translatorConfig.url}
            errorFn={(input) => input == ""}
            helperTextFn={(input) =>
              input == ""
                ? t("setting.translator.pleaseFillTranslatorServerUrl")
                : ""
            }
            onSave={(url) =>
              setTranslatorConfig((prev) => ({ ...prev, url: url }))
            }
          />
        </Grid>
        <Grid item sm={12} md={6} xl={2}>
          <LazyInput
            label={t("setting.translator.key")}
            initValue={translatorConfig.key}
            onSave={(key) =>
              setTranslatorConfig((prev) => ({ ...prev, key: key }))
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default TranslateServerConfig;
