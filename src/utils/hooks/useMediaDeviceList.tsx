import { useEffect, useState } from "react";

const getDevices = async () => {
  return await navigator.mediaDevices.enumerateDevices();
};

const useMediaDeviceList = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  useEffect(() => {
    const listener = async () => void setDevices(await getDevices());
    listener();
    navigator.mediaDevices.addEventListener("devicechange", listener);
    return () =>
      navigator.mediaDevices.removeEventListener("devicechange", listener);
  }, []);
  return devices;
};

export default useMediaDeviceList;
