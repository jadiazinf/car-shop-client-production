import { SidebarOptions } from "../components/option";
import { CiBoxList } from "react-icons/ci";

const AdminServicesSidebarOptions: SidebarOptions[] = [
  {
    name: "Servicios",
    url: "/dashboard/services",
    icon: <CiBoxList />,
    urlStartsWithForActive: false,
  },
];

export default AdminServicesSidebarOptions;
