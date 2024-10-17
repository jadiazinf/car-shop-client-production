import { createContext } from "react";
import { BrandAndModel } from "../types";

interface IBrandAndModelContextProps {
  brandAndModel: BrandAndModel | null;
  setBrandAndModel: React.Dispatch<BrandAndModel>;
}

const BrandAndModelContext = createContext({} as IBrandAndModelContextProps);

export default BrandAndModelContext;
