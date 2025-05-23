import { Input, Pagination, Select, SelectItem, Spinner } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { UserCompanyRequestStatus } from "../../../../entities/user_company_request/types";
import CardRequestComponent from "../../../../entities/user_company_request/components/requests/card_request";
import { useNavigate } from "react-router-dom";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { MdOutlineSearch } from "react-icons/md";
import { BsCardList } from "react-icons/bs";
import { GoShieldCheck } from "react-icons/go";
import { useUsersCompaniesRequestsApiServices } from '../../../api/users_companies_requests/index';
import { usePersistedStore } from "../../../../store/store";
import UserCompanyRequestModel from "../../../../entities/user_company_request/model";
import { PaginatedData } from '../../../../helpers/application_response/types';

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
    text: "Peticiones",
    url: "/dashboard/companies/requests",
  },
];

function CompaniesRequestsSuperadminPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { token, sessionType } = usePersistedStore().authReducer;

  const [filters, setFilters] = useState<{name: string, rif: string, status: UserCompanyRequestStatus, page: number}>({
    name: "",
    rif: "",
    status: UserCompanyRequestStatus.PENDING,
    page: 1
  });

  const { getAllUserCompanyRequestResponse, isGettingRequests, perform } = useUsersCompaniesRequestsApiServices.getAllUserCompanyRequest();

  const navigate = useNavigate();

  useEffect(() => {
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
      <p className="font-bold font-inter text-2xl">Solicitudes de registro en la plataforma de compañias</p>
      <div className="w-full flex flex-col gap-5 lg:flex-row items-center lg:gap-10 my-5">
        <Input
          size="lg"
          name="name"
          variant="bordered"
          radius="sm"
          placeholder="Nombre"
          startContent={<MdOutlineSearch />}
          onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))}
          value={filters.name}
        />
        <Input
          size="lg"
          name="rif"
          variant="bordered"
          radius="sm"
          placeholder="RIF"
          startContent={<BsCardList />}
          onChange={(e) => setFilters(prev => ({...prev, rif: e.target.value}))}
          value={filters.rif}
        />
        <Select
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
        {isGettingRequests ? (
          <div className="col-span-full flex justify-center items-center h-[50vh]">
            <Spinner size="lg" />
          </div>
        ) : !getAllUserCompanyRequestResponse || !getAllUserCompanyRequestResponse.data ? (
          <span>No hay data</span>
        ) : (getAllUserCompanyRequestResponse.data as PaginatedData<UserCompanyRequestModel>).data.length === 0 ? (
          <div className="col-span-full text-center flex justify-center items-center my-10">
            <span>{getDataMessageWhenNone()}</span>
          </div>
        ) : (
          (getAllUserCompanyRequestResponse.data as PaginatedData<UserCompanyRequestModel>).data.map((request) => (
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
      !getAllUserCompanyRequestResponse || !getAllUserCompanyRequestResponse.data ? null : (
        <div className="w-full flex justify-center items-center mt-10">
          <Pagination
            showControls
            total={
              'total_pages' in getAllUserCompanyRequestResponse.data
                ? getAllUserCompanyRequestResponse.data.total_pages
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

export default CompaniesRequestsSuperadminPage;
