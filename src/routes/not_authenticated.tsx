// not_authenticated.tsx

import { Navigate, Route } from "react-router-dom";
import IndexPage from '../app/index/page';
import AuthPage from "../app/auth/page";
import RegisterGeneralUserPage from "../app/auth/registration/general_user/page";
import RegisterCompanyPage from "../app/auth/registration/company/page";

const notAuthenticatedRoutes = (
  <>
    <Route path="/" element={<IndexPage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/auth/registration/general-user" element={<RegisterGeneralUserPage />} />
    <Route path="/auth/registration/company" element={<RegisterCompanyPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default notAuthenticatedRoutes;
