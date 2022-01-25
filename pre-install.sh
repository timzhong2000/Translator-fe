Tessdata_GIT=https://github.com/tesseract-ocr/tessdata_fast.git
Tesseract_JS_Version=2.1.5
Tesseract_WASM_Version=2.2.0
OpenCV_Version=4.5.5

mkdir ./public/vendor
cd ./public/vendor

rm -rf tesseract/tessdata_fast
mkdir tesseract
mkdir tesseract/tessdata_fast
git clone $Tessdata_GIT tesseract/tmp
mv tesseract/tmp/*.traineddata tesseract/tessdata_fast
rm -rf tesseract/tmp
wget -P tesseract/ https://unpkg.com/tesseract.js@v$Tesseract_JS_Version/dist/worker.min.js
wget -P tesseract/ https://unpkg.com/tesseract.js-core@v$Tesseract_WASM_Version/tesseract-core.wasm.js

rm -rf opencv
mkdir opencv
wget -P opencv/ https://docs.opencv.org/$OpenCV_Version/opencv.js
