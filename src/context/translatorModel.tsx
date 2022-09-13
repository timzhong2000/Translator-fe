import { TranslatorClient } from "@/model";
import { observer } from "mobx-react-lite";

import { createContext, FC } from "react";
import { core } from "../model/core";
export const translatorModelContext = createContext({} as TranslatorClient);

const _TranslatorModelContextProvider: FC = ({ children }) => {
  const translatorModel = new TranslatorClient(core.config.translatorConfig);
  translatorModel.config = core.config.translatorConfig;
  return (
    <translatorModelContext.Provider value={translatorModel}>
      {children}
    </translatorModelContext.Provider>
  );
};

export const TranslatorModelContextProvider = observer(_TranslatorModelContextProvider);
