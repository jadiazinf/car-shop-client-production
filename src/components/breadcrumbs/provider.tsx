import { ReactNode, useEffect, useState } from "react";
import BreadcrumbsContext from "./context";
import { HeaderBreadcrumbItemProps } from "./header";
import { useLocation } from "react-router-dom";

function BreadcrumbsProvider(props: { children: ReactNode }) {

  const { pathname } = useLocation();

  const [ state, setState ] = useState<HeaderBreadcrumbItemProps[]>([]);

  useEffect(() => {
    if (pathname === "/")
      setState([{text: "Home", url: "/"}]);
  }, [pathname]);

  return (
    <BreadcrumbsContext.Provider value={{breadcrumbs: state, setBreadcrumbs: setState}}>
      { props.children }
    </BreadcrumbsContext.Provider>
  );
}

export default BreadcrumbsProvider;
