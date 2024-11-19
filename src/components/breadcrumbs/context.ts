import { createContext } from "react";
import { HeaderBreadcrumbItemProps } from "./header";

interface IBreadcrumbsContextProps {
  breadcrumbs: HeaderBreadcrumbItemProps[];
  setBreadcrumbs: React.Dispatch<HeaderBreadcrumbItemProps[]>;
};

const BreadcrumbsContext = createContext({} as IBreadcrumbsContextProps);

export default BreadcrumbsContext;
