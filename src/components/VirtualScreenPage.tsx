import { configContext } from "@/context/config"
import { useContext } from "react"
import VirtualScreen from "./VirtualScreen"

const VirtualScreenPage = () => {
  const { mediaDevicesConfig } = useContext(configContext)
  return (<div>
    <div><span>声音回放：{mediaDevicesConfig.audio ? "on" : "off"}</span></div>
    <div><span>分辨率：{mediaDevicesConfig.video.width}*{mediaDevicesConfig.video.height}</span></div>
    <div style={{
      position: "relative"
    }}>
      <VirtualScreen />
    </div>
  </div>)

}

export default VirtualScreenPage