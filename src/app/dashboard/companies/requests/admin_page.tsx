import { Pagination, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCompanyRequestStatus } from "../../../../entities/user_company_request/types";
import { GetAllUserCompaniesRequestsProps } from "../../../../entities/user_company_request/services/get_all/use_get_all_requests";
import CardRequestComponent from "../../../../entities/user_company_request/components/requests/card_request";
import useGetUserCompanyRequestsByCompany from "../../../../entities/user_company_request/services/get_all/by_company/use_get_by_company";
import { usePersistedStore } from "../../../../store/store";
import useCanUserMakeRequest from "../../../../entities/user_company_request/services/can_make_request/use_user_can_make_request";
import ButtonComponent from "../../../../components/buttons/component";
import { IoMdAdd } from "react-icons/io";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";

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

function CompaniesRequestsAdminPage() {
  const { authReducer } = usePersistedStore();

  const { token, sessionType } = authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [page, setPage] = useState<number>(1);

  const [requestStatus, setRequestStatus] = useState<UserCompanyRequestStatus>(
    UserCompanyRequestStatus.PENDING
  );

  const {
    isGettingUserCompanyRequestsByCompanyLoading,
    payloadState,
    performGetUserCompanyRequestsByCompany,
  } = useGetUserCompanyRequestsByCompany();

  const { payloadState: requestPermission, performCanUserMakeRequest } =
    useCanUserMakeRequest();

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
    performGetUserCompanyRequestsByCompany({
      page_number: page,
      status: requestStatus,
      company_id: sessionType!.company_id!,
      token: token!,
    });
  }, [requestStatus]);

  return (
    <div className="flex flex-col justify-center w-full h-full">
      <div className="w-full flex justify-center items-center">
        <Tabs
          color="primary"
          key="status"
          variant="underlined"
          aria-label="requests status"
          onSelectionChange={(value) =>
            setRequestStatus(value as UserCompanyRequestStatus)
          }
        >
          <Tab
            key={UserCompanyRequestStatus.PENDING}
            title="Pendientes por aprobación"
          />
          <Tab key={UserCompanyRequestStatus.APPROVED} title="Aprobadas" />
          <Tab key={UserCompanyRequestStatus.REJECTED} title="Rechazadas" />
        </Tabs>
      </div>
      <div className="w-full flex justify-end">
        {requestPermission !== "not loaded" && requestPermission.payload && (
          <div>
            <ButtonComponent
              color="primary"
              text="Crear nueva solicitud"
              type="button"
              variant="solid"
              startContent={<IoMdAdd className="w-5 h-5" />}
              onClick={() =>
                navigate(`/dashboard/companies/requests/request/update`)
              }
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {isGettingUserCompanyRequestsByCompanyLoading ? (
          <div className="col-span-full my-10">
            <Spinner />
          </div>
        ) : payloadState === "not loaded" || !payloadState.payload ? (
          <span>No hay data</span>
        ) : payloadState.payload.data.length === 0 ? (
          <div className="col-span-full text-center flex justify-center items-center my-10">
            <span>No hay solicitudes</span>
          </div>
        ) : (
          payloadState.payload.data.map((request) => (
            <CardRequestComponent
              user_company_request={request}
              onClick={() =>
                navigate(`/dashboard/companies/requests/${request.id!}`)
              }
            />
          ))
        )}
      </div>
      {isGettingUserCompanyRequestsByCompanyLoading ||
      payloadState === "not loaded" ? null : (
        <div className="w-full flex justify-center items-center mt-10">
          <Pagination
            showControls
            total={
              (payloadState as GetAllUserCompaniesRequestsProps).payload
                .total_pages
            }
            color="primary"
            page={page}
            onChange={setPage}
            variant="light"
          />
        </div>
      )}
    </div>
  );
}

export default CompaniesRequestsAdminPage;
