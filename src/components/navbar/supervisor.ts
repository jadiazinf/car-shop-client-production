import { NavbarOptionsProps } from "./auth";

function SupervisorNavbarOptions(): NavbarOptionsProps[] {
  return [
    {
      text: "Dashboard",
      url: "/dashboard",
    },
  ];
}

export default SupervisorNavbarOptions;
