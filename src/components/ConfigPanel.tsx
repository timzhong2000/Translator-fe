import { configContext } from "@/context/config";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { MediaDevicesConfig } from "@/types/globalConfig";
import { transContext } from "@/context/videoProcessor";
import { translatorContext } from "@/context/translator";
import { ISO963_1 } from "@/types/ISO963";
import { tesseractContext } from "@/context/tesseract";

export const ConfigPanel = () => {
  const [advanceMode, setAdvanceMode] = useState(false);
  const {reset} = useContext(configContext)
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
        <Button onClick={()=>reset()}>重置设置</Button>
      </Box>

    </div>
  );
};

const testSrcText = "こんにちは";
const TranslateTest = () => {
  const { result: translateResult } = useContext(translatorContext);
  const { setResult: setSrcText } = useContext(tesseractContext);
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const [input, setInput] = useState(testSrcText);
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12} sm={6} xl={3}>
          <TextField
            label="翻译测试"
            value={input}
            sx={{ width: "100%" }}
            onChange={(e) => setInput(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={3} xl={2}>
          <TextField
            disabled
            label="翻译结果"
            value={translateResult?.dest || ""}
            sx={{ width: "100%" }}
          />
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        onClick={() => {
          if (input === testSrcText) {
            setTranslatorConfig({
              ...translatorConfig,
              cache: false,
              srcLang: "ja",
              destLang: "zh_CN",
            });
          }
          setSrcText(input);
          setTimeout(() => {
            setTranslatorConfig({
              ...translatorConfig,
              cache: true,
            });
          }, 1000);
        }}
      >
        测试翻译
      </Button>
    </div>
  );
};

const TranslateConfig = () => {
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(translatorConfig);
  const langList: ISO963_1[] = ["zh_CN", "zh_TW", "ja", "en"];
  const providerList: string[] = ["baidu", "google", "caiyun"];
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item  xs={12} sm={12} md={3} lg={2}>
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

        <Grid item  xs={12} sm={6} md={3} lg={2}>
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
const TranslateServerConfig = () => {
  const { translatorConfig, setTranslatorConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(translatorConfig);
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item sm={12} md={6} xl={3}>
          <TextField
            label="翻译服务器"
            required
            error={localConfig.url == ""}
            helperText={localConfig.url == "" ? "请输入翻译服务器" : ""}
            value={localConfig.url}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig((prev) => ({ ...prev, url: e.target.value }))
            }
          />
        </Grid>
        <Grid item sm={12} md={6} xl={2}>
          <TextField
            label="密钥"
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
        保存自定义服务器
      </Button>
    </div>
  );
};

const getStreamStatus = (
  stream: MediaStream | undefined,
  mediaDevicesConfig: MediaDevicesConfig
) => {
  return mediaDevicesConfig.enabled
    ? stream && stream.getTracks().length > 0
      ? "停止录制"
      : "正在打开摄像头模块"
    : "使用以上参数开始录制";
};

const resolution2text = (resolution: MediaTrackConstraints) => {
  return `${resolution.height}P`;
};

const text2resolution = (text: string) => {
  switch (text) {
    case "1080P":
      return { width: 1920, height: 1080, frameRate: 30 };
    case "720P":
      return { width: 1280, height: 720, frameRate: 30 };
  }
  throw new Error("不支持的分辨率");
};

const MediaDevicesSetting = () => {
  const { mediaDevicesConfig, setMediaDevicesConfig } =
    useContext(configContext);
  const [localConfig, setLocalConfig] = useState(mediaDevicesConfig);
  const { stream } = useContext(transContext);
  const resolutionList = ["1080P", "720P"];
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item sm={12} md={6} xl={2} mt={0.75}>
          <TextField
            select
            label="录屏分辨率"
            required
            value={resolution2text(localConfig.video)}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                video: text2resolution(e.target.value),
              })
            }
          >
            {resolutionList.map((resolution) => (
              <MenuItem key={resolution} value={resolution}>
                {resolution}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item sm={12} md={6} xl={2} mt={1}>
          <FormControlLabel
            label="启用音频回放"
            control={
              <Checkbox
                checked={localConfig.audio}
                onClick={(e) =>
                  setLocalConfig((prev) => ({
                    ...prev,
                    audioSetting: !localConfig.audio,
                  }))
                }
              />
            }
          ></FormControlLabel>
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        disabled={getStreamStatus(stream, localConfig) === "正在打开摄像头模块"}
        onClick={() => {
          setLocalConfig((prev) => {
            setMediaDevicesConfig({ ...prev, enabled: !prev.enabled });
            return { ...prev, enabled: !prev.enabled };
          });
        }}
      >
        {getStreamStatus(stream, localConfig)}
      </Button>
    </div>
  );
};

export const FilterSetting = () => {
  const { filterConfig, setFilterConfig } = useContext(configContext);
  const [localConfig, setLocalConfig] = useState(filterConfig);
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={6} md={6} xl={2}>
          <Typography id="binaryThreshold-slider" gutterBottom>
            二值化阈值
          </Typography>
          <Slider
            value={localConfig.binaryThreshold}
            aria-labelledby="binaryThreshold-slider"
            valueLabelDisplay="auto"
            min={1}
            max={255}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                binaryThreshold: Number((e.target as unknown as any).value),
              })
            }
          />
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label="Erode卷积核大小"
            required
            value={localConfig.erodeKernelSize}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                erodeKernelSize: Number(e.target.value),
              })
            }
          ></TextField>
        </Grid>
        <Grid item xs={3} md={2} xl={1}>
          <TextField
            label="Erode迭代次数"
            required
            value={localConfig.erodeIterations}
            sx={{ width: "100%" }}
            onChange={(e) =>
              setLocalConfig({
                ...localConfig,
                erodeIterations: Number(e.target.value),
              })
            }
          ></TextField>
        </Grid>
      </Grid>
      <Button variant="outlined" onClick={() => setFilterConfig(localConfig)}>
        保存
      </Button>
    </div>
  );
};
