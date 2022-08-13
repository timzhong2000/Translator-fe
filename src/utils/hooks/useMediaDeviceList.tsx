import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { fromEvent, Observable } from "rxjs";

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

const fromDeviceChange = fromEvent(navigator.mediaDevices, "devicechange");

const useMediaDeviceList = () => {
  const { result: devices, reset } = useAsync(getDevices, []);
  useEffect(() => {
    const subscription = fromDeviceChange.subscribe(reset);
    return () => subscription.unsubscribe();
  }, []);
  return devices ?? {videoDevices: [], audioDevices: []};
};

export default useMediaDeviceList;
