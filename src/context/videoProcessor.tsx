import { useVideoFream } from "@/utils/hooks/useVideoFream";
import {
  createContext,
  useContext,
  useState,
} from "react";
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

export const transContext = createContext({} as TransContext);

export const TransContextProvider: React.FC = (props) => {
  const [videoRef, setVideoRef] = useState<React.RefObject<HTMLVideoElement>>(); // 因为离屏video无法截图，所以需要将组件内的video转发到context中进行截图。

  const { mediaDevicesConfig, cutArea } = useContext(configContext);
  const { stream, ready: streamReady } = useStream(mediaDevicesConfig);
  const { imageData: selectedImageData } = useVideoFream(
    stream,
    videoRef,
    cutArea,
    cutArea.interval
  );

  return (
    <transContext.Provider
      value={{
        stream,
        streamReady,
        selectedImageData,
        videoRef,
        setVideoRef,
      }}
    >
      {props.children}
    </transContext.Provider>
  );
};
