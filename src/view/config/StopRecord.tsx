import { useStreamModel } from "@/context";
import { Button } from "@mui/material";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

const StopRecord: FC = () => {
  const { t } = useTranslation();
  const streamModel = useStreamModel();
  return (
    <Button onClick={() => streamModel.resetStream()}>
      {t("setting.media.stopRecord")}
    </Button>
  );
};

export default memo(StopRecord);
