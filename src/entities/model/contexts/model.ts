import { createContext } from "react";
import ModelModel from "../model";

interface IModelContextProps {
  model: ModelModel | null;
  setModel: React.Dispatch<ModelModel>;
}

const ModelContext = createContext<IModelContextProps>({} as IModelContextProps);

export default ModelContext;
