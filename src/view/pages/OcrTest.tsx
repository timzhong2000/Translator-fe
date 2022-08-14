import { useOcrModel } from "@/context";
import { useRef, useState } from "react";

export const OcrTest = () => {
  const imgEl = useRef<HTMLImageElement>(null);
  // const preProcessorModel = usePreProcessorModel([
  //   PreProcessorEvent.ON_SIZE_CHANGED,
  // ]);
  const ocrModel = useOcrModel();
  const [result, setResult] = useState("");
  const openimg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imgEl.current && e.target.files) {
      imgEl.current.src = URL.createObjectURL(e.target.files[0]);
      ocrModel
        .recognize(e.target.files[0])
        .then((result) => setResult(ocrModel.toString(result)));
    }
  };
  return (
    <div>
      <img ref={imgEl} src="/static/test1.png" />
      {/* <div ref={(el) => el && preProcessorModel.setRoot(el)}></div> */}
      <div>{result}</div>
      <input type="file" onChange={openimg} />
    </div>
  );
};
