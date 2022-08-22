import { useGesture } from "@use-gesture/react";
import { FC, useRef, useState } from "react";
import "./style.css";

export const LayerResizer: FC<{
  shouldShowResizerPoint: boolean;
  area: {
    height: number;
    width: number;
    top: number;
    left: number;
  };
  onResizeEnd: (area: {
    height: number;
    width: number;
    top: number;
    left: number;
  }) => void;
}> = ({ shouldShowResizerPoint, area, onResizeEnd }) => {
  // [top movement, left movement, width movement, height movement]
  const [movement, _setMovement] = useState([0, 0, 0, 0]);
  const setMovement = (movement: number[]) => {
    requestAnimationFrame(() => {
      _setMovement(movement);
    });
  };
  const top = movement[0];
  const left = movement[1];
  const width = movement[2] + area.width;
  const height = movement[3] + area.height;
  const submitResize = () => {
    onResizeEnd({
      height: height,
      width: width,
      top: area.top + top,
      left: area.left + left,
    });
    setMovement([0, 0, 0, 0]);
  };
  const bindLeft = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [movementX] = (ev as unknown as { movement: [number, number] })
        .movement;
      setMovement([0, movementX, -movementX, 0]);
    },
  });
  const bindLeftTop = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [movementX, movementY] = (
        ev as unknown as { movement: [number, number] }
      ).movement;
      setMovement([movementY, movementX, -movementX, -movementY]);
    },
  });
  const bindLeftButtom = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [movementX, movementY] = (
        ev as unknown as { movement: [number, number] }
      ).movement;
      setMovement([0, movementX, -movementX, movementY]);
    },
  });
  const bindRightTop = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [movementX, movementY] = (
        ev as unknown as { movement: [number, number] }
      ).movement;
      setMovement([movementY, 0, movementX, movementY]);
    },
  });
  const bindRight = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [movementX] = (ev as unknown as { movement: [number, number] })
        .movement;
      setMovement([0, 0, movementX, 0]);
    },
  });
  const bindRightButtom = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [movementX, movementY] = (
        ev as unknown as { movement: [number, number] }
      ).movement;
      setMovement([0, 0, movementX, movementY]);
    },
  });
  const bindButtom = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [, movementY] = (ev as unknown as { movement: [number, number] })
        .movement;
      setMovement([0, 0, 0, movementY]);
    },
  });
  const bindTop = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      const [, movementY] = (ev as unknown as { movement: [number, number] })
        .movement;
      setMovement([movementY, 0, 0, -movementY]);
      console.log(ev);
    },
  });
  const bind = useGesture({
    onDragEnd: submitResize,
    onDrag: (ev) => {
      if ((ev as any).target === resizerContainerRef.current) {
        const [movementX, movementY] = (
          ev as unknown as { movement: [number, number] }
        ).movement;
        setMovement([movementY, movementX, 0, 0]);
      }
    },
  });

  const resizerContainerRef = useRef(null);

  return (
    <div
      className="resizer"
      {...bind()}
      ref={resizerContainerRef}
      style={{ height, width, top, left }}
    >
      {shouldShowResizerPoint && (
        <span className="point left" {...bindLeft()}></span>
      )}
      {shouldShowResizerPoint && (
        <span className="point left-top" {...bindLeftTop()}></span>
      )}
      {shouldShowResizerPoint && (
        <span className="point top" {...bindTop()}></span>
      )}
      {shouldShowResizerPoint && (
        <span className="point right-top" {...bindRightTop()}></span>
      )}
      {shouldShowResizerPoint && (
        <span className="point right" {...bindRight()}></span>
      )}
      {shouldShowResizerPoint && (
        <span className="point right-bottom" {...bindRightButtom()}></span>
      )}
      {shouldShowResizerPoint && (
        <span className="point bottom" {...bindButtom()}></span>
      )}
      {shouldShowResizerPoint && (
        <span className="point left-bottom" {...bindLeftButtom()}></span>
      )}
    </div>
  );
};
