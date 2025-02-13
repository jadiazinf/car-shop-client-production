import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { usePersistedStore } from "../../../../store/store";
import { useOrderApiServices } from "../../../api/orders";
import { OrderInfoComponent } from "../../../../entities/order/components/info";

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
  {
    text: "Información de cotización",
    url: "/profile/quotes/:id",
  },
];

export default function UserQuoteInfoPage() {
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
      {!getOrderResponse || !getOrderResponse.data ? null : isGettingOrder ? (
        <div className="w-full h-full justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="mt-5">
            <OrderInfoComponent order={getOrderResponse.data} />
          </div>
        </div>
      )}
    </div>
  );
}
