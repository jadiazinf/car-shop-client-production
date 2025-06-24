import { useContext, useEffect } from "react";
import MenuContext from "./context";
import LogoComponent from "../logo/component";
import { Button } from "@heroui/react";
import { TfiClose } from "react-icons/tfi";
import { usePersistedStore } from "../../store/store";
import { AuthStatus } from "../../auth/types";
import { UserCompanyRole } from "../../entities/users_companies/types";
import AdminMenuOptions from "./admin";
import SuperadminMenuOptions from "./superadmin";

function MenuComponent() {
  const { status, sessionType } = usePersistedStore().authReducer;
  const { isMenuOpenState, toggleMenu, closeMenu } = useContext(MenuContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    };

    const disableScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    const enableScroll = () => {
      document.body.style.overflow = 'auto';
    };

    window.addEventListener("resize", handleResize);

    if (isMenuOpenState) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      enableScroll();
    };
  }, [isMenuOpenState, closeMenu]);

  if (status === AuthStatus.NOT_AUTHENTICATED)
    return null;

  let options: JSX.Element | null = null;

  if (sessionType?.roles?.includes(UserCompanyRole.ADMIN))
    options = <AdminMenuOptions />

  if (sessionType?.roles?.includes(UserCompanyRole.SUPERADMIN))
    options = <SuperadminMenuOptions />

  return (
    <div className="relative sm:hidden">
      <button onClick={toggleMenu} className="p-2 text-gray-800 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {isMenuOpenState && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 w-screen h-screen"
          onClick={closeMenu}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-screen w-2/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpenState ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <LogoComponent />
            <Button isIconOnly aria-label="Close" className='bg-white' onPress={closeMenu}>
              <TfiClose />
            </Button>
          </div>
          <div className='mt-5'>
            { options }
          </div>
        </div>
      </div>
    </div>
  );
};

export { MenuComponent };
