import { useState } from "react";
import { Box, Button } from "@mui/material";

import TranslateConfig from "./TranslateConfig";
import TranslateTest from "./TranslateTest";
import FilterSetting from "./FilterSetting";
import MediaDevicesSetting from "./MediaDevicesSetting";
import TranslateServerConfig from "./TranslateServerConfig";

import { core } from "@/model/core";
import { useTranslation } from "react-i18next";
import OcrSetting from "./OcrSetting";
import { observer } from "mobx-react-lite";

const ConfigPanel = () => {
  const [advanceMode, setAdvanceMode] = useState(false);
  const { t } = useTranslation();

  return (
    <div>
      <Box mt={2} mx={1}>
        <Button variant="outlined" onClick={() => setAdvanceMode(!advanceMode)}>
          {advanceMode ? t("setting.quit") : t("setting.enter")}{" "}
          {t("setting.advance")}
        </Button>
        {advanceMode ? (
          <Box my={5} mx={1}>
            <TranslateServerConfig />
          </Box>
        ) : null}
      </Box>

      <Box mb={5} mx={1}>
        <TranslateConfig />
      </Box>
      {advanceMode ? (
        <Box my={5} mx={1}>
          <TranslateTest />
        </Box>
      ) : null}
      <Box mb={5} mx={1}>
        <OcrSetting />
      </Box>
      <Box my={5} mx={1}>
        <MediaDevicesSetting />
      </Box>
      {advanceMode ? (
        <Box my={5} mx={1}>
          <FilterSetting />
        </Box>
      ) : null}
      <Box my={5} mx={1}>
        <Button onClick={() => core.config.reset()}>
          {t("setting.reset")}
        </Button>
      </Box>
    </div>
  );
};

export default observer(ConfigPanel);
