/**
 * from: bin/postinstall.ts
 * tsc .\bin\postinstall.ts --esModuleInterop --resolveJsonModule
 */

import { access, mkdir, writeFile } from "fs/promises";
import chalk from "chalk";
import { exec, execSync } from "child_process";
import path from "path";
import { existsSync } from "fs";
import packageJson from "../../package.json";
import { Stream } from "node:stream";
import axios from "axios";
import { AxiosResponse } from "axios";
import { checkTypeVersion, createIfNotExist, toText, writeToFile } from "./utils";

/* config */
const tessdataGit = "https://github.com/tesseract-ocr/tessdata_fast.git";
const vendorPath = path.resolve("./public/vendor");
const tesseractPath = path.join(vendorPath, "tesseract");
const opencvPath = path.join(vendorPath, "opencv");
const tesseractJsVersion = "v3.0.1";
const opencvJsVersion = "4.5.5";
const tesseractTypePackage = "tesseract.js";
const opencvTypePackage = "@techstark/opencv-js";

/* code */
const tesseractTypeVersion = packageJson.dependencies[tesseractTypePackage];
const opencvTypeVersion = packageJson.dependencies[opencvTypePackage];

const installTesseract = async () => {
  await createIfNotExist(tesseractPath);
  await Promise.all([cloneTessdata(), downloadTesseractCore()]);
};

const cloneTessdata = async () => {
  if (existsSync(path.join(tesseractPath, "tessdata"))) {
    console.warn(
      chalk.yellow("[tesseract] tessdata already exist, skip download")
    );
    return;
  }
  console.log(
    chalk.green(
      `[tesseract] clone tessdata from ${tessdataGit} it may take a long time`
    )
  );
  const startTime = Date.now();
  const interval = setInterval(
    () =>
      console.log(
        chalk.yellow(
          `[tesseract] please wait tessdata is cloning. ${(
            Date.now() - startTime
          ).toFixed(0)}s`
        )
      ),
    10 * 1000
  );
  await new Promise<void>((resolve, reject) => {
    exec(`git clone ${tessdataGit} tessdata`, { cwd: tesseractPath }, (err) => {
      err ? reject() : resolve();
    });
  });
  clearInterval(interval);
  const endTime = Date.now();
  console.log(
    chalk.green(
      `[tesseract] clone tessdata finish, cost: ${endTime - startTime}ms`
    )
  );
};

const downloadTesseractCore = async () => {
  try {
    await Promise.race([access(path.join(tesseractPath, "worker.min.js"))]);
    console.warn(chalk.yellow("[tesseract] core already exist, skip download"));
    return;
  } catch (err) {
    console.log(
      `[tesseract] start download core from unpkg.com (version: ${tesseractJsVersion})`
    );
    checkTypeVersion("tesseract", tesseractJsVersion, tesseractTypeVersion);
  }
  const startTime = Date.now();
  await Promise.all([
    axios
      .get<string>(
        `https://unpkg.com/tesseract.js@${tesseractJsVersion}/dist/worker.min.js`
      )
      .then(toText)
      .then(writeToFile(path.join(tesseractPath, "worker.min.js"))),
    axios
      .get(
        `https://unpkg.com/tesseract.js-core@${tesseractJsVersion}/tesseract-core.wasm.js`
      )
      .then(toText)
      .then(writeToFile(path.join(tesseractPath, "tesseract-core.wasm.js"))),
    axios
      .get(
        `https://unpkg.com/tesseract.js-core@${tesseractJsVersion}/tesseract-core-simd.wasm.js`
      )
      .then(toText)
      .then(
        writeToFile(path.join(tesseractPath, "tesseract-core-simd.wasm.js"))
      ),
  ]);
  const endTime = Date.now();
  console.log(
    chalk.green(
      `[tesseract] download tesseract core finish, cost: ${
        endTime - startTime
      }ms`
    )
  );
};

const installOpencv = async () => {
  await createIfNotExist(opencvPath);
  try {
    await access(path.join(opencvPath, "opencv.js"));
    console.warn(chalk.yellow("tesseract core already exist, skip download"));
    return;
  } catch (err) {
    console.log(
      chalk.green(
        `[opencv] start download core from docs.opencv.org (version: ${opencvJsVersion})`
      )
    );
    checkTypeVersion("opencv", opencvJsVersion, opencvTypeVersion);
  }
  const startTime = Date.now();
  await axios
    .get(`https://docs.opencv.org/${opencvJsVersion}/opencv.js`)
    .then(toText)
    .then(writeToFile(path.join(opencvPath, "opencv.js")));
  const endTime = Date.now();
  console.log(
    chalk.green(
      `[opencv] download opencv core finish, cost: ${endTime - startTime}ms`
    )
  );
};

(async () => {
  await createIfNotExist(vendorPath);
  await Promise.all([installTesseract(), installOpencv()]);
  console.log(chalk.green("install finish successfully!"));
})();
