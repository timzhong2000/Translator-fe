import { PreProcessorModel } from "@/model";
import { createContext, FC, useState } from "react";

export const preProcessorModelContext = createContext({} as PreProcessorModel);

export const PreProcessorModelProvider: FC = ({ children }) => {
  const [preProcessorModel, _] = useState(new PreProcessorModel());
  return (
    <preProcessorModelContext.Provider value={preProcessorModel}>
      {children}
    </preProcessorModelContext.Provider>
  );
};
