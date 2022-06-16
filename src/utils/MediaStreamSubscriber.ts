import { MediaDevicesConfig } from "@/types/globalConfig";
import { SubscriberBase } from "./Subscriber";

export class MediaStreamSubscriber extends SubscriberBase<MediaStream> {
  // 停止当前的流
  protected stopStream() {
    if (this.cache) {
      this.cache.getTracks().forEach((t) => t.stop());
    }
  }

  broadcast(data: MediaStream): void {
    this.stopStream();
    // data.getVideoTracks()[0].getSettings()
    // 如果不延迟会导致以上命令读出全屏分辨率。
    setTimeout(() => {
      super.broadcast(data);
    }, 500);
  }

  destroy(): void {
    console.log("destroy MediaStreamSubscriber");
    this.stopStream();
    super.destroy();
  }

  static createSubscriber(config: MediaDevicesConfig) {
    if (!config.enabled) {
      return Promise.reject("mediastream disabled");
    }
    if (config.fromScreen) {
      // 屏幕流
      return new Promise<MediaStreamSubscriber>((resolve, reject) => {
        const subscriber: ScreenSubscriber = new ScreenSubscriber(
          { video: true, audio: false },
          () => resolve(subscriber),
          (err) => reject(err)
        );
      });
    } else {
      // 相机流
      return new Promise<MediaStreamSubscriber>((resolve, reject) => {
        const subscriber: CameraSubscriber = new CameraSubscriber(
          {
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
          },
          () => resolve(subscriber),
          (err) => reject(err)
        );
      });
    }
  }
}

class CameraSubscriber extends MediaStreamSubscriber {
  constructor(
    private config: MediaStreamConstraints,
    private onSuccess: () => void,
    private onError: (err: any) => any
  ) {
    super();
    this.init();
  }

  private async init() {
    try {
      console.log("start record");
      this.broadcast(await navigator.mediaDevices.getUserMedia(this.config));
      this.onSuccess();
    } catch (err) {
      this.onError(errorHandler(err as Error));
    }
  }
}

class ScreenSubscriber extends MediaStreamSubscriber {
  constructor(
    private config: MediaStreamConstraints,
    private onSuccess: () => void,
    private onError: (err: any) => any
  ) {
    super();
    this.init();
  }

  private async init() {
    try {
      this.broadcast(await navigator.mediaDevices.getDisplayMedia(this.config));
      this.onSuccess();
    } catch (err) {
      this.onError(errorHandler(err as Error));
    }
  }
}

const errorHandler = (err: Error) => {
  if (
    err.name === "NotReadableError" &&
    err.message === "Could not start video source"
  ) {
    return `获取摄像头权限失败，屏幕翻译需要摄像头权限。
    请检查系统权限设置（设置->隐私->相机->将“允许桌面应用访问你的相机”设置为“开”）`;
  } else if (
    err.name === "NotAllowedError" &&
    err.message === "Permission denied by system"
  ) {
    return `获取麦克风权限失败，音频回放需要麦克风权限，如不需要音频回放可以在设置中关闭声音。
    请检查系统权限设置（设置->隐私->麦克风->将“允许桌面应用访问你的麦克风”设置为“开”）`;
  } else if (
    err.name === "NotAllowedError" &&
    err.message === "Permission denied"
  ) {
    return `获取摄像头或麦克风权限失败，如不需要音频回放可以在设置中关闭声音。请检查浏览器权限设置`;
  } else {
    return "未知错误";
  }
};
