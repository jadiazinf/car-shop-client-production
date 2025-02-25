import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { usePersistedStore } from "../../../../store/store";
import { useOrderApiServices } from "../../../api/orders";
import { UserOrderInfoComponent } from "./components/user_order_info";

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
    text: "Órdenes de servicios",
    url: "/profile/orders",
  },
  {
    text: "Orden de servicio",
    url: "/profile/orders/:id",
  },
];

export default function UserOrderInfoPage() {
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
        <UserOrderInfoComponent order={getOrderResponse.data} />
      )}
    </div>
  );
}
