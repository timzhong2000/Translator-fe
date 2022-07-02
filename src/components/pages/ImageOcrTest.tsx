import { useContext, useEffect, useRef } from "react";

import { openCvContext } from "@/context/opencv";
import { opencvFilter } from "@/utils/opencvFilter";
import { OcrImage } from "@/utils/OcrClient";
import { useState } from "react";
import { useOcrClient } from "@/utils/hooks/useOcrClient";

export const OpencvTest = () => {
  const imgEl = useRef<HTMLImageElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { ready: opencvReady, cv } = useContext(openCvContext);

  const [image, setImage] = useState(new Blob());
  const result = useOcrClient("tesseract-local", image);

  const openimg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imgEl.current && e.target.files) {
      imgEl.current.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!opencvReady) return;
    const interval = setInterval(async () => {
      if (!imgEl.current || !canvasEl.current || canvasEl.current.width === 150)
        return;
      const src = cv.imread(imgEl.current);
      opencvFilter(cv, src, 50);
      cv.imshow(canvasEl.current, src);
      src.delete();
      setImage(await OcrImage.canvasToBlob(canvasEl.current));
    }, 1000);
    return () => clearInterval(interval);
  }, [opencvReady]);

  return (
    <div>
      {/* <div>{tesseractStatus.current.join(" ")}</div> */}
      <div>opencv ready: {opencvReady ? "ready" : "not ready"}</div>
      <img ref={imgEl} src="/static/test1.png" />
      <canvas ref={canvasEl} />
      <div>{result}</div>
      <input type="file" onChange={openimg} />
    </div>
  );
};
