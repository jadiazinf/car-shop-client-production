import { ReactNode, useState } from "react";
import BrandContext from "../contexts/brand";
import BrandModel from "../model";

function BrandProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<BrandModel | null>(null);

  return (
    <BrandContext.Provider value={{brand: state, setBrand: setState}}>
      { props.children }
    </BrandContext.Provider>
  );
}

export default BrandProvider;
