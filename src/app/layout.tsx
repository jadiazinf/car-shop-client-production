import { ReactNode, useContext } from "react";
import NavbarComponent from "../components/navbar/navbar";
import { SidebarComponent } from "../components/sidebar";
import HeaderBreadcrumbsComponent from "../components/breadcrumbs/header";
import BreadcrumbsContext from "../components/breadcrumbs/context";
import { useLocation } from "react-router-dom";
import { Footer } from "../components/footer/component";

function MainLayout(props: { children: ReactNode }) {
  const { pathname } = useLocation();

  const { breadcrumbs } = useContext(BreadcrumbsContext);

  return (
    <div>
      <div className="max-w-screen min-h-screen font-inter container m-auto mb-20">
        <NavbarComponent />
        <div className="w-full h-full px-5">
          {pathname !== "/" && (
            <div className="mt-5">
              <HeaderBreadcrumbsComponent items={breadcrumbs} />
            </div>
          )}
          <div className="w-full h-full flex my-5">
            <SidebarComponent />
            {props.children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
