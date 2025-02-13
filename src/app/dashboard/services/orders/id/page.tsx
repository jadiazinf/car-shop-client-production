import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import { usePersistedStore } from "../../../../../store/store";
import { useOrderApiServices } from "../../../../api/orders";
import { Spinner } from "@nextui-org/react";
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
    text: "Órdenes de servicio",
    url: "/dashboard/services/orders",
  },
  {
    text: "Información de orden de servicio",
    url: "/dashboard/services/orders/:id",
  },
];

export default function OrderInfoPage() {
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
        <CompanyOrderInfoComponent
          order={getOrderResponse.data}
          order_id={Number(id)}
        />
      )}
    </div>
  );
}
