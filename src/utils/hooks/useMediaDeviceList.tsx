import { useEffect } from "react";
import { useAsync } from "react-async-hook";
import { fromEvent } from "rxjs";

const getDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    videoDevices: devices.filter(
      (dev) => dev.kind === "videoinput" && dev.deviceId.length > 20
    ),
    audioDevices: devices.filter(
      (dev) => dev.kind === "audioinput" && dev.deviceId.length > 20
    ),
  };
};

const fromDeviceChange = fromEvent(
  window.navigator.mediaDevices,
  "devicechange"
);

const useMediaDeviceList = () => {
  const { result: devices, reset, loading } = useAsync(getDevices, []);
  useEffect(() => {
    const subscription = fromDeviceChange.subscribe(reset);
    return () => subscription.unsubscribe();
  }, []);
  return {
    videoDevices: devices?.videoDevices ?? [],
    audioDevices: devices?.audioDevices ?? [],
    loading,
    forceUpdate: reset,
  };
};

export const getDisplayLabel = (dev: MediaDeviceInfo) => {
  return `${dev.label || "default"}(${dev.deviceId.slice(0, 5)})`;
};

export default useMediaDeviceList;
