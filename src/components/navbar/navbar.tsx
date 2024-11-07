import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import LogoComponent from "../logo/component";
import { useNavigate } from "react-router-dom";
import { usePersistedStore } from "../../store/store";
import AuthNavbarSection from "./auth";

function NavbarComponent() {

  const navigate = useNavigate();

  const { authReducer } = usePersistedStore();

  return (
    <Navbar
      isBordered
      maxWidth="full"
      shouldHideOnScroll
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
          <div className='h-full flex justify-center items-center cursor-pointer' onClick={() => navigate("/")}>
            <LogoComponent size="md"/>
          </div>
        </NavbarBrand>
      </NavbarContent>
      <AuthNavbarSection authStatus={authReducer.status} roles={authReducer.sessionType?.roles || null}/>
    </Navbar>
  );
}

export default NavbarComponent;
