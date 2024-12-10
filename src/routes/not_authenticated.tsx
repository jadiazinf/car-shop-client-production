import { Navigate, Route } from "react-router-dom";
import AuthPage from "../app/auth/page";
import RegisterGeneralUserPage from "../app/auth/registration/general_user/page";
import RegisterCompanyPage from "../app/auth/registration/company/page";
import SearchWorkshopsPage from "../app/search/workshops";

const notAuthenticatedRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route
      path="/auth/registration/general-user"
      element={<RegisterGeneralUserPage />}
    />
    <Route
      path="/auth/registration/company"
      element={<RegisterCompanyPage />}
    />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default notAuthenticatedRoutes;
