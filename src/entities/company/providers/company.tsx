import { ReactNode, useState } from "react";
import CompanyContext from '../contexts/company';
import CompanyModel from "../model";

function CompanyProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<CompanyModel | null>(null);

  return (
    <CompanyContext.Provider value={{company: state, setCompany: setState}}>
      { props.children }
    </CompanyContext.Provider>
  );
}

export default CompanyProvider;
