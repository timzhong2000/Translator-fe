import { useContext } from "react";
import Link from "@mui/material/Link";

import SelectArea from "../shared/SelectArea";
import FilterSetting from "../config/FilterSetting";
import PreProcessCanvas from "../shared/PreProcessCanvas";

import { configContext } from "@/context/config";
import { videoContext } from "@/context/videoProcessor";
import { openCvContext } from "@/context/opencv";
import { useTranslation } from "react-i18next";
import VirtualScreen from "../shared/VirtualScreen";
import { TransResult } from "../shared/TransResult";

export const OcrPage = () => {
  const { selectedImageData } = useContext(videoContext);
  const { mediaDevicesConfig } = useContext(configContext);
  const { ready: cvReady } = useContext(openCvContext);
  const { t } = useTranslation();

  if (!mediaDevicesConfig.enabled)
    return (
      <div>
        {t("ocr.RecordStatusIsDisable")}
        <Link href="/#/setting">{t("navbar.setting")}</Link>
      </div>
    );
  if (!cvReady) return <div>{t("ocr.opencvLoading")}</div>;
  return (
    <div>
      {selectedImageData ? <FilterSetting /> : null}
      <PreProcessCanvas />
      <SelectArea>
        <VirtualScreen />
        <TransResult
          style={{
            zIndex: 1,
          }}
        />
      </SelectArea>
    </div>
  );
};

export default OcrPage;
