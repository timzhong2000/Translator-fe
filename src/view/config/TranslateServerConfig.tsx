import { FC } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import LazyInput from "../common/LazyInput";
import { useConfig } from "@/context";

const TranslateServerConfig: FC = () => {
  const {
    translatorConfig: { url, secretKey },
    setTrnaslatorBackendUrl,
    setSecretKey,
  } = useConfig();

  const { t } = useTranslation();

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item sm={12} md={6} xl={3}>
          <LazyInput
            label={t("setting.translator.server")}
            value={url}
            errorFn={(input) => input == ""}
            helperTextFn={(input) =>
              input == ""
                ? t("setting.translator.pleaseFillTranslatorServerUrl")
                : ""
            }
            onSave={(url) => setTrnaslatorBackendUrl(url)}
          />
        </Grid>
        <Grid item sm={12} md={6} xl={2}>
          <LazyInput
            label={t("setting.translator.key")}
            value={secretKey}
            onSave={(secretKey) => setSecretKey(secretKey)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(TranslateServerConfig);
