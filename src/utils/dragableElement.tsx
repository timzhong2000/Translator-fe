import { CSSProperties, useCallback, useRef, useState } from "react";

export const DragableElement: React.FC<{ style?: CSSProperties }> = (props) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const lastOffset = useRef({ x: 0, y: 0 });
  const isDraging = useRef(false);
  const temp = useRef({ x: 0, y: 0 });
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    temp.current = { x: e.clientX, y: e.clientY };
    isDraging.current = true;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraging.current) {
      const newOffset = getOffset(e);
      requestAnimationFrame(() => {
        setOffsetX(newOffset.x);
        setOffsetY(newOffset.y);
      });
    }
  }, []);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (isDraging.current) {
      const newOffset = getOffset(e);
      requestAnimationFrame(() => {
        setOffsetX(newOffset.x);
        setOffsetY(newOffset.y);
      });
      isDraging.current = false;
      lastOffset.current = newOffset;
    }
  }, []);

  const getOffset = (e: React.MouseEvent) => {
    const newOffset = {
      x: lastOffset.current.x + e.clientX - temp.current.x,
      y: lastOffset.current.y + e.clientY - temp.current.y,
    };
    return newOffset;
  };

  return (
    <div
      style={{
        ...props.style,
        position: "absolute",
        top: offsetY,
        left: offsetX,
      }}
      onDragStart={onMouseDown}
      onDrag={onMouseMove}
      onDragEnd={onMouseUp}
    >
      {props.children}
    </div>
  );
};
