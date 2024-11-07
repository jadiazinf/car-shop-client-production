import { NavbarOptionsProps } from "./auth";

function AdminNavbarOptions():NavbarOptionsProps[] {
  return [
    {
      text: "Dashboard",
      url: "/dashboard"
    }
  ];
}

export default AdminNavbarOptions;
