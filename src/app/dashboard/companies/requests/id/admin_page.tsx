import { useParams } from "react-router-dom";
import { useUsersCompaniesRequestsApiServices } from "../../../../api/users_companies_requests/index";
import { Spinner, Tab, Tabs } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import CompanyInfo from "../../../../../entities/company/components/info";
import UserInfo from "../../../../../entities/user/components/info";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { usePersistedStore } from "../../../../../store/store";
import UserCompanyRequestModel from "../../../../../entities/user_company_request/model";

const HEADER_BREADCRUMBS_OPTIONS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Dashboard",
    url: "/dashboard",
  },
  {
    text: "Compañía",
    url: "/dashboard/companies",
  },
  {
    text: "Solicitudes",
    url: "/dashboard/companies/requests",
  },
  {
    text: "Solicitud",
    url: "/dashboard/companies/requests",
  },
];

function AdminCompanyRequestPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { token } = usePersistedStore().authReducer;

  const params = useParams();

  const {
    getUserCompanyRequestResponse,
    isGettingUserCompanyRequest,
    perform
  } = useUsersCompaniesRequestsApiServices.getUserCompanyRequest();

  const [showOption, setShowOption] = useState<"user" | "company">("user");

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS_OPTIONS);
    perform(parseInt(params.id!), token!);
  }, []);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="mt-5 md:mt-0 flex justify-between w-full">
          <Tabs
            variant="underlined"
            aria-label="Options"
            selectedKey={showOption}
            onSelectionChange={(value) =>
              setShowOption(value as "user" | "company")
            }
          >
            <Tab key="user" title="Ver información de usuario" />
            <Tab key="company" title="Ver información de taller" />
          </Tabs>
        </div>
        <div className="flex flex-col">
          <div className="w-full h-full flex justify-center items-center my-10">
            {isGettingUserCompanyRequest  ? (
              <Spinner />
            ) : (
              !getUserCompanyRequestResponse || !getUserCompanyRequestResponse.data ? <p>Hubo un error</p> :
              <div className="w-full">
                {showOption === "user" ? (
                  <UserInfo user={(getUserCompanyRequestResponse.data as UserCompanyRequestModel).user!} />
                ) : (
                  <CompanyInfo
                    company={(getUserCompanyRequestResponse.data as UserCompanyRequestModel).company!}
                    showChangeAvatar={false}
                    imagesAreCommingFrom="server"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminCompanyRequestPage;
