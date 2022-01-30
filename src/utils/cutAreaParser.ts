import { CutArea } from "@/types/globalConfig";

export const cutAreaParser = (cutArea: CutArea) => (
  {
    startX: Math.min(cutArea.x1, cutArea.x2),
    startY: Math.min(cutArea.y1, cutArea.y2),
    endX: Math.max(cutArea.x1, cutArea.x2),
    endY: Math.max(cutArea.y1, cutArea.y2),
    width: Math.abs(cutArea.x1 - cutArea.x2),
    height: Math.abs(cutArea.y1 - cutArea.y2),
  }
)