import { Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import { Navigate } from "react-router-dom";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import SearchWorkshopsPage from "../app/search/workshops";

const technicianRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default technicianRoutes;
