import { useLocation } from "react-router-dom";
import SupervisorServicesSidebarOptions from "./services";
import SidebarOption, { SidebarOptions } from "../components/option";
import SupervisorCompaniesSidebarOptions from "./companies";

function SupervisorSidebarComponent() {
  const location = useLocation();

  let options: SidebarOptions[] = [];

  if (location.pathname.startsWith("/dashboard/companies"))
    options = SupervisorCompaniesSidebarOptions;

  if (location.pathname.startsWith("/dashboard/services"))
    options = SupervisorServicesSidebarOptions;

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

export { SupervisorSidebarComponent };
