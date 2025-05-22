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
import PaginationComponent from "../../../components/datatable/pagination";

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
  const [page, setPage] = useState(1);
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
  }, [filtersState, page]);

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
        <div className="md:hidden w-10 mb-4">
          <div
            onClick={onOpen}
            className="border-1.5 border-black border-opacity-30 p-2 rounded-md flex justify-center items-center w-auto hover:bg-gray-100 transition-colors"
          >
            <VscSettings className="w-7 h-7" />
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row">
          <div className="hidden md:block sticky top-20 h-[calc(100vh-5rem)] w-72 pr-5 overflow-y-auto">
            <CompaniesFilterSidebarComponent
              filtersState={filtersState}
              setFiltersChange={setFiltersState}
            />
          </div>

          <div className="flex-1">
            {payloadState === "not loaded" ? null : isGettingCompaniesWithFiltersLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {(payloadState.payload as PaginatedData<CompanyModel>).data.length === 0 ? (
                    <div className="col-span-full py-10">
                      <div className="w-full flex flex-col items-center justify-center text-center">
                        <p className="text-lg font-medium text-gray-600">No se encontraron talleres</p>
                        <p className="text-sm text-gray-500 mt-2">Intenta ajustar tus filtros de búsqueda</p>
                      </div>
                    </div>
                  ) : (
                    (payloadState.payload as PaginatedData<CompanyModel>).data.map((company, index) => (
                      <CompanyCatalogInfoComponent
                        company={company}
                        key={`${company.id}-${index}`}
                        onClick={() => navigate(`/search/workshops/${company.id!}`)}
                      />
                    ))
                  )}
                </div>

                <div className="w-full flex justify-center items-center mt-8 pb-8">
                  <PaginationComponent
                    page={page}
                    pages={(payloadState.payload as PaginatedData<CompanyModel>).total_pages}
                    setPage={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PlaceProvider>
  );
}

export default SearchWorkshopsPage;
