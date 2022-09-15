import { StreamModel } from "@/model";
import { createContext, FC } from "react";
import { observer } from "mobx-react-lite";
import { useConfig } from "./hook";

export const streamModelContext = createContext({} as StreamModel);

const _StreamModelContextProvider: FC = ({ children }) => {
  const { streamSourceConfig } = useConfig();
  const streamModel = new StreamModel(streamSourceConfig);
  return (
    <streamModelContext.Provider value={streamModel}>
      {children}
    </streamModelContext.Provider>
  );
};

export const StreamModelContextProvider = observer(_StreamModelContextProvider);
