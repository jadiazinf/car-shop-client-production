import { ReactNode, useState } from "react";
import BrandAndModelContext from "../contexts/brand_and_model";
import { BrandAndModel } from "../types";

function BrandAndModelProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<BrandAndModel | null>(null);

  return (
    <BrandAndModelContext.Provider value={{brandAndModel: state, setBrandAndModel: setState}}>
      { props.children }
    </BrandAndModelContext.Provider>
  );
}

export default BrandAndModelProvider;
