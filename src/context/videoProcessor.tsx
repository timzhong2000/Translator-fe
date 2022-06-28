import { useVideoFream } from "@/utils/hooks/useVideoFream";
import { createContext, useContext, useEffect, useState } from "react";
import { configContext } from "./config";
import useStream from "@/utils/hooks/useStream";

type RGB = {
  r: number;
  g: number;
  b: number;
};

interface TransContext {
  stream?: MediaStream;
  streamReady: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  backGroundColor: RGB;
  setBackGroundColor: React.Dispatch<React.SetStateAction<RGB>>;
  setVideoRef: React.Dispatch<
    React.SetStateAction<React.RefObject<HTMLVideoElement> | undefined>
  >;
}

export const videoContext = createContext({} as TransContext);

export const VideoContextProvider: React.FC = (props) => {
  const [videoRef, setVideoRef] = useState<React.RefObject<HTMLVideoElement>>(); // 因为离屏video无法截图，所以需要将组件内的video转发到context中进行截图。
  const [backGroundColor, setBackGroundColor] = useState<RGB>({
    r: 255,
    g: 255,
    b: 255,
  });
  const { mediaDevicesConfig, cutArea, setMediaDevicesConfig } =
    useContext(configContext);
  const { stream, ready: streamReady } = useStream();

  /**
   * 如果设备分辨率与设定期望分辨率不符合，浏览器会自动回退分辨率，需要用实际视频元信息进行配置矫正
   */
  useEffect(() => {
    if (stream) {
      const actualVideoSetting = stream.getVideoTracks()[0].getSettings();
      setMediaDevicesConfig((prev) => ({
        ...prev,
        video: {
          height: actualVideoSetting.height || mediaDevicesConfig.video.height,
          width: actualVideoSetting.width || mediaDevicesConfig.video.width,
        },
      }));
    }
  }, [stream]);

  return (
    <videoContext.Provider
      value={{
        stream,
        streamReady,
        videoRef,
        backGroundColor,
        setBackGroundColor,
        setVideoRef,
      }}
    >
      {props.children}
    </videoContext.Provider>
  );
};

// 按照config中的配置从视频截取帧
export const selectedImageContext = createContext(
  undefined as ImageData | undefined
);

export const SelectedImageContextProvider: React.FC = (props) => {
  const { cutArea } = useContext(configContext);
  const { stream, videoRef } = useContext(videoContext);
  const { imageData: selectedImageData } = useVideoFream(
    stream,
    videoRef,
    cutArea,
    cutArea.interval
  );
  return (
    <selectedImageContext.Provider value={selectedImageData}>
      {props.children}
    </selectedImageContext.Provider>
  );
};
