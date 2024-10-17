import { Route } from "react-router-dom";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import LogoutPage from "../app/auth/logout/page";
import { Navigate } from "react-router-dom";

const chooseSessionRoute = (
  <>
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="*" element={<Navigate to="/auth/session" />} />
  </>
);

export default chooseSessionRoute;
