import { FC, useEffect } from "react";
import { cutAreaParser } from "@/utils/common/cutAreaParser";
import { observer } from "mobx-react-lite";
import { useConfig, usePreProcessorModel } from "@/context";

const PreProcessCanvas: FC = () => {
  const { cutAreaConfig: cutArea } = useConfig();
  const preProcessorModel = usePreProcessorModel();

  useEffect(() => {
    const area = cutAreaParser(cutArea);
    preProcessorModel.changeSize({ x: area.width, y: area.height });
  }, [cutArea]);

  return <div ref={(el) => el && preProcessorModel.setRoot(el)}></div>;
};

export default observer(PreProcessCanvas);
