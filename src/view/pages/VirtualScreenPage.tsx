import VirtualScreen from "../common/VirtualScreen";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { StreamModelEvent, StreamStatus } from "@/model";
import { itemIn } from "@/utils/common/enumTool";
import { useStreamModel } from "@/context";
import MediaDevicesSetting from "../config/MediaDevicesSetting";
import { FC, useState } from "react";
import { FullScreen } from "@/utils/common/Fullscreen";
import { Button, Tooltip } from "@mui/material";
import { t } from "i18next";
import StopRecord from "../config/StopRecord";

const isStreamReady = itemIn([StreamStatus.ACTIVE]);

const VirtualScreenPage: FC = () => {
  const streamModel = useStreamModel([StreamModelEvent.ON_STREAM_CHANGED]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isStreamReady(streamModel.getStatus())) return <MediaDevicesSetting />;
  return (
    <FullScreen
      fullScreen={isFullScreen}
      onFullScreenChange={(isFullScreen) => setIsFullScreen(isFullScreen)}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        <div style={{ position: "absolute" }}>
          <StopRecord />
        </div>
        <VirtualScreen />
        {!isFullScreen && (
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <Button onClick={() => setIsFullScreen(true)}>
              <Tooltip title={t("common.fullscreen") as string}>
                <FullscreenIcon
                  sx={{ padding: 0 }}
                  fontSize="large"
                  color="info"
                />
              </Tooltip>
            </Button>
          </div>
        )}
      </div>
    </FullScreen>
  );
};

export default VirtualScreenPage;