import { MdCategory } from "react-icons/md";
import { MenuOptionsProps } from "./types";
import { FaTools } from 'react-icons/fa';
import { IoIosApps } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";

const SuperadminMenuOptions: MenuOptionsProps[] = [
  {
    name: 'Compañía',
    icon: <FaTools />,
    children: [
      {
        name: 'Información de compañía',
        icon: <IoDocumentTextOutline />,
        url: '/dashboard/companies',
      },
      {
        name: 'Peticiones',
        icon: <IoIosApps />,
        url: '/dashboard/requests'
      }
    ]
  },
  {
    name: 'Categorías',
    icon: <MdCategory />,
    url: '/dashboard/categories'
  }
];

export default SuperadminMenuOptions;
