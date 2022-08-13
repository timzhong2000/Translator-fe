import { FC, memo, useEffect, useRef, useState } from "react";

const _FullScreen: FC<{
  fullScreen: boolean;
  onFullScreenChange: (isFullScreen: boolean) => void;
}> = (props) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const { fullScreen, onFullScreenChange } = props;

  const requestFullScreen = () => {
    if (containerEl.current) {
      containerEl.current.requestFullscreen();
      const fullscreenchangeHandler = () =>
        onFullScreenChange(document.fullscreenElement === containerEl.current);
      containerEl.current.addEventListener(
        "fullscreenchange",
        fullscreenchangeHandler
      );
      return () =>
        containerEl.current &&
        containerEl.current.removeEventListener(
          "fullscreenchange",
          fullscreenchangeHandler
        );
    }
  };

  useEffect(() => void (fullScreen && requestFullScreen()), [fullScreen]);
  return <div ref={containerEl}>{props.children}</div>;
};

export const FullScreen = _FullScreen;
