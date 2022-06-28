import { configContext } from "@/context/config";
import { useState, useEffect, useContext } from "react";
import { MediaStreamSubscriber } from "../MediaStreamSubscriber";

const useStream = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<any>(null);
  const { mediaDevicesConfig } = useContext(configContext);
  
  useEffect(() => {
    let temp: MediaStreamSubscriber | undefined;
    MediaStreamSubscriber.createSubscriber(mediaDevicesConfig).then((subscriber) => {
      temp = subscriber;
      subscriber.subscribe((stream) => {
        setStream(stream);
        setReady(true);
        setError(null);
      });
    }).catch((err) => {
      console.log(err);
      setStream(undefined);
      setReady(false);
      setError(err);
    });
    return () => {
      if (temp) {
        temp.destroy();
      }
    }
  }, [
    mediaDevicesConfig.enabled,
    mediaDevicesConfig.audio,
    mediaDevicesConfig.fromScreen,
    mediaDevicesConfig.videoDeviceId,
    mediaDevicesConfig.audioDeviceId,
  ]);

  return { stream, ready, error };
};

export default useStream;
