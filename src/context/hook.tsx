import { core } from "@/model/core";
import { useObserver } from "mobx-react-lite";

export function useTranslatorModel() {
  return useObserver(() => core.translator);
}

export function useOcrModel() {
  return useObserver(() => core.ocr);
}

export function useConfig() {
  return useObserver(() => core.config);
}

export function usePreProcessorModel() {
  return useObserver(() => core.preProcessor);
}

export function useStreamModel() {
  return useObserver(() => core.stream);
}
