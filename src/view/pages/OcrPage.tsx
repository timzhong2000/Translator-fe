import OcrPlayer from "../common/OcrPlayer";
import FilterSetting from "../config/FilterSetting";
import VirtualScreen from "../common/VirtualScreen";
import { TransResult } from "../common/TransResult";
import { useStreamModel } from "@/context/hook";
import { StreamModelEvent, StreamStatus } from "@/model";
import MediaDevicesSetting from "../config/MediaDevicesSetting";
import { itemIn } from "@/utils/common/enumTool";
import StopRecord from "../config/StopRecord";

const isStreamReady = itemIn([StreamStatus.ACTIVE]);
const isStreamOpened = itemIn([StreamStatus.ACTIVE, StreamStatus.LOADING]);

export const OcrPage = () => {
  const streamModel = useStreamModel([StreamModelEvent.ON_STREAM_CHANGED]);
  const status = streamModel.getStatus();
  if (!isStreamReady(status)) return <MediaDevicesSetting />;
  return (
    <div id={String(Math.random())}>
      <FilterSetting />
      {isStreamOpened(status) && <StopRecord />}
      <OcrPlayer>
        <VirtualScreen />
        <TransResult />
      </OcrPlayer>
    </div>
  );
};

export default OcrPage;
