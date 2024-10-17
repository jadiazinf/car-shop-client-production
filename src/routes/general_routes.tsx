import { Navigate, Route } from "react-router-dom";
import IndexPage from '../app/index/page';
import LogoutPage from "../app/auth/logout/page";

const generalRoutes = (
  <>
    <Route path="/" element={<IndexPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default generalRoutes;
