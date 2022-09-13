import { StreamModel, ConnectedComponentType } from "@/model";
import { createConnector } from "@/context/connector";
import { createContext, useState, useEffect } from "react";
import { storeContext } from "../model/store/store";

export const streamModelContext = createContext({} as StreamModel);

const streamSettingConnector = createConnector(
  storeContext,
  ({ streamConfig }) => ({
    streamConfig,
  })
);

const _StreamModelContextProvider: ConnectedComponentType<
  typeof streamSettingConnector
> = ({ streamConfig, children }) => {
  const [streamModel] = useState(new StreamModel(streamConfig));
  useEffect(() => {
    streamModel.config = streamConfig;
  }, [streamConfig]);
  return (
    <streamModelContext.Provider value={streamModel}>
      {children}
    </streamModelContext.Provider>
  );
};

export const StreamModelContextProvider = streamSettingConnector(
  _StreamModelContextProvider
);
