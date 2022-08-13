import { StreamConfig } from "@/model";
import { useState, useEffect } from "react";
import { MediaStreamSubscriber } from "../common/MediaStreamSubscriber";

const useStream = (streamConfig: StreamConfig) => {
  const [stream, setStream] = useState<MediaStream>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let temp: MediaStreamSubscriber | undefined;
    MediaStreamSubscriber.createSubscriber(streamConfig)
      .then((subscriber) => {
        temp = subscriber;
        subscriber.subscribe((stream) => {
          setStream(stream);
          setReady(true);
          setError(null);
        });
      })
      .catch((err) => {
        console.log(err);
        setStream(undefined);
        setReady(false);
        setError(err);
      });
    return () => {
      if (temp) {
        temp.destroy();
      }
    };
  }, [
    streamConfig.enabled,
    streamConfig.audio,
    streamConfig.fromScreen,
    streamConfig.videoDeviceId,
    streamConfig.audioDeviceId,
  ]);

  return { stream, ready, error };
};

export default useStream;
