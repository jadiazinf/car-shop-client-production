import { FaTools } from "react-icons/fa";
import { MenuButtonComponentProps } from "../../../components/buttons/menu/types";
import BoxIconComponent from "../../../components/icons/component";
import { IconColors } from "../../../components/icons/consts";
import MenuOptionsContainer from "../../../components/buttons/menu/container";
import MenuButtonComponent from "../../../components/buttons/menu/component";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import { GoTools } from "react-icons/go";
import { useContext, useEffect } from "react";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import { UserCompanyHelpers } from "../../../entities/users_companies/helpers";
import { usePersistedStore } from "../../../store/store";

const DASHBOARD_OPTIONS: MenuButtonComponentProps[] = [
  {
    title: "Compañía",
    description: "Ve el estado de las peticiones de registro",
    icon: (
      <BoxIconComponent
        bgColor={IconColors.turquish}
        icon={<FaTools className="text-white" />}
      />
    ),
    url: "/dashboard/companies",
  },
  {
    title: "Servicios",
    description: "Gestiona los servicios que ofrece tu empresa",
    icon: (
      <BoxIconComponent
        bgColor={IconColors.beige}
        icon={<GoTools className="text-black" />}
      />
    ),
    url: "/dashboard/services",
  },
];

const BreadCrumbsItems: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Dashboard",
    url: "/dashboard",
  },
];

function AdminDashboardPage() {
  const { sessionType } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  useEffect(() => {
    setBreadcrumbs(BreadCrumbsItems);
  }, []);

  return (
    <div>
      <p className="mb-5 font-semibold text-sm">{`Rol: ${UserCompanyHelpers.translateUserCompanyRole(
        UserCompanyHelpers.getRoleWithGreaterHierarchy(sessionType?.roles!)
      )}`}</p>
      <MenuOptionsContainer>
        {DASHBOARD_OPTIONS.map((element, index) => (
          <MenuButtonComponent
            description={element.description}
            icon={element.icon}
            title={element.title}
            url={element.url}
            key={index.toString()}
          />
        ))}
      </MenuOptionsContainer>
    </div>
  );
}

export default AdminDashboardPage;
