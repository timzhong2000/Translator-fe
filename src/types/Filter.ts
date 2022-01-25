export interface Filter {
  type: "binary" | "reverse" | "removeColor"; 
  coreValue?: number | undefined; // removeColor时为色相，binary时作为图像分割阈值
  tolerance?: number | undefined; // removeColor时作为色相容差
}