import {
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Fragment } from "react";

import { useTranslation } from "react-i18next";
import { storeContext } from "@/context/store";
import useMediaDeviceList from "@/utils/hooks/useMediaDeviceList";
import { ConnectedComponentType, createConnector } from "@/context/connector";
import { StreamConfig, StreamModelEvent, StreamStatus } from "@/model";
import { useStreamModel } from "@/context/hook";
import { fromMediaDevice } from "@/utils/common/MediaStreamSubscriber";
import { itemIn, itemNotIn } from "@/utils/common/enumTool";

const connector = createConnector(
  storeContext,
  ({ streamConfig }) => ({
    streamConfig,
  }),
  ({ streamConfig, setStreamConfig }) => {
    const partialSet = (val: Partial<StreamConfig>) => {
      setStreamConfig({
        ...streamConfig,
        ...val,
      });
    };
    return {
      streamConfig,
      toggleFromScreen: () =>
        partialSet({ fromScreen: !streamConfig.fromScreen }),
      toggleAudioEnabled: () => partialSet({ audio: !streamConfig.audio }),
      setAudioDeviceId: (audioDeviceId?: string) =>
        partialSet({ audioDeviceId }),
      setVideoDeviceId: (videoDeviceId?: string) =>
        partialSet({ videoDeviceId }),
    };
  }
);

function getIdByLabel(list: MediaDeviceInfo[], label?: string) {
  return list.find((dev) => dev.label === label)?.deviceId;
}

function getLabelById(list: MediaDeviceInfo[], id?: string) {
  return list.find((dev) => dev.deviceId === id)?.label ?? list[0]?.label ?? "";
}

const buttonTitle: { [key in StreamStatus]: string } = {
  [StreamStatus.ACTIVE]: "setting.media.stopRecord",
  [StreamStatus.EMPTY]: "setting.media.restartRecord",
  [StreamStatus.INACTIVE]: "setting.media.restartRecord",
  [StreamStatus.LOADING]: "setting.media.startingRecord",
  [StreamStatus.NOT_READY]: "setting.media.startRecord",
  [StreamStatus.TIMEOUT]: "error.timeout",
  [StreamStatus.UNKNOWN]: "error.unknown",
};

const editable = itemIn([
  StreamStatus.INACTIVE,
  StreamStatus.NOT_READY,
  StreamStatus.EMPTY,
]);

const isStreamOpened = itemIn([StreamStatus.ACTIVE, StreamStatus.LOADING]);

const isButtomEnabled = itemNotIn([StreamStatus.LOADING]);

const MediaDevicesSetting: ConnectedComponentType<typeof connector> = (
  props
) => {
  const {
    streamConfig,
    toggleFromScreen,
    setAudioDeviceId,
    toggleAudioEnabled,
    setVideoDeviceId,
  } = props;
  const { videoDeviceId, audioDeviceId, fromScreen, audio } = streamConfig;
  const streamModel = useStreamModel([
    StreamModelEvent.ON_STREAM_CHANGED,
    StreamModelEvent.ON_LOADING_CHANGED,
  ]);
  const { t } = useTranslation();
  const { videoDevices, audioDevices } = useMediaDeviceList();
  const selectedVideoDeviceLabel = getLabelById(videoDevices, videoDeviceId);
  const selectedAudioDeviceLabel = getLabelById(audioDevices, audioDeviceId);
  const status = streamModel.getStatus();
  const isFormEditable = editable(status);
  const currentSourceLabel = `${t("setting.media.currentSource", {
    source: fromScreen
      ? t("setting.media.screen")
      : t("setting.media.captureCard"),
  })}`;

  const onclick = () => {
    if (isStreamOpened(status)) streamModel.reset();
    else streamModel.setStreamAsync(fromMediaDevice(streamConfig));
  };

  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12}>
          <FormControlLabel
            label={currentSourceLabel}
            control={
              <Checkbox
                checked={fromScreen}
                disabled={!isFormEditable}
                onClick={() => toggleFromScreen()}
              />
            }
          ></FormControlLabel>
        </Grid>
        {fromScreen ? null : (
          <Fragment>
            <Grid item sm={12} md={6} xl={2} mt={1}>
              <FormControlLabel
                label={t("setting.media.enableAudio") as string}
                control={
                  <Checkbox
                    checked={audio}
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
                value={selectedVideoDeviceLabel}
                sx={{ width: "100%" }}
                onChange={(e) =>
                  setVideoDeviceId(getIdByLabel(videoDevices, e.target.value))
                }
              >
                {videoDevices.map((dev) => (
                  <MenuItem key={dev.label} value={dev.label}>
                    {dev.label}
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
                value={selectedAudioDeviceLabel}
                sx={{ width: "100%" }}
                onChange={(e) =>
                  setAudioDeviceId(getIdByLabel(audioDevices, e.target.value))
                }
              >
                {audioDevices.map((dev) => (
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
        disabled={!isButtomEnabled(status)}
        onClick={() => onclick()}
      >
        {t(buttonTitle[status])}
      </Button>
    </div>
  );
};
export default connector(MediaDevicesSetting);
