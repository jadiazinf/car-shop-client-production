import { Route } from "react-router-dom";
import IndexPage from '../app/index/page';
import LogoutPage from "../app/auth/logout/page";
import { Navigate } from "react-router-dom";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";

const technicianRoutes = (
  <>
    <Route path="/" element={<IndexPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default technicianRoutes;
