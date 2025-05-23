import { Input, Pagination, Select, SelectItem, Spinner } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCompanyRequestStatus } from "../../../../entities/user_company_request/types";
import CardRequestComponent from "../../../../entities/user_company_request/components/requests/card_request";
import { usePersistedStore } from "../../../../store/store";
import useCanUserMakeRequest from "../../../../entities/user_company_request/services/can_make_request/use_user_can_make_request";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { useUsersCompaniesRequestsApiServices } from "../../../api/users_companies_requests";
import { PaginatedData } from "../../../../helpers/application_response/types";
import UserCompanyRequestModel from "../../../../entities/user_company_request/model";
import { GoShieldCheck } from "react-icons/go";

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
];

function CompaniesRequestsAdminPage() {
  const { authReducer } = usePersistedStore();

  const { token, sessionType } = authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const {
    getCompanyRequestsResponse,
    isGettingRequests,
    perform
  } = useUsersCompaniesRequestsApiServices.getCompanyRequests();

  const { performCanUserMakeRequest } =
    useCanUserMakeRequest();

  const [filters, setFilters] = useState<{status: UserCompanyRequestStatus, page: number}>({
    status: UserCompanyRequestStatus.PENDING,
    page: 1
  });

  const navigate = useNavigate();

  useEffect(() => {
    performCanUserMakeRequest({
      company_id: sessionType!.company_id!,
      token: token!,
      user_id: sessionType!.user.id!,
    });
    setBreadcrumbs(HEADER_BREADCRUMBS_OPTIONS);
  }, []);

  useEffect(() => {
    perform(sessionType!.company_id!, token!, filters);
  }, [filters]);

  function getDataMessageWhenNone() {
    switch (filters.status) {
      case UserCompanyRequestStatus.APPROVED:
        return "No hay solicitudes aprobadas";
      case UserCompanyRequestStatus.PENDING:
        return "No hay solicitudes por responder";
      case UserCompanyRequestStatus.REJECTED:
        return "No hay solicitudes rechazadas";
    }
  }

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="w-full flex flex-col gap-5">
        <p className="font-bold font-inter text-2xl w-full">Solicitudes de registro en la plataforma de la compañia</p>
        <div className="w-full flex justify-end my-5">
          <Select
            className="w-full md:w-96"
            name="status"
            radius="sm"
            size="lg"
            variant="bordered"
            placeholder="Estatus"
            onChange={(e) => setFilters({ ...filters, status: e.target.value as UserCompanyRequestStatus })}
            startContent={<GoShieldCheck className="size-5 text-black text-opacity-50" />}
            value={filters.status}
          >
            <SelectItem key={UserCompanyRequestStatus.PENDING}>Pendientes</SelectItem>
            <SelectItem key={UserCompanyRequestStatus.APPROVED}>Aprobadas</SelectItem>
            <SelectItem key={UserCompanyRequestStatus.REJECTED}>Rechazadas</SelectItem>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
        {isGettingRequests ? (
          <div className="col-span-full flex justify-center items-center h-[50vh]">
            <Spinner size="lg" />
          </div>
        ) : !getCompanyRequestsResponse || !getCompanyRequestsResponse.data ? (
          <span>No hay data</span>
        ) : (getCompanyRequestsResponse.data as PaginatedData<UserCompanyRequestModel>).data.length === 0 ? (
          <div className="col-span-full text-center flex justify-center items-center my-10">
            <span>{getDataMessageWhenNone()}</span>
          </div>
        ) : (
          (getCompanyRequestsResponse.data as PaginatedData<UserCompanyRequestModel>).data.map((request) => (
            <CardRequestComponent
              user_company_request={request}
              onClick={() =>
                navigate(`/dashboard/companies/requests/${request.id!}`)
              }
            />
          ))
        )}
      </div>
      {isGettingRequests ||
      !getCompanyRequestsResponse || !getCompanyRequestsResponse.data ? null : (
        <div className="w-full flex justify-center items-center mt-10">
          <Pagination
            showControls
            total={
              'total_pages' in getCompanyRequestsResponse.data
                ? getCompanyRequestsResponse.data.total_pages
                : 0
            }
            color="primary"
            page={filters.page}
            onChange={(page) => setFilters(prev => ({...prev, page}))}
            variant="light"
          />
        </div>
      )}
    </div>
  );
}

export default CompaniesRequestsAdminPage;
