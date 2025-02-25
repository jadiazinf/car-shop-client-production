import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import { useContext, useEffect } from "react";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import useGetCompany from "../../../entities/company/services/get/use_get_company";
import { usePersistedStore } from "../../../store/store";
import { Spinner } from "@heroui/react";
import CompanyInfo from "../../../entities/company/components/info";

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
];

function CompaniesTechnicianPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  setBreadcrumbs(HEADER_BREADCRUMBS_OPTIONS);

  const { isGettingCompanyLoading, payloadState, performGetCompany } =
    useGetCompany();

  useEffect(() => {
    performGetCompany({ company_id: sessionType?.company_id!, token: token! });
  }, []);

  return (
    <>
      {isGettingCompanyLoading ? (
        <Spinner />
      ) : payloadState === "not loaded" ? null : (
        <CompanyInfo company={payloadState.payload} showChangeAvatar={false} />
      )}
    </>
  );
}

export default CompaniesTechnicianPage;
