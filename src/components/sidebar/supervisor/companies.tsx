import { HiOutlineUserGroup } from "react-icons/hi2";
import { SidebarOptions } from "../components/option";
import { IoDocumentTextOutline } from "react-icons/io5";

const SupervisorCompaniesSidebarOptions: SidebarOptions[] = [
  {
    name: "Información",
    url: "/dashboard/companies",
    icon: <IoDocumentTextOutline />,
    urlStartsWithForActive: false,
  },
  {
    name: "Miembros",
    url: "/dashboard/companies/members",
    icon: <HiOutlineUserGroup />,
    urlStartsWithForActive: true,
  },
];

export default SupervisorCompaniesSidebarOptions;
