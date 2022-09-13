import { FC, useEffect } from "react";
import { usePreProcessorModel } from "@/context/hook";
import { PreProcessorEvent } from "@/model";
import { cutAreaParser } from "@/utils/common/cutAreaParser";
import { core } from "@/model/core";
import { observer } from "mobx-react-lite";

const PreProcessCanvas: FC = () => {
  const { cutAreaConfig: cutArea } = core.config;
  const preProcessorModel = usePreProcessorModel([
    PreProcessorEvent.ON_SIZE_CHANGED,
  ]);

  useEffect(() => {
    const area = cutAreaParser(cutArea);
    preProcessorModel.changeSize({ x: area.width, y: area.height });
  }, [cutArea]);

  return <div ref={(el) => el && preProcessorModel.setRoot(el)}></div>;
};

export default observer(PreProcessCanvas);
