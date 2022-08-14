import { Grid } from "@mui/material";

import { storeContext } from "@/context/store";
import { useTranslation } from "react-i18next";
import LazyInput from "../common/LazyInput";
import { ConnectedComponentType, createConnector } from "@/context/connector";
import { TranslatorConfig } from "@/model";

const connector = createConnector(
  storeContext,
  ({ translatorConfig }) => ({
    translatorConfig,
  }),
  ({ translatorConfig, setTranslatorConfig }) => {
    const partialSet = (val: Partial<TranslatorConfig>) => {
      setTranslatorConfig({
        ...translatorConfig,
        ...val,
      });
    };
    return {
      setUrl: (url: string) => partialSet({ url }),
      setSecretKey: (secretKey: string) => partialSet({ secretKey }),
    };
  }
);
const TranslateServerConfig: ConnectedComponentType<typeof connector> = (
  props
) => {
  const {
    translatorConfig: { url, secretKey },
    setUrl,
    setSecretKey,
  } = props;

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
            onSave={(url) => setUrl(url)}
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

export default connector(TranslateServerConfig);
