import { useContext, useState, Fragment } from "react";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import { useTranslation } from "react-i18next";
import { configContext } from "@/context/config";
import { videoContext } from "@/context/videoProcessor";
import { MediaDevicesConfig } from "@/types/globalConfig";
import useMediaDeviceList from "@/utils/hooks/useMediaDeviceList";

const getStreamStatus = (
  stream: MediaStream | undefined,
  mediaDevicesConfig: MediaDevicesConfig
) => {
  const { t } = useTranslation();

  return mediaDevicesConfig.enabled
    ? stream && stream.getTracks().length > 0
      ? t("setting.media.stopRecord")
      : t("setting.media.startingRecord")
    : t("setting.media.startRecord");
};

const MediaDevicesSetting = () => {
  const { mediaDevicesConfig, setMediaDevicesConfig } =
    useContext(configContext);
  const [localConfig, setLocalConfig] = useState(mediaDevicesConfig);
  const { stream } = useContext(videoContext);
  const { t } = useTranslation();
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
  const streamStatus = getStreamStatus(stream, localConfig);
  const editAble = streamStatus === t("setting.media.startRecord");
  const currentSourceLabel =
    streamStatus === t("setting.media.stopRecord")
      ? `${t("setting.media.currentSource")}: ${
          localConfig.fromScreen
            ? t("setting.media.screen")
            : t("setting.media.captureCard")
        } ${t("setting.media.resolution")}: ${
          mediaDevicesConfig.video.width
        } * ${mediaDevicesConfig.video.height}`
      : `${t("setting.media.currentSource")}: ${
          localConfig.fromScreen
            ? t("setting.media.screen")
            : t("setting.media.captureCard")
        }`;
  return (
    <div>
      <Grid container spacing={3} my={3}>
        <Grid item xs={12}>
          <FormControlLabel
            label={currentSourceLabel}
            control={
              <Checkbox
                checked={localConfig.fromScreen}
                disabled={!editAble}
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
            <Grid item sm={12} md={6} xl={2} mt={1}>
              <FormControlLabel
                label={t("setting.media.enableAudio") as string}
                control={
                  <Checkbox
                    checked={localConfig.audio}
                    disabled={!editAble}
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
                label={t("setting.media.videoDevice") as string}
                disabled={!editAble}
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
                label={t("setting.media.audioDevice") as string}
                disabled={!editAble}
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
        disabled={
          getStreamStatus(stream, localConfig) ===
          t("setting.media.startingRecord")
        }
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
