import { RiBillLine } from "react-icons/ri";
import { SidebarOptions } from "../components/option";
import { CiBoxList } from "react-icons/ci";
import { BiSolidCarMechanic } from "react-icons/bi";

const AdminServicesSidebarOptions: SidebarOptions[] = [
  {
    name: "Servicios",
    url: "/dashboard/services",
    icon: <CiBoxList />,
    urlStartsWithForActive: false,
  },
  {
    name: "Cotizaciones",
    url: "/dashboard/services/quotes",
    icon: <RiBillLine />,
    urlStartsWithForActive: true,
  },
  {
    name: "Órdenes de servicios",
    url: "/dashboard/services/orders",
    icon: <BiSolidCarMechanic />,
    urlStartsWithForActive: true,
  },
];

export default AdminServicesSidebarOptions;
