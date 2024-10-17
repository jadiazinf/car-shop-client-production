import { ReactNode, useState } from "react";
import ModelContext from "../contexts/model";
import ModelModel from "../model";

function ModelProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<ModelModel | null>(null);

  return (
    <ModelContext.Provider value={{model: state, setModel: setState}}>
      { props.children }
    </ModelContext.Provider>
  );
}

export default ModelProvider;
