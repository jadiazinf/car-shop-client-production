import { useLocation } from "react-router-dom";
import SuperadminCompaniesSidebarOptions from "./companies";
import SuperadminCategoriesSidebarOptions from "./categories";
import SidebarOption, { SidebarOptions } from "../components/option";

function SuperadminSidebarComponent() {

  const location = useLocation();

  let options: SidebarOptions[] = [];

  if (location.pathname.startsWith("/dashboard/companies"))
    options = SuperadminCompaniesSidebarOptions;

  if (location.pathname.startsWith("/dashboard/categories"))
    options = SuperadminCategoriesSidebarOptions;

  return (
    <>
      {
        options.map( (element, index) => (
          <SidebarOption
            key={index}
            icon={element.icon}
            name={element.name}
            url={element.url}
          />
        ))
      }
    </>
  );

}

export { SuperadminSidebarComponent };
