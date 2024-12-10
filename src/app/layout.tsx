import { ReactNode, useContext } from "react";
import NavbarComponent from "../components/navbar/navbar";
import { SidebarComponent } from "../components/sidebar";
import HeaderBreadcrumbsComponent from "../components/breadcrumbs/header";
import BreadcrumbsContext from "../components/breadcrumbs/context";
import { useLocation } from "react-router-dom";

function MainLayout(props: { children: ReactNode }) {
  const { pathname } = useLocation();

  const { breadcrumbs } = useContext(BreadcrumbsContext);

  return (
    <div className="max-w-screen min-h-screen font-inter container m-auto">
      <NavbarComponent />
      {pathname !== "/" && (
        <div className="mt-5">
          <HeaderBreadcrumbsComponent items={breadcrumbs} />
        </div>
      )}
      <div className="w-full h-full flex">
        <SidebarComponent />
        {props.children}
      </div>
    </div>
  );
}

export default MainLayout;
