import { useContext, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";

import { configContext } from "@/context/config";
import { useTranslation } from "react-i18next";

const TranslateServerConfig = () => {
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(translatorConfig);
  const {t} = useTranslation()

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item sm={12} md={6} xl={3}>
          <TextField
            label={t("setting.translator.server")}
            required
            error={localConfig.url == ""}
            helperText={localConfig.url == "" ? t("setting.translator.pleaseFillTranslatorServerUrl") : ""}
            value={localConfig.url}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({ ...prev, url: e.target.value }))
            }
          />
        </Grid>
        <Grid item sm={12} md={6} xl={2}>
          <TextField
            label={t("setting.translator.key")}
            value={localConfig.key}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({ ...prev, key: e.target.value }))
            }
          />
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        onClick={() => {
          setTranslatorConfig(localConfig);
        }}
      >
        {t("setting.translator.applyCustomServer")}
      </Button>
    </div>
  );
};

export default TranslateServerConfig