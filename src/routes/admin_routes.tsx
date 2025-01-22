import { Navigate, Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import CompaniesRequestsAdminPage from "../app/dashboard/companies/requests/admin_page";
import AdminUpdateRequest from "../app/dashboard/companies/requests/id/update_request/admin/admin";
import CompaniesAdminPage from "../app/dashboard/companies/admin_page";
import AdminDashboardPage from "../app/dashboard/admin/page";
import AdminServicesPage from "../app/dashboard/services/admin/page";
import SearchWorkshopsPage from "../app/search/workshops/page";
import CompanyMembersPage from "../app/dashboard/companies/members/page";
import CompanyNewMemberPage from "../app/dashboard/companies/members/new/page";
import UserSessionPage from "../app/user-session";
import ProfilePage from "../app/profile/page";
import ProfileVehiclesPage from "../app/profile/vehicles/page";
import VehicleInfoPage from "../app/profile/vehicles/info/page";
import CreateVehicle from "../app/profile/vehicles/create/page";
import CompanyInfoForClient from "../app/search/workshops/id/page";
import ServicesQuotesPage from "../app/dashboard/services/admin/quotes/page";
import ServicesNewQuotePage from "../app/dashboard/services/admin/quotes/new/page";
import QuoteInfoPage from "../app/dashboard/services/admin/quotes/id/page";
import UserQuotesPage from "../app/profile/quotes/page";
import UserQuoteInfoPage from "../app/profile/quotes/id/page";

const adminRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/profile/quotes" element={<UserQuotesPage />} />
    <Route path="/profile/quotes/:id" element={<UserQuoteInfoPage />} />
    <Route path="/profile/vehicles" element={<ProfileVehiclesPage />} />
    <Route path="/profile/vehicles/new" element={<CreateVehicle />} />
    <Route path="/profile/vehicles/info/:id" element={<VehicleInfoPage />} />
    <Route path="/user-session" element={<UserSessionPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/search/workshops/:id" element={<CompanyInfoForClient />} />
    <Route path="/dashboard" element={<AdminDashboardPage />} />
    <Route path="/dashboard/companies" element={<CompaniesAdminPage />} />
    <Route
      path="/dashboard/companies/requests"
      element={<CompaniesRequestsAdminPage />}
    />
    <Route
      path="/dashboard/companies/requests/request/update"
      element={<AdminUpdateRequest />}
    />
    <Route path="/dashboard/services" element={<AdminServicesPage />} />
    <Route path="/dashboard/services/quotes" element={<ServicesQuotesPage />} />
    <Route
      path="/dashboard/services/quotes/new"
      element={<ServicesNewQuotePage />}
    />
    <Route path="/dashboard/services/quotes/:id" element={<QuoteInfoPage />} />
    <Route
      path="/dashboard/companies/members"
      element={<CompanyMembersPage />}
    />
    <Route
      path="/dashboard/companies/members/new"
      element={<CompanyNewMemberPage />}
    />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default adminRoutes;
