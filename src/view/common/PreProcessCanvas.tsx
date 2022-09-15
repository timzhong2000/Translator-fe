import { FC, useEffect } from "react";
import { cutAreaParser } from "@/utils/common/cutAreaParser";
import { core } from "@/model/core";
import { observer } from "mobx-react-lite";

const PreProcessCanvas: FC = () => {
  const { cutAreaConfig: cutArea } = core.config;
  const preProcessorModel = core.preProcessor;

  useEffect(() => {
    const area = cutAreaParser(cutArea);
    preProcessorModel.changeSize({ x: area.width, y: area.height });
  }, [cutArea]);

  return <div ref={(el) => el && preProcessorModel.setRoot(el)}></div>;
};

export default observer(PreProcessCanvas);
