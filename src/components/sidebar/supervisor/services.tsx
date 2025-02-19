import { RiBillLine } from "react-icons/ri";
import { SidebarOptions } from "../components/option";
import { BiSolidCarMechanic } from "react-icons/bi";
import { PiSealWarning } from "react-icons/pi";

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
  {
    name: "Reclamos",
    url: "/dashboard/services/claims",
    icon: <PiSealWarning />,
    urlStartsWithForActive: true,
  },
];

export default SupervisorServicesSidebarOptions;
