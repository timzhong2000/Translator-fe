import { configContext } from "@/context/config"
import { useContext } from "react"
import { useTranslation } from "react-i18next"
import VirtualScreen from "../shared/VirtualScreen"

const VirtualScreenPage = () => {
  const { mediaDevicesConfig } = useContext(configContext)
  const { t } = useTranslation();
  
  return (<div>
    <div><span>{t("virtualScreen.audioPlayback")}: {mediaDevicesConfig.audio ? "on" : "off"}</span></div>
    <div><span>{t("virtualScreen.resolution")}: {mediaDevicesConfig.video.width}*{mediaDevicesConfig.video.height}</span></div>
    <div style={{
      position: "relative"
    }}>
      <VirtualScreen />
    </div>
  </div>)

}

export default VirtualScreenPage