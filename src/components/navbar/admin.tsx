import { NavbarItem } from "@nextui-org/react";
import { Link } from "react-router-dom";

function AdminNavbarOptions():JSX.Element {
  return (
    <NavbarItem>
      <Link color="foreground" to="/dashboard/companies/requests">
        Dashboard
      </Link>
    </NavbarItem>
  );
}

export default AdminNavbarOptions;
