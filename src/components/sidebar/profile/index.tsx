import { RiBillLine } from "react-icons/ri";
import SidebarOption, { SidebarOptions } from "../components/option";
import { FaClipboardUser, FaCarRear } from "react-icons/fa6";
import { BiSolidCarMechanic } from "react-icons/bi";
import { FaTools } from "react-icons/fa";

function ProfileSidebarComponent() {
  const options: SidebarOptions[] = [
    {
      name: "Información de usuario",
      icon: <FaClipboardUser />,
      url: "/profile",
      urlStartsWithForActive: false,
    },
    {
      name: "Mis vehículos",
      icon: <FaCarRear />,
      url: "/profile/vehicles",
      urlStartsWithForActive: true,
    },
    {
      name: "Mis cotizaciones",
      icon: <RiBillLine />,
      url: "/profile/quotes",
      urlStartsWithForActive: true,
    },
    {
      name: "Mis órdenes de servicios",
      icon: <BiSolidCarMechanic />,
      url: "/profile/orders",
      urlStartsWithForActive: true,
    },
    {
      name: "Mis talleres",
      icon: <FaTools />,
      url: "/profile/workshops",
      urlStartsWithForActive: true,
    }
  ];

  return (
    <>
      {options.map((element, index) => (
        <SidebarOption
          key={index}
          icon={element.icon}
          name={element.name}
          url={element.url}
        />
      ))}
    </>
  );
}

export { ProfileSidebarComponent };
