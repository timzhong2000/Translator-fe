import { useContext, useEffect, useRef } from "react";

import { tesseractContext } from "@/context/tesseract";
import { openCvContext } from "@/context/opencv";
import { opencvFilter } from "@/utils/opencvFilter";

export const OpencvTest = () => {
  const imgEl = useRef<HTMLImageElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { ready: opencvReady, cv } = useContext(openCvContext);
  const {
    statusList: tesseractStatus,
    result,
    recognize,
  } = useContext(tesseractContext);

  const openimg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(imgEl.current && e.target.files){
      imgEl.current.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!opencvReady) return;
    const interval = setInterval(() => {
      if (!imgEl.current || !canvasEl.current || canvasEl.current.width === 150)
        return;
      const src = cv.imread(imgEl.current);
      opencvFilter(cv, src, 50);
      cv.imshow(canvasEl.current, src);
      src.delete();
      recognize(canvasEl.current.toDataURL());
    }, 1000);
    return () => clearInterval(interval);
  }, [opencvReady]);

  return (
    <div>
      <div>{tesseractStatus.current.join(" ")}</div>
      <div>opencv ready: {opencvReady ? "ready" : "not ready"}</div>
      <img ref={imgEl} src="/static/test1.png"/>
      <canvas ref={canvasEl} />
      <div>{result}</div>
      <input type="file" onChange={openimg} />
    </div>
  );
};
