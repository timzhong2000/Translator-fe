import { Route, Routes } from "react-router-dom";
import "@/utils/common/i18n";

import Home from "@/view/pages/Home";
import About from "@/view/pages/About";
import Navbar from "@/view/pages/Navbar";
import ConfigPanel from "@/view/config/ConfigPanel";
import OcrPage from "@/view/pages/OcrPage";
import VirtualScreenPage from "@/view/pages/VirtualScreenPage";
import TextractorPage from "./view/pages/Textractor";

import { StreamModelContextProvider } from "./context";
import { OcrTest } from "./view/pages/OcrTest";

function App() {
  return (
    <Navbar>
      <StreamModelContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="trans" element={<OcrPage />} />
          <Route path="setting" element={<ConfigPanel />} />
          <Route path="ocrtest" element={<OcrTest />} />
          <Route path="vscreen" element={<VirtualScreenPage />} />
          <Route path="textractor" element={<TextractorPage />} />
        </Routes>
      </StreamModelContextProvider>
    </Navbar>
  );
}

export default App;
