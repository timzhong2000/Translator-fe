import { StreamModelEvent } from "@/model";
import { streamModelContext } from "./streamModelContext";
import { useModel } from "@/model/connector/hooks";
import { core } from "@/model/core";

export function useTranslatorModel() {
  return core.translator;
}

export function useOcrModel() {
  return core.ocr;
}

export function useStreamModel(
  listenEvents: StreamModelEvent[] | Set<StreamModelEvent> = []
) {
  return useModel(streamModelContext, (model) => model, listenEvents);
}
