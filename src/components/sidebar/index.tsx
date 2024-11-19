import { useLocation } from "react-router-dom";
import { AuthStatus } from "../../auth/types";
import { usePersistedStore } from "../../store/store";
import { UserCompanyRole } from "../../entities/users_companies/types";
import { AdminSidebarComponent } from "./admin";
import { SuperadminSidebarComponent } from "./superadmin";
import { ROUTES_FOR_SIDEBAR_RENDERING_CASE } from "./consts";

function SidebarComponent() {

  const { status, sessionType } = usePersistedStore().authReducer;

  const { pathname } = useLocation();

  function urlStartWithSidebarRenderingOption() {
    let conditionForRenderingSidebar = false;

    for (let counter = 0; counter < ROUTES_FOR_SIDEBAR_RENDERING_CASE.length; counter++)
      if (pathname.startsWith(ROUTES_FOR_SIDEBAR_RENDERING_CASE[counter])) {
        conditionForRenderingSidebar = true;
        break;
      }

    return conditionForRenderingSidebar;
  }

  if (status === AuthStatus.NOT_AUTHENTICATED || !urlStartWithSidebarRenderingOption())
    return null;

  let SidebarComponent: JSX.Element = <></>;

  if ( sessionType?.roles?.includes(UserCompanyRole.ADMIN) )
    SidebarComponent = AdminSidebarComponent();

  if ( sessionType?.roles?.includes(UserCompanyRole.SUPERADMIN) )
    SidebarComponent = SuperadminSidebarComponent();

  return (
    <div className='hidden md:block mr-5 w-72'>
      <div className='flex flex-col gap-1'>
        { SidebarComponent }
      </div>
    </div>
  );
}

export { SidebarComponent };
