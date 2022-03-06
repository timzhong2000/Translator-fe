import { MediaDevicesConfig } from "@/types/globalConfig";

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

export const getStream = async (config: MediaDevicesConfig) => {
  try {
    if (config.fromScreen)
      return await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
    else
      return await navigator.mediaDevices.getUserMedia({
        video: { width: 3000, height: 3000, deviceId: config.videoDeviceId },
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
  } catch (error) {
    throw new Error(errorHandler(error as Error));
  }
};
