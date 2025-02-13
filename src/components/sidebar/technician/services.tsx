import { SidebarOptions } from "../components/option";
import { BiSolidCarMechanic } from "react-icons/bi";

const TechnicianServicesSidebarOptions: SidebarOptions[] = [
  {
    name: "Órdenes de servicios",
    url: "/dashboard/services/orders",
    icon: <BiSolidCarMechanic />,
    urlStartsWithForActive: true,
  },
];

export default TechnicianServicesSidebarOptions;
