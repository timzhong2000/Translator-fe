import { FC, useEffect } from "react";
import { usePreProcessorModel, useStreamModel } from "@/context/hook";
import { PreProcessorEvent, StreamModelEvent } from "@/model";
import { CutArea } from "@/types/globalConfig";
import { cutAreaParser } from "@/utils/common/cutAreaParser";
import { storeContext } from "@/context";
import { createConnector } from "@/context/connector";

const connector = createConnector(
  storeContext,
  ({ cutArea, filterConfig }) => ({ cutArea, filterConfig }),
  () => ({})
);

const PreProcessCanvas: FC<{
  cutArea: CutArea;
}> = (props) => {
  const { cutArea } = props;
  const preProcessorModel = usePreProcessorModel([
    PreProcessorEvent.ON_SIZE_CHANGED,
  ]);

  useEffect(() => {
    const area = cutAreaParser(cutArea);
    preProcessorModel.changeSize({ x: area.width, y: area.height });
  }, [cutArea]);

  return <div ref={(el) => el && preProcessorModel.setRoot(el)}></div>;
};

export default connector(PreProcessCanvas);
