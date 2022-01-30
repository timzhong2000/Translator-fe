import { useContext, useState } from "react";
import { Grid, TextField, MenuItem, Button } from "@mui/material";

import { configContext } from "@/context/config";
import ISO963_1 from "@/types/ISO963";


const TranslateConfig = () => {
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(translatorConfig);
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
            label="翻译引擎"
            required
            value={localConfig.provider}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({
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
            label="源语言"
            required
            value={localConfig.srcLang}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({
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
            label="目标语言"
            required
            value={localConfig.destLang}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({
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
      <Button
        variant="outlined"
        onClick={() => {
          setTranslatorConfig(localConfig);
        }}
      >
        保存翻译设置
      </Button>
    </div>
  );
};

export default TranslateConfig;
