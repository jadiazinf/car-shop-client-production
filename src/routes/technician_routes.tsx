import { Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import { Navigate } from "react-router-dom";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import SearchWorkshopsPage from "../app/search/workshops/page";
import UserSessionPage from "../app/user-session";
import ProfilePage from "../app/profile/page";
import ProfileVehiclesPage from "../app/profile/vehicles/page";
import VehicleInfoPage from "../app/profile/vehicles/id/page";
import CreateVehicle from "../app/profile/vehicles/create/page";
import CompanyInfoForClient from "../app/search/workshops/id/page";
import UserQuotesPage from "../app/profile/quotes/page";
import UserQuoteInfoPage from "../app/profile/quotes/id/page";
import NewQuotePage from "../app/search/workshops/id/new_quote/page";
import OrderInfoPage from "../app/dashboard/services/orders/id/page";
import { ServiceOrderAdvance } from "../app/dashboard/services/orders/advance/service_order_id/page";
import UserOrderInfoPage from "../app/profile/orders/id/page";
import { UserOrdersPage } from "../app/profile/orders/page";
import { UserServiceOrderAdvance } from "../app/profile/orders/advances/service_order_id/page";
import AdminDashboardPage from "../app/dashboard/admin/page";
import CompaniesTechnicianPage from "../app/dashboard/companies/technician_page";
import { TehnicianOrdersPage } from "../app/dashboard/services/orders/technician/page";
import { UserWorkshopsPage } from "../app/profile/workshops/page";
import ProfileNewWorkshopPage from "../app/profile/workshops/new/page";

const technicianRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />

    {/* user session */}
    <Route path="/user-session" element={<UserSessionPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />

    {/* sarch */}
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/search/workshops/:id" element={<CompanyInfoForClient />} />
    <Route path="/search/workshops/:id/new_quote" element={<NewQuotePage />} />

    {/* profile */}
    <Route path="/profile" element={<ProfilePage />} />

    {/* profile quotes */}
    <Route path="/profile/quotes" element={<UserQuotesPage />} />
    <Route path="/profile/quotes/:id" element={<UserQuoteInfoPage />} />

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

    {/* profile workshops */}
    <Route path="/profile/workshops" element={<UserWorkshopsPage />} />
    <Route path="/profile/workshops/new" element={<ProfileNewWorkshopPage />} />

    {/* profile vehicles */}
    <Route path="/profile/vehicles" element={<ProfileVehiclesPage />} />
    <Route path="/profile/vehicles/new" element={<CreateVehicle />} />
    <Route path="/profile/vehicles/:id" element={<VehicleInfoPage />} />

    {/* dashboard */}
    <Route path="/dashboard" element={<AdminDashboardPage />} />

    {/* dashboard companies */}
    <Route path="/dashboard/companies" element={<CompaniesTechnicianPage />} />

    {/* dashboard services orders */}
    <Route
      path="/dashboard/services"
      element={<Navigate to="/dashboard/services/orders" />}
    />
    <Route
      path="/dashboard/services/orders"
      element={<TehnicianOrdersPage />}
    />
    <Route
      path="/dashboard/services/orders/:id/:company_id"
      element={<OrderInfoPage />}
    />
    <Route
      path="/dashboard/services/orders/:order_id/advances/:service_order_id/:order_id/:company_id"
      element={<ServiceOrderAdvance />}
    />

    {/*  */}
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default technicianRoutes;
