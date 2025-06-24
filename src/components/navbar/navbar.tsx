import { Link, Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import LogoComponent from "../logo/component";
import { useNavigate } from "react-router-dom";
import { usePersistedStore } from "../../store/store";
import AuthNavbarSection from "./auth";
import { MenuComponent } from "../menu";

function NavbarComponent() {
  const navigate = useNavigate();

  const { authReducer } = usePersistedStore();

  return (
    <Navbar
      isBordered
      maxWidth="full"
      // shouldHideOnScroll
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent>
        <NavbarBrand>
          <MenuComponent />
          <div
            className="h-full flex justify-center items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <LogoComponent size="md" />
          </div>
        </NavbarBrand>
      </NavbarContent>
      <AuthNavbarSection
        authStatus={authReducer.status}
        roles={authReducer.sessionType?.roles || null}
      />
      {/* <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>

            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </Navbar>
  );
}

export default NavbarComponent;
