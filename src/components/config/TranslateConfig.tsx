import { useContext } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { configContext } from "@/context/config";
import ISO963_1 from "@/types/ISO963";
import { useTranslation } from "react-i18next";


const TranslateConfig = () => {
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const { t } = useTranslation()

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
            value={translatorConfig.provider}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setTranslatorConfig((prev) => ({
                ...prev,
                provider: e.target.value,
              }))
            }
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
            value={translatorConfig.srcLang}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setTranslatorConfig((prev) => ({
                ...prev,
                srcLang: e.target.value as ISO963_1,
              }))
            }
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
            value={translatorConfig.destLang}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setTranslatorConfig((prev) => ({
                ...prev,
                destLang: e.target.value as ISO963_1,
              }))
            }
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

export default TranslateConfig;
