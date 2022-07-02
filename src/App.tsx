import { Route, Routes } from "react-router-dom";
import "@/utils/i18n";

import Home from "@/components/pages/Home";
import About from "@/components/pages/About";
import Navbar from "@/components/pages/Navbar";
import ConfigPanel from "@/components/config/ConfigPanel";
import OcrPage from "@/components/pages/OcrPage";
import { OpencvTest } from "@/components/pages/ImageOcrTest";
import VirtualScreenPage from "@/components/pages/VirtualScreenPage";
import TextractorPage from "./components/pages/Textractor";

import {
  SelectedImageContextProvider,
  VideoContextProvider,
} from "@/context/video";
import { ConfigContextProvider } from "@/context/config";
import { OpenCvContextProvider } from "@/context/opencv";
import { TesseractHook } from "@/context/tesseract";
import { OcrContextProvider } from "./context/ocrContext";

function App() {
  return (
    <Navbar>
      <ConfigContextProvider>
        <OpenCvContextProvider>
          <TesseractHook.TesseractContextProviderWithConfig>
            <OcrContextProvider>
              <VideoContextProvider>
                <SelectedImageContextProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="trans" element={<OcrPage />} />
                    <Route path="setting" element={<ConfigPanel />} />
                    <Route path="cvtest" element={<OpencvTest />} />
                    <Route path="vscreen" element={<VirtualScreenPage />} />
                    <Route path="textractor" element={<TextractorPage />} />
                  </Routes>
                </SelectedImageContextProvider>
              </VideoContextProvider>
            </OcrContextProvider>
          </TesseractHook.TesseractContextProviderWithConfig>
        </OpenCvContextProvider>
      </ConfigContextProvider>
    </Navbar>
  );
}

export default App;
