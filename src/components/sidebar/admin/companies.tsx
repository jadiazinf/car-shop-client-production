import { MdAppRegistration } from "react-icons/md";
import { SidebarOptions } from "../components/option";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi2";

const AdminCompaniesSidebarOptions: SidebarOptions[] = [
  {
    name: "Información",
    url: "/dashboard/companies",
    icon: <IoDocumentTextOutline />,
    urlStartsWithForActive: false,
  },
  {
    name: "Solicitudes",
    url: "/dashboard/companies/requests",
    icon: <MdAppRegistration />,
    urlStartsWithForActive: true,
  },
  {
    name: "Miembros",
    url: "/dashboard/companies/members",
    icon: <HiOutlineUserGroup />,
    urlStartsWithForActive: true,
  },
];

export default AdminCompaniesSidebarOptions;
