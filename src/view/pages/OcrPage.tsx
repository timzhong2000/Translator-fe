import OcrPlayer from "../common/OcrPlayer";
import FilterSetting from "../config/FilterSetting";
import VirtualScreen from "../common/VirtualScreen";
import { TransResult } from "../common/TransResult";
import MediaDevicesSetting from "../config/MediaDevicesSetting";
import StopRecord from "../config/StopRecord";

import { useStreamModel } from "@/context/hook";
import { itemIn } from "@/utils/common/enumTool";
import { StreamStatus } from "@/types";
import { observer } from "mobx-react-lite";

const isStreamReady = itemIn([StreamStatus.ACTIVE]);
const isStreamOpened = itemIn([StreamStatus.ACTIVE, StreamStatus.LOADING]);

export const OcrPage = () => {
  const streamModel = useStreamModel();
  const status = streamModel.status;

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

export default observer(OcrPage);
