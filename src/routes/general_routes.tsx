import { Navigate, Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import SearchWorkshopsPage from "../app/search/workshops/page";
import UserSessionPage from "../app/user-session";
import ProfilePage from "../app/profile/page";
import ProfileVehiclesPage from "../app/profile/vehicles/page";
import VehicleInfoPage from "../app/profile/vehicles/info/page";
import CreateVehicle from "../app/profile/vehicles/create/page";
import CompanyInfoForClient from "../app/search/workshops/id/page";
import UserQuotesPage from "../app/profile/quotes/page";
import UserQuoteInfoPage from "../app/profile/quotes/id/page";
import NewQuotePage from "../app/search/workshops/id/new_quote/page";
import { UserOrdersPage } from "../app/profile/orders/page";
import UserOrderInfoPage from "../app/profile/orders/id/page";
import { UserServiceOrderAdvance } from "../app/profile/orders/advances/service_order_id/page";

const generalRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />

    {/* user session */}
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/user-session" element={<UserSessionPage />} />

    {/* sarch */}
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/search/workshops/:id" element={<CompanyInfoForClient />} />
    <Route path="/search/workshops/:id/new_quote" element={<NewQuotePage />} />

    {/* profile */}
    <Route path="/profile" element={<ProfilePage />} />

    {/* profile quotes */}
    <Route path="/profile/quotes" element={<UserQuotesPage />} />
    <Route
      path="/profile/quotes/:id/:company_id"
      element={<UserQuoteInfoPage />}
    />

    {/* profile orders */}
    <Route path="/profile/orders" element={<UserOrdersPage />} />
    <Route
      path="/profile/orders/:id/:company_id"
      element={<UserOrderInfoPage />}
    />

    {/* profile orders advances */}
    <Route
      path="/profile/orders/advances/:service_order_id/:order_id/:company_id"
      element={<UserServiceOrderAdvance />}
    />

    {/* profile vehicles */}
    <Route path="/profile/vehicles" element={<ProfileVehiclesPage />} />
    <Route path="/profile/vehicles/new" element={<CreateVehicle />} />
    <Route path="/profile/vehicles/:id" element={<VehicleInfoPage />} />

    {/* search */}
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default generalRoutes;
