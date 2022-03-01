import { MediaDevicesConfig } from "@/types/globalConfig";
import { getStream } from "@/utils/getStream";
import { useState, useEffect } from "react";

const useStream = (mediaDevicesConfig: MediaDevicesConfig) => {
  const [stream, setStream] = useState<MediaStream>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!mediaDevicesConfig.enabled) {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      return;
    }
    (async function () {
      try {
        const stream = await getStream(mediaDevicesConfig);
        (window as any).stream = stream;
        setStream(stream);
        setReady(true);
        setError(null);
      } catch (err) {
        console.log(err);
        setReady(false);
        setError(err);
      }
    })();
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
