import { Navigate, Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import CompaniesRequestsAdminPage from "../app/dashboard/companies/requests/admin_page";
import AdminUpdateRequest from "../app/dashboard/companies/requests/id/update_request/admin/admin";
import CompaniesAdminPage from "../app/dashboard/companies/admin_page";
import AdminDashboardPage from "../app/dashboard/admin/page";
import AdminServicesPage from "../app/dashboard/services/admin/page";
import SearchWorkshopsPage from "../app/search/workshops";
import CompanyMembersPage from "../app/dashboard/companies/members/page";
import CompanyNewMemberPage from "../app/dashboard/companies/members/new/page";

const adminRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
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
