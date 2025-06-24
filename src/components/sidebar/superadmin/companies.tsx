import { SidebarOptions } from "../components/option";

const SuperadminCompaniesSidebarOptions: SidebarOptions[] = [
  {
    name: "Perfil de compañía",
    url: "/dashboard/companies",
    urlStartsWithForActive: false,
    icon: <div></div>
  },
  {
    name: "Peticiones",
    url: "/dashboard/companies/requests",
    urlStartsWithForActive: false,
    icon: <div></div>
  }
];

export default SuperadminCompaniesSidebarOptions;
