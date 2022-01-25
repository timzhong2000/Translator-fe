import { Route, Routes } from "react-router-dom";
import { Link } from "@mui/material";
import Navbar from "./components/Navbar";
import { ConfigPanel } from "./components/ConfigPanel";
import { ConfigContextProvider } from "@/context/config";
import { Trans } from "./components/Trans";
import { TransContextProvider } from "./context/videoProcessor";

import { OpencvTest } from "./components/Opencv";
import { OpenCvContextProvider } from "./context/opencv";
import { TesseractHook } from "./context/tesseract";
import { TranslatorProvider } from "./context/translator";
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/#/about">About</Link>
    </div>
  );
}

function About() {
  return <div>about</div>;
}

function App() {
  return (
    <Navbar>
      <ConfigContextProvider>
        <OpenCvContextProvider>
          <TesseractHook.TesseractContextProvider poolSize={4} lang="jpn">
            <TranslatorProvider>
              <TransContextProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="trans" element={<Trans />} />
                  <Route path="setting" element={<ConfigPanel />} />
                  <Route path="cvtest" element={<OpencvTest />} />
                </Routes>
              </TransContextProvider>
            </TranslatorProvider>
          </TesseractHook.TesseractContextProvider>
        </OpenCvContextProvider>
      </ConfigContextProvider>
    </Navbar>
  );
}

export default App;
