import { Pagination, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import useGetAllUserCompaniesRequests, { GetAllUserCompaniesRequestsProps } from "../../../../entities/user_company_request/services/get_all/use_get_all_requests";
import { UserCompanyRequestStatus } from "../../../../entities/user_company_request/types";
import CardRequestComponent from "../../../../entities/user_company_request/components/requests/card_request";
import { useNavigate } from "react-router-dom";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";

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
  },
  {
    text: "Peticiones",
    url: "/dashboard/companies/requests"
  }
]

function CompaniesRequestsSuperadminPage() {

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [ page, setPage ] = useState<number>(1);

  const [ requestStatus, setRequestStatus ] = useState<UserCompanyRequestStatus>(UserCompanyRequestStatus.PENDING);

  const { isGettingAllUsersCompaniesRequestsLoading, payloadState, performGetAllUsersCompaniesRequests } = useGetAllUserCompaniesRequests();

  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS_OPTIONS);
  }, []);

  useEffect(() => {
    performGetAllUsersCompaniesRequests({page_number: page, status: requestStatus});
  }, [requestStatus]);

  function getDataMessageWhenNone() {
    switch (requestStatus) {
      case UserCompanyRequestStatus.APPROVED:
        return "No hay solicitudes aprobadas";
      case UserCompanyRequestStatus.PENDING:
        return "No hay solicitudes por responder";
      case UserCompanyRequestStatus.REJECTED:
        return "No hay solicitudes rechazadas"
    }
  }

  return (
    <div className="w-full flex flex-col justify-center">
      <div className='w-full flex justify-center items-center'>
        <Tabs color="primary" key="status" variant="underlined" aria-label="requests status" onSelectionChange={(value) => setRequestStatus(value as UserCompanyRequestStatus)}>
          <Tab key={UserCompanyRequestStatus.PENDING} title="Pendientes por aprobación"/>
          <Tab key={UserCompanyRequestStatus.APPROVED} title="Aprobadas"/>
          <Tab key={UserCompanyRequestStatus.REJECTED} title="Rechazadas"/>
        </Tabs>
      </div>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10'>
        {
          isGettingAllUsersCompaniesRequestsLoading ?
          <div className='col-span-full my-10'>
            <Spinner />
          </div>
          :
          payloadState === 'not loaded' || !payloadState.payload ? <span>No hay data</span> :
          payloadState.payload.data.length === 0 ?
          <div className='col-span-full text-center flex justify-center items-center my-10'>
            <span>{getDataMessageWhenNone()}</span>
          </div> :
          payloadState.payload.data.map( request => (
            <CardRequestComponent
              user_company_request={request}
              onClick={() => navigate(`/dashboard/companies/requests/${request.id!}`)}
            />
          ))
        }
      </div>
      {
        isGettingAllUsersCompaniesRequestsLoading || payloadState === 'not loaded' ? null :
        <div className='w-full flex justify-center items-center mt-10'>
          <Pagination
            showControls
            total={(payloadState as GetAllUserCompaniesRequestsProps).payload.total_pages}
            color="primary"
            page={page}
            onChange={setPage}
            variant="light"
          />
        </div>
      }
    </div>
  );
}

export default CompaniesRequestsSuperadminPage;
