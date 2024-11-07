import { NavbarOptionsProps } from "./auth";

function SuperadminNavbarOptions():NavbarOptionsProps[] {
  return [
    {
      text: "Dashboard",
      url: "/dashboard"
    }
  ];
}

export default SuperadminNavbarOptions;
