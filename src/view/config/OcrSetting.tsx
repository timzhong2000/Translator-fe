import { Grid, TextField, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OcrLangType } from "@/model";
import { FC } from "react";
import { core } from "@/model/core";
import { observer } from "mobx-react-lite";

const OcrSetting: FC = () => {
  const {
    ocrConfig: { lang },
    setOcrLang,
  } = core.config;

  const { t } = useTranslation();
  const langList: OcrLangType[] = ["chi_sim", "chi_tra", "eng", "jpn"];

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            select
            label={t("setting.ocr.lang")}
            required
            value={lang}
            sx={{ width: "100%" }}
            onChange={(e) => void setOcrLang(e.target.value as OcrLangType)}
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

export default observer(OcrSetting);
