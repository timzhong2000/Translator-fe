import { useEffect } from "react";
import { useAsync } from "react-async-hook";

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

const useMediaDeviceList = () => {
  const { result: devices, execute, loading } = useAsync(getDevices, []);
  useEffect(() => {
    const onDevicechange = () => execute();
    window.navigator.mediaDevices.addEventListener(
      "devicechange",
      onDevicechange
    );
    return () =>
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        onDevicechange
      );
  }, []);
  return {
    videoDevices: devices?.videoDevices ?? [],
    audioDevices: devices?.audioDevices ?? [],
    loading,
    forceUpdate: () => execute(),
  };
};

export const getDisplayLabel = (dev: MediaDeviceInfo) => {
  return `${dev.label || "default"}(${dev.deviceId.slice(0, 5)})`;
};

export default useMediaDeviceList;
