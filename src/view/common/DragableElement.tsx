import { CSSProperties, FC, memo, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

const DragableElement: FC<{
  style?: CSSProperties;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  children: any;
}> = ({ style, onDragStart, onDragEnd, children }) => {
  const [isDraging, setIsDraging] = useState(false);
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }), []);
  const bind = useGesture({
    onDragStart: () => {
      setIsDraging(true);
      onDragStart?.();
    },
    onDrag: (ev: any) => api.start({ x: ev.offset[0], y: ev.offset[1] }),
    onDragEnd: () => {
      setIsDraging(false);
      onDragEnd?.();
    },
  });
  return (
    <animated.div
      className="dragable-element"
      id={String(Math.random())}
      style={{
        ...style,
        position: "absolute",
        x,
        y,
        cursor: isDraging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      {...bind()}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </animated.div>
  );
};

export default memo(DragableElement);
