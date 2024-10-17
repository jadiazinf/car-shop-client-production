import { createContext } from "react";
import CompanyModel from "../model";

interface ICompanyContextProps {
  company: CompanyModel | null;
  setCompany: React.Dispatch<CompanyModel>;
}

const CompanyContext = createContext({} as ICompanyContextProps);

export default CompanyContext;
