import { Grid, TextField, MenuItem } from "@mui/material";
import { storeContext } from "@/context/store";
import ISO963_1 from "@/types/ISO963";
import { useTranslation } from "react-i18next";
import {
  ConnectedComponentType,
  createConnector,
} from "@/context/connector";
import { TranslatorConfig } from "@/model";

const connector = createConnector(
  storeContext,
  ({ translatorConfig, setTranslatorConfig }) => ({
    translatorConfig,
    setTranslatorConfig,
  }),
  ({ translatorConfig, setTranslatorConfig }) => {
    const partialSet = (val: Partial<TranslatorConfig>) => {
      setTranslatorConfig({
        ...translatorConfig,
        ...val,
      });
    };
    const { provider, srcLang, destLang } = translatorConfig;
    return {
      provider,
      srcLang,
      destLang,
      setSrcLang: (srcLang: ISO963_1) => partialSet({ srcLang }),
      setDestLang: (destLang: ISO963_1) => partialSet({ destLang }),
      setProvider: (provider: string) => partialSet({ provider }),
    };
  }
);
const TranslateConfig: ConnectedComponentType<typeof connector> = (props) => {
  const { provider, srcLang, destLang, setSrcLang, setDestLang, setProvider } =
    props;
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

export default connector(TranslateConfig);
