import { FC, useState } from "react";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Button, Tooltip } from "@mui/material";

import VirtualScreen from "../common/VirtualScreen";
import MediaDevicesSetting from "../config/MediaDevicesSetting";
import StopRecord from "../config/StopRecord";
import { FullScreen } from "../common/FullScreen";

import { itemIn } from "@/utils/common/enumTool";
import { useStreamModel } from "@/context";
import { StreamStatus } from "@/types";

const isStreamReady = itemIn([StreamStatus.ACTIVE]);

const VirtualScreenPage: FC = () => {
  const streamModel = useStreamModel();
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isStreamReady(streamModel.status)) return <MediaDevicesSetting />;
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

export default observer(VirtualScreenPage);
