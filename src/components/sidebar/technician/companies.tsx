import { SidebarOptions } from "../components/option";
import { IoDocumentTextOutline } from "react-icons/io5";

const TechnicianCompaniesSidebarOptions: SidebarOptions[] = [
  {
    name: "Información",
    url: "/dashboard/companies",
    icon: <IoDocumentTextOutline />,
    urlStartsWithForActive: false,
  },
];

export default TechnicianCompaniesSidebarOptions;
