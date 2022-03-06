import { useVideoFream } from "@/utils/hooks/useVideoFream";
import { createContext, useContext, useEffect, useState } from "react";
import { configContext } from "./config";
import useStream from "@/utils/hooks/useStream";

interface TransContext {
  stream?: MediaStream;
  streamReady: boolean;
  selectedImageData?: ImageData;
  videoRef?: React.RefObject<HTMLVideoElement>;
  setVideoRef: React.Dispatch<
    React.SetStateAction<React.RefObject<HTMLVideoElement> | undefined>
  >;
}

export const videoContext = createContext({} as TransContext);

export const VideoContextProvider: React.FC = (props) => {
  const [videoRef, setVideoRef] = useState<React.RefObject<HTMLVideoElement>>(); // 因为离屏video无法截图，所以需要将组件内的video转发到context中进行截图。

  const { mediaDevicesConfig, cutArea, setMediaDevicesConfig } =
    useContext(configContext);
  const { stream, ready: streamReady } = useStream(mediaDevicesConfig);
  const { imageData: selectedImageData } = useVideoFream(
    stream,
    videoRef,
    cutArea,
    cutArea.interval
  );

  /**
   * 如果设备分辨率与设定期望分辨率不符合，浏览器会自动回退分辨率，需要用实际视频元信息进行配置矫正
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (stream) {
        const actualVideoSetting = stream.getVideoTracks()[0].getSettings();
        if (
          mediaDevicesConfig.video.height !== actualVideoSetting.height ||
          mediaDevicesConfig.video.width !== actualVideoSetting.width
        ) {
          setMediaDevicesConfig({
            ...mediaDevicesConfig,
            video: {
              height:
                actualVideoSetting.height || mediaDevicesConfig.video.height,
              width: actualVideoSetting.width || mediaDevicesConfig.video.width,
            },
          });
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [stream]);

  return (
    <videoContext.Provider
      value={{
        stream,
        streamReady,
        selectedImageData,
        videoRef,
        setVideoRef,
      }}
    >
      {props.children}
    </videoContext.Provider>
  );
};
