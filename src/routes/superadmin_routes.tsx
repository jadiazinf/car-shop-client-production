import { Navigate, Route } from "react-router-dom";
import IndexPage from '../app/index/page';
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from '../app/auth/choose_user_company/page';
import CompaniesSuperadminPage from "../app/dashboard/companies/superadmin_page";
import CompaniesRequestsSuperadminPage from "../app/dashboard/companies/requests/superadmin_page";
import CompanyRequestPage from "../app/dashboard/companies/requests/id/superadmin_page";
import SuperadminServicesPage from "../app/dashboard/categories/superadmin/page";
import SuperadminDashboardPage from "../app/dashboard/superadmin/page";

const superadminRoutes = (
  <>
    <Route path="/" element={<IndexPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="/dashboard" element={<SuperadminDashboardPage />} />
    <Route path="/dashboard/companies" element={<CompaniesSuperadminPage />} />
    <Route path="/dashboard/companies/requests" element={<CompaniesRequestsSuperadminPage />} />
    <Route path="/dashboard/companies/requests/:id" element={<CompanyRequestPage />} />
    <Route path="/dashboard/categories" element={<SuperadminServicesPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default superadminRoutes;
