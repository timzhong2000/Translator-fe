import { Filter } from "@/types/Filter";
import { rgb2l } from "./rgb2hsl";
const runFilter = (filters: Filter[], image: ImageData) => {
  const pixelNum = image.height * image.width * 4;
  for (let pos = 0; pos < pixelNum; pos += 4) {
    filters.forEach((filter) => {
      const r = pos;
      const g = pos + 1;
      const b = pos + 2;
      switch (filter.type) {
        case "binary":
          const result = rgb2l(image.data[r], image.data[g], image.data[b]) > filter.coreValue! ? 255 : 0;
          image.data[r] = image.data[g] = image.data[b] = result;
          break;
        case "reverse":
          image.data[r] = 255 - image.data[r]
          image.data[g] = 255 - image.data[g]
          image.data[b] = 255 - image.data[b]
          break;
        case "removeColor":
          console.error("unimplement")
          break;
      }
    })
  }
}

export const runFilterOnCanvas = (
  canvasEl: HTMLCanvasElement,
  filters: Filter[]) => {
  const image = getImageData(canvasEl)
  if (filters.length !== 0) {
    runFilter(filters, image);
  }
  putImageData(canvasEl, image);
  return;
}

const getCtx = (canvasEl: HTMLCanvasElement) => {
  const ctx = canvasEl.getContext("2d")
  if (!ctx) throw new Error("浏览器canvas异常");
  return ctx;
}

export const getImageData = (canvasEl: HTMLCanvasElement) => {
  const ctx = getCtx(canvasEl);
  return ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
}

export const putImageData = (canvasEl: HTMLCanvasElement, image: ImageData) => {
  canvasEl.width = image.width;
  canvasEl.height = image.height;
  const ctx = getCtx(canvasEl);
  return ctx.putImageData(image, 0, 0);
}