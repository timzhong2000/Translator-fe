import { useContext, useState, Fragment } from "react";
import {
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import { configContext } from "@/context/config";
import { transContext } from "@/context/videoProcessor";
import { MediaDevicesConfig } from "@/types/globalConfig";
import useMediaDeviceList from "@/utils/hooks/useMediaDeviceList";
import { resolution2text, text2resolution } from "@/utils/resolution";


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

const MediaDevicesSetting = () => {
  const { mediaDevicesConfig, setMediaDevicesConfig } =
    useContext(configContext);
  const [localConfig, setLocalConfig] = useState(mediaDevicesConfig);
  const { stream } = useContext(transContext);
  const resolutionList = ["1080P", "720P"];

  const mediaDeviceList = useMediaDeviceList();
  const videoDeviceList = mediaDeviceList.filter(
    (dev) => dev.kind === "videoinput" && dev.deviceId.length > 20
  );
  const audioDeviceList = mediaDeviceList.filter(
    (dev) => dev.kind === "audioinput" && dev.deviceId.length > 20
  );
  const selectedVideoDeviceLabel =
    videoDeviceList.find((dev) => dev.deviceId === localConfig.videoDeviceId)
      ?.label ||
    videoDeviceList[0]?.label ||
    "";
  const selectedAudioDeviceLabel =
    audioDeviceList.find((dev) => dev.deviceId === localConfig.audioDeviceId)
      ?.label ||
    audioDeviceList[0]?.label ||
    "";

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12}>
          <FormControlLabel
            label={`当前视频源: ${localConfig.fromScreen ? "本机" : "采集卡"}`}
            control={
              <Checkbox
                checked={localConfig.fromScreen}
                disabled={
                  getStreamStatus(stream, localConfig) !==
                  "使用以上参数开始录制"
                }
                onClick={() =>
                  setLocalConfig({
                    ...localConfig,
                    fromScreen: !localConfig.fromScreen,
                  })
                }
              />
            }
          ></FormControlLabel>
        </Grid>
        {localConfig.fromScreen ? null : (
          <Fragment>
            <Grid item sm={12} md={6} xl={2} mt={0.75}>
              <TextField
                select
                disabled={
                  getStreamStatus(stream, localConfig) !==
                  "使用以上参数开始录制"
                }
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
                    disabled={
                      getStreamStatus(stream, localConfig) !==
                      "使用以上参数开始录制"
                    }
                    onClick={() =>
                      setLocalConfig({
                        ...localConfig,
                        audio: !localConfig.audio,
                      })
                    }
                  />
                }
              ></FormControlLabel>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                label="视频源"
                disabled={
                  getStreamStatus(stream, localConfig) !==
                  "使用以上参数开始录制"
                }
                required
                value={selectedVideoDeviceLabel}
                sx={{ width: "100%" }}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    videoDeviceId: mediaDeviceList.find(
                      (dev) => dev.label === e.target.value
                    )!.deviceId,
                  })
                }
              >
                {mediaDeviceList
                  .filter((dev) => dev.kind === "videoinput")
                  .map((dev) => (
                    <MenuItem key={dev.label} value={dev.label}>
                      {dev.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <TextField
                select
                label="音频源"
                disabled={
                  getStreamStatus(stream, localConfig) !==
                  "使用以上参数开始录制"
                }
                required
                value={selectedAudioDeviceLabel}
                sx={{ width: "100%" }}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    audioDeviceId: audioDeviceList.find(
                      (dev) => dev.label === e.target.value
                    )!.deviceId,
                  })
                }
              >
                {mediaDeviceList
                  .filter(
                    (dev) =>
                      dev.kind === "audioinput" && dev.deviceId.length > 20
                  )
                  .map((dev) => (
                    <MenuItem key={dev.label} value={dev.label}>
                      {dev.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          </Fragment>
        )}
      </Grid>

      <Button
        variant="outlined"
        disabled={getStreamStatus(stream, localConfig) === "正在打开摄像头模块"}
        onClick={() => {
          setLocalConfig((prev) => {
            const newConfig = { ...prev, enabled: !prev.enabled };
            setMediaDevicesConfig(newConfig);
            return newConfig;
          });
        }}
      >
        {getStreamStatus(stream, localConfig)}
      </Button>
    </div>
  );
};
export default MediaDevicesSetting;
