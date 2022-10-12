import { StreamSourceConfig } from "@/types";
import {
  readFromCamera,
  readFromScreen,
} from "@/utils/streamSource/readStream";

export function createMediaStreamByConfig(config: StreamSourceConfig) {
  return config.fromScreen
    ? readFromScreen({ video: true, audio: false })
    : readFromCamera({
        video: {
          width: 3000,
          height: 3000,
          deviceId: config.videoDeviceId,
        },
        audio: config.audio
          ? {
              deviceId: config.audioDeviceId,
              autoGainControl: false,
              noiseSuppression: false,
              echoCancellation: false,
              suppressLocalAudioPlayback: false,
            }
          : false,
      });
}
