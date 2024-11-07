import { MenuButtonComponentProps } from "../../../components/buttons/menu/types";
import MenuButtonComponent from "../../../components/buttons/menu/component";
import { MdAppRegistration } from "react-icons/md";
import { IconColors } from "../../../components/icons/consts";
import BoxIconComponent from "../../../components/icons/component";
import MenuOptionsContainer from "../../../components/buttons/menu/container";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const COMPANY_OPTIONS: MenuButtonComponentProps[] = [
  {
    title: "Peticiones de registro",
    description: "Gestiona el estado de las peticiones de registro",
    icon: <BoxIconComponent
            bgColor={IconColors.turquish}
            icon={
              <MdAppRegistration className='text-white'/>
            }
          />,
    url: "/dashboard/companies/requests"
  }
]

function CompaniesSuperadminPage() {

  const navigate = useNavigate();

  return (
    <>
      <div>
        <Breadcrumbs underline="active" onAction={(key) => navigate(key as string)}>
          <BreadcrumbItem key="/">
            Home
          </BreadcrumbItem>
          <BreadcrumbItem key="/dashboard">
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbItem key="/dashboard/companies" isCurrent>
            Compañía
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
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

export default CompaniesSuperadminPage;
