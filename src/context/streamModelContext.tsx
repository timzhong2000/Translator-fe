import { StreamModel } from "@/model";
import { createContext, FC } from "react";
import { core } from "@/model/core";
import { observer } from "mobx-react-lite";

export const streamModelContext = createContext({} as StreamModel);

const _StreamModelContextProvider: FC = ({ children }) => {
  const streamModel = new StreamModel(core.config.streamSourceConfig);
  // re-config when core config change by mobx
  streamModel.config = core.config.streamSourceConfig;
  return (
    <streamModelContext.Provider value={streamModel}>
      {children}
    </streamModelContext.Provider>
  );
};

export const StreamModelContextProvider = observer(_StreamModelContextProvider);
