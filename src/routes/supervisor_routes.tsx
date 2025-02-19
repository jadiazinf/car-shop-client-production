import { Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import { Navigate } from "react-router-dom";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
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
import { CompanyOrdersPage } from "../app/dashboard/services/orders/page";
import OrderInfoPage from "../app/dashboard/services/orders/id/page";
import { ServiceOrderAdvance } from "../app/dashboard/services/orders/advance/service_order_id/page";
import UserOrderInfoPage from "../app/profile/orders/id/page";
import { UserOrdersPage } from "../app/profile/orders/page";
import { UserServiceOrderAdvance } from "../app/profile/orders/advances/service_order_id/page";
import AdminDashboardPage from "../app/dashboard/admin/page";
import CompaniesTechnicianPage from "../app/dashboard/companies/technician_page";
import ServicesQuotesPage from "../app/dashboard/services/quotes/page";
import ServicesNewQuotePage from "../app/dashboard/services/quotes/new/page";
import QuoteInfoPage from "../app/dashboard/services/quotes/id/page";
import CompanyMembersPage from "../app/dashboard/companies/members/page";
import { NewCompanyOrder } from "../app/dashboard/services/orders/new/page";
import { ClaimsPage } from "../app/dashboard/services/claims/page";

const supervisorRoutes = (
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

    {/* profile vehicles */}
    <Route path="/profile/vehicles" element={<ProfileVehiclesPage />} />
    <Route path="/profile/vehicles/new" element={<CreateVehicle />} />
    <Route path="/profile/vehicles/:id" element={<VehicleInfoPage />} />

    {/* dashboard */}
    <Route path="/dashboard" element={<AdminDashboardPage />} />

    {/* dashboard companies */}
    <Route path="/dashboard/companies" element={<CompaniesTechnicianPage />} />
    <Route
      path="/dashboard/companies/members"
      element={<CompanyMembersPage />}
    />

    {/* dashboard services quotes */}
    <Route path="/dashboard/services/quotes" element={<ServicesQuotesPage />} />
    <Route
      path="/dashboard/services/quotes/new"
      element={<ServicesNewQuotePage />}
    />
    <Route
      path="/dashboard/services/quotes/:id/:company_id"
      element={<QuoteInfoPage />}
    />

    {/* dashboard services orders */}
    <Route
      path="/dashboard/services"
      element={<Navigate to="/dashboard/services/orders" />}
    />
    <Route path="/dashboard/services/quotes" element={<ServicesQuotesPage />} />
    <Route path="/dashboard/services/orders" element={<CompanyOrdersPage />} />
    <Route
      path="/dashboard/services/orders/new"
      element={<NewCompanyOrder />}
    />
    <Route
      path="/dashboard/services/orders/:id/:company_id"
      element={<OrderInfoPage />}
    />
    <Route
      path="/dashboard/services/orders/:order_id/advances/:service_order_id/:company_id"
      element={<ServiceOrderAdvance />}
    />

    {/* dashboard services claims */}
    <Route path="/dashboard/services/claims" element={<ClaimsPage />} />

    {/*  */}
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default supervisorRoutes;
