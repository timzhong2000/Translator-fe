/**
 * 这个HOC会阻止click的冒泡，react的点击事件会失效
 */
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

export const DragableElement: React.FC<{ style?: CSSProperties }> = (props) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const lastOffset = useRef({ x: 0, y: 0 });
  const isDraging = useRef(false);
  const temp = useRef({ x: 0, y: 0 });
  const divEl = useRef<HTMLDivElement>(null);

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

  // 阻止事件被冒泡给react的事件合成，避免可拖拽组件上的click事件触发父组件的click，是个破坏性更改
  // TODO: 这里对react侵入太大，使用这个HOC可能遇到坑（无法使用react绑定click事件），需要换成更好的写法而不是破坏react对点击事件的合成。
  useEffect(() => {
    const stopPropagation = (e: MouseEvent) => e.stopPropagation();
    divEl.current?.addEventListener("click", stopPropagation);
    return () =>
      void divEl.current?.removeEventListener("click", stopPropagation);
  }, []);

  return (
    <div
      style={{
        ...props.style,
        position: "absolute",
        top: offsetY,
        left: offsetX,
      }}
      ref={divEl}
      onDragStart={onMouseDown}
      onDrag={onMouseMove}
      onDragEnd={onMouseUp}
    >
      {props.children}
    </div>
  );
};
