import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import LogoComponent from "../logo/component";
import { useNavigate } from "react-router-dom";
import { usePersistedStore } from "../../store/store";
import AuthNavbarSection from "./auth";

function NavbarComponent() {

  const navigate = useNavigate();

  const { authReducer } = usePersistedStore();

  return (
    <Navbar isBordered maxWidth="full" shouldHideOnScroll>
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
