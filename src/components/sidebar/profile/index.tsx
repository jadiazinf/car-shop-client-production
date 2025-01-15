import SidebarOption, { SidebarOptions } from "../components/option";
import { FaClipboardUser, FaCarRear } from "react-icons/fa6";

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
