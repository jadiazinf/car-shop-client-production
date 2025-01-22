import { useContext, useEffect, useState } from "react";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import ButtonComponent from "../../../../../components/buttons/component";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { usePersistedStore } from "../../../../../store/store";
import { useQuoteApiServices } from "../../../../api/quotes";
import DatatableComponent from "../../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../../components/datatable/types";
import PaginationComponent from "../../../../../components/datatable/pagination";
import DatesHelpers from "../../../../../helpers/dates/helper";
import useDatatableAction from "../../../../../components/datatable/use_action";
import { QuoteHelpers } from "../../../../../entities/quote/helpers";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Dashboard",
    url: "/dashboard",
  },
  {
    text: "Servicios del taller",
    url: "/dashboard/services",
  },
  {
    text: "Cotizaciones",
    url: "/dashboard/services/quotes",
  },
];

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "client", label: "Cliente" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "status_by_company", label: "Estado de cotización por la compañía" },
  { key: "status_by_client", label: "Estado de cotización por el cliente" },
  { key: "vehicle", label: "Vehículo" },
  { key: "total_cost", label: "Costo de la cotización" },
  { key: "actions", label: "Acciones" },
];

export default function ServicesQuotesPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { getQuotesByCompanyResponse, isGettingQuotes, perform } =
    useQuoteApiServices.getQuotesByCompany();

  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  useEffect(() => {
    perform(sessionType!.company_id!, token!, page);
  }, [page]);

  useEffect(() => {
    if (datatableAction.action === "view")
      navigate(`/dashboard/services/quotes/${datatableAction.id}`);
  }, [datatableAction]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 md:flex-row md:gap-0 md: md:justify-between items-center mb-5">
        <p className="font-inter font-semibold text-2xl">Cotizaciones</p>
        <div className="flex">
          <div className="w-auto">
            <ButtonComponent
              color="primary"
              text="Crear cotización"
              type="button"
              variant="solid"
              startContent={<IoAdd className="w-5 h-5" />}
              onClick={() => navigate("/dashboard/services/quotes/new")}
            />
          </div>
        </div>
      </div>
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        isLoading={isGettingQuotes}
        isRowDataViewable
        actionState={datatableAction}
        setActionState={setDatatableAction}
        onViewAction={(quoteId) =>
          navigate(`/dashboard/services/quotes/${quoteId}`)
        }
        data={
          getQuotesByCompanyResponse?.data?.data?.map((quote) => ({
            id: quote.id!,
            client: `${quote.vehicle?.user?.first_name} ${quote.vehicle?.user?.last_name}`,
            created_at: DatesHelpers.formatFullDate(quote.created_at as string),
            status_by_company: QuoteHelpers.translateQuoteStatus(
              quote.status_by_company
            ),
            status_by_client: QuoteHelpers.translateQuoteStatus(
              quote.status_by_client
            ),
            vehicle: quote.vehicle!.model!.brand!.name,
            total_cost: `${quote.total_cost} REF`,
          })) || []
        }
      />
      <div className="w-full flex justify-end mt-5">
        <PaginationComponent
          page={page}
          pages={getQuotesByCompanyResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
