import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ServicesFilters } from "../../../entities/company/components/filters/types";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import PlaceProvider from "../../../entities/location/providers/place";
import useCompaniesFilterSearchService from "../../../entities/company/services/filters_search/use_service";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import CompanyModel from "../../../entities/company/model";
import { PaginatedData } from "../../../helpers/application_response/types";
import CompanyCatalogInfoComponent from "../../../entities/company/components/catalog_info";
import { VscSettings } from "react-icons/vsc";
import CompaniesFiltersComponent from "../../../entities/company/components/filters";
import CompaniesFilterSidebarComponent from "../../../entities/company/components/filters/sidebar";

const BreadCrumbsItems: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Búsqueda de taller",
    url: "/search/workshops",
  },
];

function SearchWorkshopsPage() {
  const [searchParams] = useSearchParams();

  const [filtersState, setFiltersState] = useState<ServicesFilters>({});

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const [page, _] = useState(1);

  const navigate = useNavigate();

  const {
    isGettingCompaniesWithFiltersLoading,
    payloadState,
    performGetCompanyWithFilters,
  } = useCompaniesFilterSearchService();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  useEffect(() => {
    setBreadcrumbs(BreadCrumbsItems);
    const location_id = searchParams.get("location_id");
    setFiltersState({
      category_ids: null,
      location_id: location_id ? parseInt(location_id) : null,
      service_name: null,
      company_name: null,
    });
  }, []);

  useEffect(() => {
    if (Object.keys(filtersState).length > 0) {
      const location_id = searchParams.get("location_id");
      performGetCompanyWithFilters({
        page,
        filters: {
          ...filtersState,
          location_id: location_id ? parseInt(location_id) : null,
        },
      });
    }
  }, [filtersState]);

  return (
    <PlaceProvider>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="p-5 h-4/5 overflow-y-auto"
      >
        <ModalBody>
          <ModalContent>
            <CompaniesFiltersComponent
              filtersState={filtersState}
              setFiltersChange={setFiltersState}
            />
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="flex flex-col w-full">
        <div className="md:hidden w-10">
          <div
            onClick={onOpen}
            className="border-1.5 border-black border-opacity-30 p-2 rounded-md flex justify-center items-center w-auto"
          >
            <VscSettings className="w-7 h-7" />
          </div>
        </div>
        <div className="w-full mt-5 flex">
          <div className="hidden md:block">
            <CompaniesFilterSidebarComponent
              filtersState={filtersState}
              setFiltersChange={setFiltersState}
            />
          </div>
          {payloadState ===
          "not loaded" ? null : isGettingCompaniesWithFiltersLoading ? (
            <Spinner />
          ) : (
            <div className="w-full">
              <div className="w-full md:ml-5 grid grid-cols-1 lg:grid-cols-4 gap-10">
                {(payloadState.payload as PaginatedData<CompanyModel>).data
                  .length === 0 ? (
                  <div className="col-span-full">
                    <div className="w-full flex justify-center items-center">
                      <p>No se encontraron talleres</p>
                    </div>
                  </div>
                ) : (
                  (
                    payloadState.payload as PaginatedData<CompanyModel>
                  ).data.map((company, index) => (
                    <CompanyCatalogInfoComponent
                      company={company}
                      key={index}
                      onClick={() =>
                        navigate(`/search/workshops/${company.id!}`)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PlaceProvider>
  );
}

export default SearchWorkshopsPage;
