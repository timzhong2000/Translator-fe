import {
  ConnectedComponentType,
  TranslatorClient,
} from "@/model";

import { createConnector } from "@/context/connector";
import { createContext, useEffect, useState } from "react";
import { storeContext } from "./store";

export const translatorModelContext = createContext({} as TranslatorClient);

const translatorSettingConnector = createConnector(
  storeContext,
  ({ translatorConfig }) => ({
    translatorConfig,
  }),
);

const _TranslatorModelContextProvider: ConnectedComponentType<
  typeof translatorSettingConnector
> = ({ translatorConfig, children }) => {
  const [translatorModel] = useState(new TranslatorClient(translatorConfig));
  useEffect(() => {
    translatorModel.config = translatorConfig;
  }, [translatorConfig]);
  return (
    <translatorModelContext.Provider value={translatorModel}>
      {children}
    </translatorModelContext.Provider>
  );
};

export const TranslatorModelContextProvider = translatorSettingConnector(
  _TranslatorModelContextProvider
);
