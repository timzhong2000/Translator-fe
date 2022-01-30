import React, { createContext, useEffect, useState } from "react";
import opencv_ts from "opencv-ts";

interface OpenCvContext {
  ready: boolean;
  cv: Opencv;
}

export type Opencv = typeof opencv_ts;

export const openCvContext = createContext({} as OpenCvContext);

const scriptId = "opencv.js";
const openCvPath = "/vendor/opencv/opencv.js";

export const OpenCvContextProvider: React.FC = (props) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.getElementById(scriptId) || (window as any).cv) {
      setReady(true);
      return;
    }
    const scriptEl = document.createElement("script");
    scriptEl.id = scriptId;
    scriptEl.src = openCvPath;
    scriptEl.defer = true;
    scriptEl.async = true;
    scriptEl.onload = () =>
      setTimeout(() => {
        setReady(true);
      }, 5000);
    document.body.appendChild(scriptEl);
  }, []);

  return (
    <openCvContext.Provider value={{ ready, cv: (window as any).cv as Opencv }}>
      {props.children}
    </openCvContext.Provider>
  );
};
