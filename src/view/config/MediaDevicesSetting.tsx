import {
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { FC, Fragment } from "react";

import { useTranslation } from "react-i18next";
import useMediaDeviceList, {
  getDisplayLabel,
} from "@/utils/hooks/useMediaDeviceList";
import { useConfig, useStreamModel } from "@/context/hook";
import { itemIn, itemNotIn } from "@/utils/common/enumTool";
import { observer } from "mobx-react-lite";
import { createMediaStreamByConfig } from "@/model/stream/utils";
import { StreamStatus } from "@/types/streamSource";

const buttonTitle: { [key in StreamStatus]: string } = {
  [StreamStatus.ACTIVE]: "setting.media.stopRecord",
  [StreamStatus.INACTIVE]: "setting.media.restartRecord",
  [StreamStatus.LOADING]: "setting.media.startingRecord",
  [StreamStatus.INIT]: "setting.media.startRecord",
  [StreamStatus.UNKNOWN]: "error.unknown",
};

const editable = itemIn([StreamStatus.INACTIVE, StreamStatus.INIT]);
const isStreamOpened = itemIn([StreamStatus.ACTIVE, StreamStatus.LOADING]);

const isButtomEnabled = itemNotIn([StreamStatus.LOADING]);

const MediaDevicesSetting: FC = () => {
  const {
    streamSourceConfig,
    toggleFromScreen,
    setAudioDeviceId,
    toggleAudioEnabled,
    setVideoDeviceId,
  } = useConfig();

  const streamModel = useStreamModel();
  const { t } = useTranslation();
  const {
    videoDevices,
    audioDevices,
    loading: isdeviceListLoading,
    forceUpdate: forceUpdateDeviceList,
  } = useMediaDeviceList();
  const status = streamModel.status;
  const isFormEditable = editable(status);

  const currentSourceLabel = `${t("setting.media.currentSource", {
    source: streamSourceConfig.fromScreen
      ? t("setting.media.screen")
      : t("setting.media.captureCard"),
  })}`;

  const onclick = () => {
    if (isStreamOpened(status)) streamModel.resetStream();
    else
      streamModel.setStreamAsync(createMediaStreamByConfig(streamSourceConfig));
  };

  if (isdeviceListLoading) return <div>正在加载设备列表</div>;

  if (videoDevices.length === 0 && audioDevices.length === 0) {
    return (
      <div>
        没有权限读取视频和音频设备, 请先
        <button
          onClick={() => {
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then((val) => {
                val.getTracks().forEach((track) => track.stop());
                forceUpdateDeviceList();
              });
          }}
        >
          授权
        </button>
      </div>
    );
  }
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12}>
          <FormControlLabel
            label={currentSourceLabel}
            control={
              <Checkbox
                checked={streamSourceConfig.fromScreen}
                disabled={!isFormEditable}
                onClick={() => toggleFromScreen()}
              />
            }
          ></FormControlLabel>
        </Grid>
        {streamSourceConfig.fromScreen ? null : (
          <Fragment>
            <Grid item sm={12} md={6} xl={2} mt={1}>
              <FormControlLabel
                label={t("setting.media.enableAudio") as string}
                control={
                  <Checkbox
                    checked={streamSourceConfig.audio}
                    disabled={!isFormEditable}
                    onClick={() => toggleAudioEnabled()}
                  />
                }
              ></FormControlLabel>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                select
                label={t("setting.media.videoDevice") as string}
                disabled={!isFormEditable}
                required
                value={streamSourceConfig.videoDeviceId}
                sx={{ width: "100%" }}
                onChange={(e) => setVideoDeviceId(e.target.value)}
              >
                {videoDevices.map((dev) => (
                  <MenuItem key={dev.deviceId} value={dev.deviceId}>
                    {getDisplayLabel(dev)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <TextField
                select
                label={t("setting.media.audioDevice") as string}
                disabled={!isFormEditable}
                required
                value={streamSourceConfig.audioDeviceId}
                sx={{ width: "100%" }}
                onChange={(e) => setAudioDeviceId(e.target.value)}
              >
                {audioDevices.map((dev) => (
                  <MenuItem key={dev.deviceId} value={dev.deviceId}>
                    {getDisplayLabel(dev)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Fragment>
        )}
      </Grid>
      <Button
        variant="outlined"
        disabled={!isButtomEnabled(status)}
        onClick={() => onclick()}
      >
        {t(buttonTitle[status])}
      </Button>
    </div>
  );
};

export default observer(MediaDevicesSetting);
