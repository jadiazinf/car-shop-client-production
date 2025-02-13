import { RiBillLine } from "react-icons/ri";
import { SidebarOptions } from "../components/option";
import { BiSolidCarMechanic } from "react-icons/bi";

const SupervisorServicesSidebarOptions: SidebarOptions[] = [
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

export default SupervisorServicesSidebarOptions;
