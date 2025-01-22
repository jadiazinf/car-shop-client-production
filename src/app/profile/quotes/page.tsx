import { useContext, useEffect, useState } from "react";
import { usePersistedStore } from "../../../store/store";
import { useQuoteApiServices } from "../../api/quotes";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import DatatableComponent from "../../../components/datatable/component";
import useDatatableAction from "../../../components/datatable/use_action";
import { useNavigate } from "react-router-dom";
import DatesHelpers from "../../../helpers/dates/helper";
import { QuoteHelpers } from "../../../entities/quote/helpers";
import PaginationComponent from "../../../components/datatable/pagination";
import { DatatableColumnsProps } from "../../../components/datatable/types";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Perfil",
    url: "/profile",
  },
  {
    text: "Cotizaciones",
    url: "/profile/quotes",
  },
];

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "company", label: "Compañía" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "status_by_company", label: "Estado de cotización por la compañía" },
  { key: "status_by_client", label: "Estado de cotización por el cliente" },
  { key: "vehicle", label: "Vehículo" },
  { key: "total_cost", label: "Costo de la cotización" },
  { key: "actions", label: "Acciones" },
];

export default function UserQuotesPage() {
  const { token, sessionType } = usePersistedStore().authReducer;

  const [page, setPage] = useState(1);

  const { getQuotesByUserResponse, isGettingQuotes, perform } =
    useQuoteApiServices.getQuotesByUser();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  useEffect(() => {
    perform(sessionType!.user!.id!, token!, page);
  }, [page]);

  useEffect(() => {
    if (datatableAction.action === "view")
      navigate(`/profile/quotes/${datatableAction.id}`);
  }, [datatableAction]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 md:flex-row md:gap-0 md: md:justify-between items-center mb-5">
        <p className="font-inter font-semibold text-2xl">Cotizaciones</p>
      </div>
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        isLoading={isGettingQuotes}
        isRowDataViewable
        actionState={datatableAction}
        setActionState={setDatatableAction}
        onViewAction={(quoteId) => navigate(`/profile/quotes/${quoteId}`)}
        data={
          getQuotesByUserResponse?.data?.data?.map((quote) => ({
            id: quote.id!,
            company: `${quote.service?.company?.name || "Companía xs"}`,
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
          pages={getQuotesByUserResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
