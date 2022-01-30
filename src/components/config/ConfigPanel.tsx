import { useContext, useState } from "react";
import {
  Box,
  Button,
} from "@mui/material";

import TranslateConfig from "./TranslateConfig";
import TranslateTest from "./TranslateTest";
import FilterSetting from "./FilterSetting";
import MediaDevicesSetting from "./MediaDevicesSetting";
import TranslateServerConfig from "./TranslateServerConfig";

import { configContext } from "@/context/config";

const ConfigPanel = () => {
  const [advanceMode, setAdvanceMode] = useState(false);
  const { reset } = useContext(configContext);
  return (
    <div>
      <Box mt={2} mx={1}>
        <Button variant="outlined" onClick={() => setAdvanceMode(!advanceMode)}>
          {advanceMode ? "退出" : "进入"}高级模式
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
      <Box my={5} mx={1}>
        <MediaDevicesSetting />
      </Box>
      {advanceMode ? (
        <Box my={5} mx={1}>
          <FilterSetting />
        </Box>
      ) : null}
      <Box my={5} mx={1}>
        <Button onClick={() => reset()}>重置设置</Button>
      </Box>
    </div>
  );
};

export default ConfigPanel