// app_routes.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { PersistedStore } from "../store/types";
import { AuthStatus } from "../auth/types";
import { UserCompanyRole } from "../entities/users_companies/types";
import adminRoutes from "./admin_routes";
import notAuthenticatedRoutes from "./not_authenticated";
import generalRoutes from "./general_routes";
import technicianRoutes from "./technician_routes";
import chooseSessionRoute from "./choose_session_route";
import superadminRoutes from './superadmin_routes';

const AppRoutes = () => {
  const { authReducer } = useSelector((state: RootState): PersistedStore => state.persistedReducer);
  const { status, sessionType } = authReducer;

  return (
    <Routes>
      {status === AuthStatus.NOT_AUTHENTICATED && notAuthenticatedRoutes}
      {status === AuthStatus.AUTHENTICATED && sessionType?.company_id === null && sessionType.roles?.length === 0 && chooseSessionRoute}
      {status === AuthStatus.AUTHENTICATED && sessionType?.company_id === null && (sessionType?.roles === null || sessionType?.roles?.includes(UserCompanyRole.GENERAL)) && generalRoutes}
      {sessionType?.roles?.includes(UserCompanyRole.SUPERADMIN) && superadminRoutes}
      {sessionType?.roles?.includes(UserCompanyRole.ADMIN) && adminRoutes}
      {sessionType?.roles?.includes(UserCompanyRole.TECHNICIAN) && technicianRoutes}
      <Route path="*" element={<Navigate to="/"/>} />
    </Routes>
  );
};

export default AppRoutes;
