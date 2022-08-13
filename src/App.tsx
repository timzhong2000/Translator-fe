import { Route, Routes } from "react-router-dom";
import "@/utils/common/i18n";

import Home from "@/components/pages/Home";
import About from "@/components/pages/About";
import Navbar from "@/components/pages/Navbar";
import ConfigPanel from "@/components/config/ConfigPanel";
import OcrPage from "@/components/pages/OcrPage";
import VirtualScreenPage from "@/components/pages/VirtualScreenPage";
import TextractorPage from "./components/pages/Textractor";

import { StoreContextProvider } from "@/context/store";
import {
  OcrModelContextProvider,
  TranslatorModelContextProvider,
  StreamModelContextProvider,
  PreProcessorModelProvider,
} from "./context";
import { OcrTest } from "./components/pages/OcrTest";

function App() {
  return (
    <Navbar>
      <StoreContextProvider>
        <OcrModelContextProvider>
          <TranslatorModelContextProvider>
            <StreamModelContextProvider>
              <PreProcessorModelProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="trans" element={<OcrPage />} />
                  <Route path="setting" element={<ConfigPanel />} />
                  <Route path="ocrtest" element={<OcrTest />} />
                  <Route path="vscreen" element={<VirtualScreenPage />} />
                  <Route path="textractor" element={<TextractorPage />} />
                </Routes>
              </PreProcessorModelProvider>
            </StreamModelContextProvider>
          </TranslatorModelContextProvider>
        </OcrModelContextProvider>
      </StoreContextProvider>
    </Navbar>
  );
}

export default App;
