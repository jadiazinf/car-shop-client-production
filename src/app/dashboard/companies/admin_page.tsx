import { MenuButtonComponentProps } from "../../../components/buttons/menu/types";
import MenuButtonComponent from "../../../components/buttons/menu/component";
import { MdAppRegistration } from "react-icons/md";
import MenuOptionsContainer from "../../../components/buttons/menu/container";
import BoxIconComponent from "../../../components/icons/component";
import { IconColors } from "../../../components/icons/consts";
import HeaderBreadcrumbsComponent, { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";

const COMPANY_OPTIONS: MenuButtonComponentProps[] = [
  {
    title: "Peticiones de registro",
    description: "Ve el estado de las peticiones de registro",
    icon: <BoxIconComponent
            bgColor={IconColors.coolBlack}
            icon={<MdAppRegistration className='text-white'/>}
          />,
    url: "/dashboard/companies/requests"
  }
]

const HEADER_BREADCRUMBS_OPTIONS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/"
  },
  {
    text: "Dashboard",
    url: "/dashboard"
  },
  {
    text: "Compañía",
    url: "/dashboard/companies"
  }
]

function CompaniesAdminPage() {

  return (
    <>
      <HeaderBreadcrumbsComponent items={HEADER_BREADCRUMBS_OPTIONS}/>
      <MenuOptionsContainer>
        {
          COMPANY_OPTIONS.map( (element, index) => (
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

export default CompaniesAdminPage;
