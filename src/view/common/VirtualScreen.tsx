import { useStreamModel } from "@/context/hook";
import { MouseEventHandler } from "react";

const VirtualScreen: React.FC<{
  onClick?: MouseEventHandler;
  onDoubleClick?: MouseEventHandler;
}> = (props) => {
  const streamModel = useStreamModel();
  return (
    <div
      ref={(el) => el && streamModel.mount(el)}
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
