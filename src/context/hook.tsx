import { TranslatorEvent } from "../model/translator";
import { OcrModelEvent, PreProcessorEvent, StreamModelEvent } from "@/model";
import { ocrModelContext } from "./ocrModelContext";
import { preProcessorModelContext } from "./preProcessorModel";
import { streamModelContext } from "./streamModelContext";
import { translatorModelContext } from "./translatorModel";
import { useModel } from "@/model/connector/hooks";

export function useTranslatorModel(
  listenEvents: TranslatorEvent[] | Set<TranslatorEvent> = []
) {
  return useModel(translatorModelContext, (model) => model, listenEvents);
}

export function useOcrModel(
  listenEvents: OcrModelEvent[] | Set<OcrModelEvent> = []
) {
  return useModel(ocrModelContext, (model) => model, listenEvents);
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
