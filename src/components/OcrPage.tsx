import { useContext } from "react";
import { Link } from "@mui/material";

import SelectArea from "./SelectArea";
import FilterSetting from "./config/FilterSetting";
import PreProcessCanvas from "./PreProcessCanvas";

import { configContext } from "@/context/config";
import { transContext } from "@/context/videoProcessor";
import { openCvContext } from "@/context/opencv";

export const OcrPage = () => {
  const { selectedImageData } = useContext(transContext);
  const { mediaDevicesConfig } = useContext(configContext);
  const { ready: cvReady } = useContext(openCvContext);
  if (!mediaDevicesConfig.enabled)
    return (
      <div>
        录制未启动，请前往<Link href="/#/setting">设置</Link>开启录制
      </div>
    );
  if (!cvReady) return <div>OpenCV正在加载中...</div>;
  return (
    <div>
      {selectedImageData ? <FilterSetting /> : null}
      <PreProcessCanvas />
      <SelectArea />
    </div>
  );
};

export default OcrPage