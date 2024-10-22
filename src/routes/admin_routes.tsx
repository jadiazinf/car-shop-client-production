// admin_routes.tsx

import { Navigate, Route } from "react-router-dom";
import IndexPage from '../app/index/page';
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import CompaniesRequestsAdminPage from "../app/dashboard/companies/requests/admin_page";
import AdminUpdateRequest from "../app/dashboard/companies/requests/id/update_request/admin/admin";

const adminRoutes = (
  <>
    <Route path="/" element={<IndexPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="/dashboard/companies/requests" element={<CompaniesRequestsAdminPage />}/>
    <Route path="/dashboard/companies/requests/request/update" element={<AdminUpdateRequest />}/>
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default adminRoutes;
