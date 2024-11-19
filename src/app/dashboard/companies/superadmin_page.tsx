import { useContext, useEffect } from "react";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import useGetCompany from "../../../entities/company/services/get/use_get_company";
import { usePersistedStore } from "../../../store/store";
import { Spinner } from '@nextui-org/react';
import CompanyInfo from "../../../entities/company/components/info";

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
];

function CompaniesSuperadminPage() {

  const { sessionType, token } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { isGettingCompanyLoading, payloadState, performGetCompany } = useGetCompany();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS_OPTIONS);
    performGetCompany({company_id: sessionType!.company_id!, token: token!});
  }, []);

  return (
    <>
      {
        isGettingCompanyLoading ? <Spinner /> :
        payloadState === "not loaded" ? null :
        <CompanyInfo company={payloadState.payload} />
      }
    </>
  )
}

export default CompaniesSuperadminPage;
