import { Route, Routes } from "react-router-dom";
import "@/utils/common/i18n";

import Home from "@/view/pages/Home";
import About from "@/view/pages/About";
import Navbar from "@/view/pages/Navbar";
import ConfigPanel from "@/view/config/ConfigPanel";
import OcrPage from "@/view/pages/OcrPage";
import VirtualScreenPage from "@/view/pages/VirtualScreenPage";
import TextractorPage from "./view/pages/Textractor";

import {
  TranslatorModelContextProvider,
  StreamModelContextProvider,
  PreProcessorModelProvider,
} from "./context";
import { OcrTest } from "./view/pages/OcrTest";

function App() {
  return (
    <Navbar>
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
    </Navbar>
  );
}

export default App;
