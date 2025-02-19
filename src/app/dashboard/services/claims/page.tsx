import { useContext, useEffect } from "react";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { useUserOrderReviewsApiServices } from "../../../api/user_order_reviews";
import { usePersistedStore } from "../../../../store/store";
import { DatatableColumnsProps } from "../../../../components/datatable/types";
import DatatableComponent from "../../../../components/datatable/component";
import RatingComponent from "../../../../components/rating";
import DatesHelpers from "../../../../helpers/dates/helper";
import useDatatableAction from "../../../../components/datatable/use_action";
import { useNavigate } from "react-router-dom";

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
    text: "Reclamos",
    url: "/dashboard/services/claims",
  },
];

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "rating", label: "Calificación" },
  { key: "message", label: "Mensaje" },
  { key: "asigned_to", label: "Orden asignada a" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "actions", label: "Acciones" },
];

export function ClaimsPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const {
    getCompanyClaimsResponse,
    isGettingCompanyClaims,
    perform: getClaims,
  } = useUserOrderReviewsApiServices.getCompanyClaims();

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
    getClaims(sessionType!.company_id!, token!);
  }, []);

  useEffect(() => {
    if (datatableAction.action === "view") {
      navigate(
        `/dashboard/services/orders/${datatableAction.id}/${
          sessionType!.company_id
        }`
      );
    }
  }, [datatableAction]);

  return (
    <div className="w-full h-full">
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        setActionState={setDatatableAction}
        isRowDataViewable
        data={
          getCompanyClaimsResponse?.data?.data.map((element) => ({
            id: element.order_id,
            rating: <RatingComponent isDisabled rating={element.rating} />,
            message: element.message,
            asigned_to: element.order?.assigned_to
              ? `${element.order.assigned_to.user!.first_name} ${
                  element.order.assigned_to.user!.last_name
                }`
              : "Sin asignar",
            created_at: DatesHelpers.formatFullDate(element.created_at!),
          })) || []
        }
        isLoading={isGettingCompanyClaims}
      />
    </div>
  );
}
