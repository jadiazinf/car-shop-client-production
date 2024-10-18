import { Navigate, Route } from "react-router-dom";
import IndexPage from '../app/index/page';
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from '../app/auth/choose_user_company/page';
import DashboardPage from "../app/dashboard/page";
import CompaniesSuperadminPage from "../app/dashboard/companies/superadmin_page";
import CompaniesRequestsSuperadminPage from "../app/dashboard/companies/requests/superadmin_page";

const superadminRoutes = (
  <>
    <Route path="/" element={<IndexPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/dashboard/companies" element={<CompaniesSuperadminPage />} />
    <Route path="/dashboard/companies/requests" element={<CompaniesRequestsSuperadminPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default superadminRoutes;
