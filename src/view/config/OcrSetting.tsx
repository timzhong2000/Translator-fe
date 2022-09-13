import { Grid, TextField, MenuItem } from "@mui/material";
import { storeContext } from "@/model/store/store";
import { useTranslation } from "react-i18next";
import { ConnectedComponentType, createConnector } from "@/context/connector";
import { OcrConfig, OcrLangType } from "@/model";

const connector = createConnector(
  storeContext,
  ({ ocrConfig }) => ({ ocrConfig }),
  ({ ocrConfig, setOcrConfig }) => {
    const partialSet = (val: Partial<OcrConfig>) => {
      setOcrConfig({
        ...ocrConfig,
        ...val,
      });
    };
    return {
      setLang: (lang: OcrLangType) => partialSet({ lang }),
    };
  }
);

const OcrSetting: ConnectedComponentType<typeof connector> = (props) => {
  const { ocrConfig, setLang } = props;
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
            value={ocrConfig.lang}
            sx={{ width: "100%" }}
            onChange={(e) => void setLang(e.target.value as OcrLangType)}
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

export default connector(OcrSetting);
