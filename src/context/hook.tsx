import { TranslatorEvent } from "../model/translator";
import { PreProcessorEvent, StreamModelEvent } from "@/model";
import { preProcessorModelContext } from "./preProcessorModel";
import { streamModelContext } from "./streamModelContext";
import { translatorModelContext } from "./translatorModel";
import { useModel } from "@/model/connector/hooks";
import { core } from "@/model/core";

export function useTranslatorModel(
  listenEvents: TranslatorEvent[] | Set<TranslatorEvent> = []
) {
  return useModel(translatorModelContext, (model) => model, listenEvents);
}

export function useOcrModel() {
  return core.ocr;
}

export function useStreamModel(
  listenEvents: StreamModelEvent[] | Set<StreamModelEvent> = []
) {
  return useModel(streamModelContext, (model) => model, listenEvents);
}

export function usePreProcessorModel(
  listenEvents: PreProcessorEvent[] | Set<PreProcessorEvent> = []
) {
  return useModel(preProcessorModelContext, (model) => model, listenEvents);
}
