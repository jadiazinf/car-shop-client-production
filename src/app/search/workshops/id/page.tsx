import { useContext, useEffect, useState } from "react";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import CompanyInfo from "../../../../entities/company/components/info";
import { useCompanyApiServices } from "../../../api/companies";
import { useNavigate, useParams } from "react-router-dom";
import { usePersistedStore } from "../../../../store/store";
import { Button, Spinner } from "@nextui-org/react";
import { StatusCodes } from "http-status-codes";
import CompanyModel from "../../../../entities/company/model";
import ServicePricesComponent from "../../../../entities/service/components/prices/component";
import { AuthStatus } from "../../../../auth/types";
import { ToasterContext } from "../../../../components/toaster/context/context";
import { useUserOrderReviewsApiServices } from "../../../api/user_order_reviews";
import { CompanyRatingsComponent } from "../../../../components/rating/company_ratings";
import PaginationComponent from "../../../../components/datatable/pagination";

const BreadCrumbsItems: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Búsqueda de taller",
    url: "/search/workshops",
  },
  {
    text: "Información de taller",
    url: "/search/workshops",
  },
];

export default function CompanyInfoForClient() {
  const { status } = usePersistedStore().authReducer;

  const navigate = useNavigate();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [page, setPage] = useState<number>(1);

  const {
    perform: getCompany,
    isGettingCompany,
    getCompanyResponse,
  } = useCompanyApiServices.getCompany();

  const {
    getCompanyServicesResponse,
    isGettingCompanyServices,
    perform: performGetCompanyServices,
  } = useCompanyApiServices.getCompanyServices();

  const params = useParams();

  const {
    perform: getCompanyRatings,
    getCompanyRatingsResponse,
    isGettingRatings,
  } = useUserOrderReviewsApiServices.getCompanyRatings();

  useEffect(() => {
    setBreadcrumbs(BreadCrumbsItems);
    getCompany(parseInt(params.id!));
    getCompanyRatings(parseInt(params.id!));
  }, []);

  useEffect(() => {
    if (getCompanyResponse) {
      if (getCompanyResponse.status === StatusCodes.OK) {
        performGetCompanyServices(
          (getCompanyResponse.data! as CompanyModel).id!,
          page
        );
      }
    }
  }, [getCompanyResponse]);

  function handleMakeQuote() {
    if (status === AuthStatus.NOT_AUTHENTICATED) {
      toasterDispatch({
        payload:
          "Para poder pedir presupuesto debe de registrarse o iniciar sesión",
        type: "INFO",
      });
      navigate("/auth");
      return;
    } else {
      navigate(`/search/workshops/${params.id}/new_quote`);
    }
  }

  return (
    <div className="w-full flex justify-center items-center flex-col">
      {isGettingCompany ? (
        <Spinner />
      ) : !getCompanyResponse ? (
        <p>No hay data que mostrar</p>
      ) : getCompanyResponse.status !== StatusCodes.OK ? (
        <p>{(getCompanyResponse.data as { errors: string[] }).errors[0]}</p>
      ) : (
        <>
          <CompanyInfo
            company={getCompanyResponse.data as CompanyModel}
            imagesAreCommingFrom="server"
            showChangeAvatar={false}
            showCharter={false}
          />
          <div className="w-full flex flex-col mt-10">
            <div className="flex items-center mb-5 flex-col gap-2 md:flex-row md:gap-5">
              <p className="font-semibold text-2xl font-inter">
                Servicios que ofrece el taller
              </p>
              {!getCompanyServicesResponse ? null : getCompanyServicesResponse
                  .data?.data.length === 0 ? null : (
                <div>
                  <Button
                    size="md"
                    variant="light"
                    color="primary"
                    onClick={handleMakeQuote}
                  >
                    Pedir presupuesto
                  </Button>
                </div>
              )}
            </div>
            {isGettingCompanyServices ? (
              <Spinner />
            ) : !getCompanyServicesResponse ? null : getCompanyServicesResponse
                .data?.data.length === 0 ? (
              <div className="w-full">
                <p className="text-black text-opacity-70">
                  Esta empresa no está ofreciendo servicios
                </p>
              </div>
            ) : (
              <div className="w-full">
                <div className="w-full flex flex-col gap-3">
                  {getCompanyServicesResponse.data?.data.map(
                    (element, index) => (
                      <div
                        key={index}
                        className="w-full rounded-md border-black border-1.5 p-1.5 border-opacity-20 flex items-center"
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex md:gap-2 items-center flex-col md:flex-row">
                            <p className="font-semibold">{element.name}</p>
                            <p className="text-black text-sm text-opacity-70">{`(${element.category?.name})`}</p>
                          </div>
                          <div className="w-full flex justify-between flex-col md:flex-row mt-2 md:mt-0">
                            <p className="text-black text-opacity-70 text-sm">
                              {element.description}
                            </p>
                            <div className="full flex gap-2 justify-end mt-2 md:mt-0">
                              <p className="text-sm">Costo: </p>
                              <ServicePricesComponent service={element} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-full flex justify-end mt-5">
                  <PaginationComponent
                    page={page}
                    setPage={setPage}
                    pages={getCompanyServicesResponse.data?.total_pages ?? 0}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="w-full mt-2">
            <p className="text-2xl font-semibold font-inter mb-5">
              Calificaciones
            </p>
            {isGettingRatings ? (
              <Spinner />
            ) : !getCompanyRatingsResponse ||
              !getCompanyRatingsResponse.data ? null : (
              <div className="">
                <CompanyRatingsComponent
                  ratings={getCompanyRatingsResponse.data}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
