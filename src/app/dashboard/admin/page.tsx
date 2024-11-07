import { FaTools } from "react-icons/fa";
import { MenuButtonComponentProps } from "../../../components/buttons/menu/types";
import BoxIconComponent from "../../../components/icons/component";
import { IconColors } from "../../../components/icons/consts";
import MenuOptionsContainer from "../../../components/buttons/menu/container";
import MenuButtonComponent from "../../../components/buttons/menu/component";
import HeaderBreadcrumbsComponent, { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import { GoTools } from "react-icons/go";

const DASHBOARD_OPTIONS: MenuButtonComponentProps[] = [
  {
    title: "Compañía",
    description: "Ve el estado de las peticiones de registro",
    icon: <BoxIconComponent
            bgColor={IconColors.turquish}
            icon={
              <FaTools className='text-white'/>
            }
          />,
    url: "/dashboard/companies"
  },
  {
    title: "Servicios",
    description: "Gestiona los servicios que ofrece tu empresa",
    icon: <BoxIconComponent
            bgColor={IconColors.beige}
            icon={
              <GoTools className='text-black'/>
            }
          />,
    url: "/dashboard/services"
  }
]

const BreadCrumbsItems:HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/"
  },
  {
    text: "Dashboard",
    url: "/dashboard"
  }
]

function AdminDashboardPage() {

  return (
    <>
      <HeaderBreadcrumbsComponent items={BreadCrumbsItems}/>
      <MenuOptionsContainer>
        {
          DASHBOARD_OPTIONS.map( (element, index) => (
            <MenuButtonComponent
              description={element.description}
              icon={element.icon}
              title={element.title}
              url={element.url}
              key={index.toString()}
            />
          ) )
        }
      </MenuOptionsContainer>
    </>
  )
}

export default AdminDashboardPage;
