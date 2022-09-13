import { Grid, TextField, MenuItem } from "@mui/material";
import ISO963_1 from "@/types/ISO963";
import { useTranslation } from "react-i18next";
import { core } from "@/model/core";
import { observer } from "mobx-react-lite";
import { FC } from "react";

const TranslateConfig: FC = () => {
  const {
    translatorConfig: { provider, srcLang, destLang },
    setSrcLang,
    setDestLang,
    setProvider,
  } = core.config;

  const { t } = useTranslation();

  const langList: ISO963_1[] = ["zh_CN", "zh_TW", "ja", "en"];
  const providerList: string[] = [
    "baidu",
    "google",
    "caiyunapi",
    "niutransapi",
  ];
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12} sm={12} md={3} lg={2}>
          <TextField
            select
            label={t("setting.translator.provider")}
            required
            value={provider}
            sx={{ width: "100%" }}
            onChange={(e) => setProvider(e.target.value)}
          >
            {providerList.map((provider) => (
              <MenuItem key={provider} value={provider}>
                {provider}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            select
            label={t("setting.translator.srcLang")}
            required
            value={srcLang}
            sx={{ width: "100%" }}
            onChange={(e) => setSrcLang(e.target.value as ISO963_1)}
          >
            {langList.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            select
            label={t("setting.translator.destLang")}
            required
            value={destLang}
            sx={{ width: "100%" }}
            onChange={(e) => setDestLang(e.target.value as ISO963_1)}
          >
            {langList.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(TranslateConfig);
