Tessdata_GIT=https://github.com/tesseract-ocr/tessdata_fast.git
Tesseract_JS_Version=2.1.5
Tesseract_WASM_Version=2.2.0
OpenCV_Version=4.5.5

if [ ! -d "public/vendor" ]; then 
mkdir public/vendor
fi

cd ./public/vendor
echo "\33[32mEntering public/vendor \33[0m"
if [ ! -d "tesseract" ]; then 
mkdir tesseract
fi

if [ ! -d "tesseract/tessdata_fast" ]; then 
echo "\33[32mDownloading tessdata \33[0m"
mkdir tesseract/tessdata_fast
git clone $Tessdata_GIT tesseract/tmp
mv tesseract/tmp/*.traineddata tesseract/tessdata_fast
rm -rf tesseract/tmp
else 
echo "\33[32mtessdata already exist. skip download. \33[0m"
fi

echo "\33[32mDownloading Tesseract.js \33[0m"
rm tesseract/*
wget -P tesseract/ https://unpkg.com/tesseract.js@v$Tesseract_JS_Version/dist/worker.min.js -q --show-progress 
wget -P tesseract/ https://unpkg.com/tesseract.js-core@v$Tesseract_WASM_Version/tesseract-core.wasm.js -q --show-progress 

if [ -f "tesseract/worker.min.js" ] && [ -f "tesseract/tesseract-core.wasm.js" ]; then
echo "\33[32mDownload Tesseract.js success \33[0m"
else
echo "\33[31mError occur when downloading Tesseract.js \33[0m"
fi

if [ ! -d "opencv" ]; then
mkdir opencv
fi
echo "\33[32mDownloading OpenCV.js \33[0m"
rm opencv/*
wget -P opencv/ https://docs.opencv.org/$OpenCV_Version/opencv.js -q --show-progress 
if [ -f "opencv/opencv.js" ]; then
echo "\33[32mDownload OpenCV.js success \33[0m"
else
echo "\33[31mError occur when downloading OpenCV.js \33[0m"
fi