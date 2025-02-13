import { useLocation } from "react-router-dom";
import TechnicianServicesSidebarOptions from "./services";
import SidebarOption, { SidebarOptions } from "../components/option";
import TechnicianCompaniesSidebarOptions from "./companies";

function TechnicianSidebarComponent() {
  const location = useLocation();

  let options: SidebarOptions[] = [];

  if (location.pathname.startsWith("/dashboard/companies"))
    options = TechnicianCompaniesSidebarOptions;

  if (location.pathname.startsWith("/dashboard/services"))
    options = TechnicianServicesSidebarOptions;

  return (
    <>
      {options.map((element, index) => (
        <SidebarOption
          key={index}
          icon={element.icon}
          name={element.name}
          url={element.url}
        />
      ))}
    </>
  );
}

export { TechnicianSidebarComponent };
