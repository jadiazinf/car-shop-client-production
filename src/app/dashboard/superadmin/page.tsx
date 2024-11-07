import { FaTools } from "react-icons/fa";
import { MenuButtonComponentProps } from "../../../components/buttons/menu/types";
import BoxIconComponent from "../../../components/icons/component";
import { IconColors } from "../../../components/icons/consts";
import MenuOptionsContainer from "../../../components/buttons/menu/container";
import MenuButtonComponent from "../../../components/buttons/menu/component";
import HeaderBreadcrumbsComponent, { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import { MdCategory } from "react-icons/md";

const DASHBOARD_OPTIONS: MenuButtonComponentProps[] = [
  {
    title: "Compañía",
    description: "Ve el estado de las peticiones de registro",
    icon: <BoxIconComponent
            bgColor={IconColors.blue}
            icon={
              <FaTools className='text-white'/>
            }
          />,
    url: "/dashboard/companies"
  },
  {
    title: "Categoria de servicios",
    description: "Gestiona las categorias para los servicios ofrecidos dentro de la plataforma",
    icon: <BoxIconComponent
            bgColor={IconColors.pruple}
            icon={
              <MdCategory className='text-white'/>
            }
          />,
    url: "/dashboard/categories"
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

function SuperadminDashboardPage() {

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

export default SuperadminDashboardPage;
