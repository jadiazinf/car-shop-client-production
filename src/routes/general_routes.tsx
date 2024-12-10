import { Navigate, Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import SearchWorkshopsPage from "../app/search/workshops";

const generalRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default generalRoutes;
