import { createContext } from "react";
import BrandModel from "../model";

interface IBrandContextProps {
  brand: BrandModel | null;
  setBrand: React.Dispatch<BrandModel>;
}

const BrandContext = createContext<IBrandContextProps>({} as IBrandContextProps);

export default BrandContext;
