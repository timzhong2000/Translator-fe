import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import { useContext, useState } from "react";
import { configContext } from "@/context/config";
import { useTranslation } from "react-i18next";
import { OcrLangType } from "@/types/globalConfig";
const OcrSetting = () => {
  const { ocrConfig, setOcrConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(ocrConfig);
  const { t } = useTranslation();
  const langList: OcrLangType[] = ["chi_sim", "chi_tra", "eng", "jpn"];
  const poolSizeList: number[] = [1, 2, 4, 8];

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            select
            label={t("setting.ocr.lang")}
            required
            value={localConfig.lang}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({
                ...prev,
                lang: e.target.value as OcrLangType,
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
            label={t("setting.ocr.poolsize")}
            required
            value={localConfig.poolSize}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({
                ...prev,
                poolSize: Number(e.target.value),
              }))
            }
          >
            {poolSizeList.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Button variant="outlined" onClick={() => setOcrConfig(localConfig)}>
        {t("setting.ocr.apply")}
      </Button>
    </div>
  );
};

export default OcrSetting;
