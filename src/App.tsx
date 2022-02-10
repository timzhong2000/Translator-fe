import { Route, Routes } from "react-router-dom";
import "@/utils/i18n";

import Home from "@/components/Home";
import About from "@/components/About";
import Navbar from "@/components/Navbar";
import ConfigPanel from "@/components/config/ConfigPanel";
import OcrPage from "@/components/OcrPage";
import { OpencvTest } from "@/components/ImageOcrTest";
import VirtualScreenPage from "@/components/VirtualScreenPage";

import { VideoContextProvider } from "@/context/videoProcessor";
import { ConfigContextProvider } from "@/context/config";
import { OpenCvContextProvider } from "@/context/opencv";
import { TesseractHook } from "@/context/tesseract";
import { TranslatorProviderWithConfig } from "@/context/translator";

function App() {
  return (
    <Navbar>
      <ConfigContextProvider>
        <OpenCvContextProvider>
          <TesseractHook.TesseractContextProviderWithConfig>
            <TranslatorProviderWithConfig>
              <VideoContextProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="trans" element={<OcrPage />} />
                  <Route path="setting" element={<ConfigPanel />} />
                  <Route path="cvtest" element={<OpencvTest />} />
                  <Route path="vscreen" element={<VirtualScreenPage />} />
                </Routes>
              </VideoContextProvider>
            </TranslatorProviderWithConfig>
          </TesseractHook.TesseractContextProviderWithConfig>
        </OpenCvContextProvider>
      </ConfigContextProvider>
    </Navbar>
  );
}

export default App;
