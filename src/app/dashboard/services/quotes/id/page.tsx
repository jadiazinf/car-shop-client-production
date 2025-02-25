import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import { usePersistedStore } from "../../../../../store/store";
import { useOrderApiServices } from "../../../../api/orders";
import { Spinner } from "@heroui/react";
import { CompanyOrderInfoComponent } from "../../../../../entities/order/components/company_info";

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
  {
    text: "Información de cotización",
    url: "/dashboard/services/quotes/:id",
  },
];

export default function QuoteInfoPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { id, company_id } = useParams();

  const { token } = usePersistedStore().authReducer;

  const { getOrderResponse, isGettingOrder, perform } =
    useOrderApiServices.getOrder();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
    perform(parseInt(id!), parseInt(company_id!), token!);
  }, []);

  return (
    <div className="w-full h-full">
      {isGettingOrder ? (
        <Spinner />
      ) : !getOrderResponse || !getOrderResponse.data ? null : (
        <CompanyOrderInfoComponent order={getOrderResponse.data} />
      )}
    </div>
  );
}
