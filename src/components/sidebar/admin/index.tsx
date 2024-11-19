import { useLocation } from "react-router-dom";
import AdminCompaniesSidebarOptions from "./companies";
import AdminServicesSidebarOptions from "./services";
import SidebarOption, { SidebarOptions } from "../components/option";

function AdminSidebarComponent() {

  const location = useLocation();

  let options: SidebarOptions[] = [];

  if (location.pathname.startsWith("/dashboard/companies"))
    options = AdminCompaniesSidebarOptions;

  if (location.pathname.startsWith("/dashboard/services"))
    options = AdminServicesSidebarOptions;

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

export { AdminSidebarComponent };
