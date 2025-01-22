import { RiBillLine } from "react-icons/ri";
import { SidebarOptions } from "../components/option";
import { CiBoxList } from "react-icons/ci";

const AdminServicesSidebarOptions: SidebarOptions[] = [
  {
    name: "Servicios",
    url: "/dashboard/services",
    icon: <CiBoxList />,
    urlStartsWithForActive: false,
  },
  {
    name: "Cotizaciones realizadas",
    url: "/dashboard/services/quotes",
    icon: <RiBillLine />,
    urlStartsWithForActive: true,
  },
];

export default AdminServicesSidebarOptions;
