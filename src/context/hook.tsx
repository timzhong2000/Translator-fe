import { StreamModelEvent } from "@/model";
import { streamModelContext } from "./streamModelContext";
import { useModel } from "@/model/connector/hooks";
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

export function useStreamModel(
  listenEvents: StreamModelEvent[] | Set<StreamModelEvent> = []
) {
  return useModel(streamModelContext, (model) => model, listenEvents);
}
