import OcrPlayer from "../shared/OcrPlayer";
import FilterSetting from "../config/FilterSetting";
import VirtualScreen from "../shared/VirtualScreen";
import { TransResult } from "../shared/TransResult";
import { useStreamModel } from "@/context/hook";
import {
  StreamModelEvent,
  StreamStatus,
} from "@/model";
import MediaDevicesSetting from "../config/MediaDevicesSetting";
import { itemIn } from "@/utils/common/enumTool";

const isStreamReady = itemIn([StreamStatus.ACTIVE]);

export const OcrPage = () => {
  const streamModel = useStreamModel([StreamModelEvent.ON_STREAM_CHANGED]);

  if (!isStreamReady(streamModel.getStatus())) return <MediaDevicesSetting />;
  return (
    <div id={String(Math.random())}>
      <FilterSetting />
      <OcrPlayer>
        <VirtualScreen />
        <TransResult />
      </OcrPlayer>
    </div>
  );
};

export default OcrPage;
