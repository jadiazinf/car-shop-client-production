import { Navigate, Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import CompaniesRequestsAdminPage from "../app/dashboard/companies/requests/admin_page";
import AdminUpdateRequest from "../app/dashboard/companies/requests/id/update_request/admin/page";
import CompaniesAdminPage from "../app/dashboard/companies/admin_page";
import AdminDashboardPage from "../app/dashboard/admin/page";
import AdminServicesPage from "../app/dashboard/services/page";
import SearchWorkshopsPage from "../app/search/workshops/page";
import CompanyMembersPage from "../app/dashboard/companies/members/page";
import CompanyNewMemberPage from "../app/dashboard/companies/members/new/page";
import UserSessionPage from "../app/user-session";
import ProfilePage from "../app/profile/page";
import ProfileVehiclesPage from "../app/profile/vehicles/page";
import VehicleInfoPage from "../app/profile/vehicles/info/page";
import CreateVehicle from "../app/profile/vehicles/create/page";
import CompanyInfoForClient from "../app/search/workshops/id/page";
import ServicesQuotesPage from "../app/dashboard/services/quotes/page";
import ServicesNewQuotePage from "../app/dashboard/services/quotes/new/page";
import QuoteInfoPage from "../app/dashboard/services/quotes/id/page";
import UserQuotesPage from "../app/profile/quotes/page";
import UserQuoteInfoPage from "../app/profile/quotes/id/page";
import NewQuotePage from "../app/search/workshops/id/new_quote/page";
import { CompanyOrdersPage } from "../app/dashboard/services/orders/page";
import { NewCompanyOrder } from "../app/dashboard/services/orders/new/page";
import OrderInfoPage from "../app/dashboard/services/orders/id/page";
import { ServiceOrderAdvance } from "../app/dashboard/services/orders/advance/service_order_id/page";
import { UserOrdersPage } from "../app/profile/orders/page";
import UserOrderInfoPage from "../app/profile/orders/id/page";
import { UserServiceOrderAdvance } from "../app/profile/orders/advances/service_order_id/page";
import { ClaimsPage } from "../app/dashboard/services/claims/page";
import ReportsPage from "../app/dashboard/reports/page";

const adminRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />

    {/* user session */}
    <Route path="/user-session" element={<UserSessionPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />

    {/* sarch */}
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
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

    {/* dashboard */}
    <Route path="/dashboard" element={<AdminDashboardPage />} />

    {/* dashboard companies */}
    <Route path="/dashboard/companies" element={<CompaniesAdminPage />} />
    <Route
      path="/dashboard/companies/requests"
      element={<CompaniesRequestsAdminPage />}
    />
    <Route
      path="/dashboard/companies/requests/:id"
      element={<AdminUpdateRequest />}
    />
    <Route
      path="/dashboard/companies/members"
      element={<CompanyMembersPage />}
    />
    <Route
      path="/dashboard/companies/members/new"
      element={<CompanyNewMemberPage />}
    />

    {/* dashboard services */}
    <Route path="/dashboard/services" element={<AdminServicesPage />} />

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

    {/* dashboard reports */}
    <Route path="/dashboard/reports" element={<ReportsPage />} />

    {/*  */}
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default adminRoutes;
