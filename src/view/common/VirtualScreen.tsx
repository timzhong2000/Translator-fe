import { useStreamModel } from "@/context/hook";
import { StreamModelEvent } from "@/model";
import { MouseEventHandler } from "react";

const VirtualScreen: React.FC<{
  onClick?: MouseEventHandler;
  onDoubleClick?: MouseEventHandler;
}> = (props) => {
  const streamModel = useStreamModel([StreamModelEvent.ON_RESOLUTION_CHANGED]);
  return (
    <div
      ref={(el) => el && streamModel.setRoot(el)}
      className="video-container"
      style={{
        position: "absolute",
      }}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
    ></div>
  );
};

export default VirtualScreen;
