import { configContext } from "@/context/config";
import { videoContext } from "@/context/videoProcessor";
import { useContext, useRef, useEffect, MouseEventHandler } from "react";

const VirtualScreen: React.FC<{
  onClick?: MouseEventHandler;
  onDoubleClick?: MouseEventHandler;
}> = (props) => {
  const { mediaDevicesConfig } = useContext(configContext);
  const { stream, setVideoRef } = useContext(videoContext);
  const videoEl = useRef<HTMLVideoElement>(null);

  useEffect(() => void setVideoRef(videoEl), []); // 转发到context中

  useEffect(() => {
    if (stream) {
      videoEl.current!.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      autoPlay
      muted={!mediaDevicesConfig.audio}
      ref={videoEl}
      style={{
        position: "absolute",
        width: mediaDevicesConfig.video.width,
        height: mediaDevicesConfig.video.height,
      }}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
    ></video>
  );
};

export default VirtualScreen;
