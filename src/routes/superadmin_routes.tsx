import { Navigate, Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import CompaniesSuperadminPage from "../app/dashboard/companies/superadmin_page";
import CompaniesRequestsSuperadminPage from "../app/dashboard/companies/requests/superadmin_page";
import CompanyRequestPage from "../app/dashboard/companies/requests/id/superadmin_page";
import SuperadminServicesPage from "../app/dashboard/categories/superadmin/page";
import SuperadminDashboardPage from "../app/dashboard/superadmin/page";
import SearchWorkshopsPage from "../app/search/workshops";
import UserSessionPage from "../app/user-session";
import ProfilePage from "../app/profile/page";
import ProfileVehiclesPage from "../app/profile/vehicles/page";
import VehicleInfoPage from "../app/profile/vehicles/info/page";
import CreateVehicle from "../app/profile/vehicles/create/page";

const superadminRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/profile/vehicles" element={<ProfileVehiclesPage />} />
    <Route path="/profile/vehicles/new" element={<CreateVehicle />} />
    <Route path="/profile/vehicles/info/:id" element={<VehicleInfoPage />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/user-session" element={<UserSessionPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="/dashboard" element={<SuperadminDashboardPage />} />
    <Route path="/dashboard/companies" element={<CompaniesSuperadminPage />} />
    <Route
      path="/dashboard/companies/requests"
      element={<CompaniesRequestsSuperadminPage />}
    />
    <Route
      path="/dashboard/companies/requests/:id"
      element={<CompanyRequestPage />}
    />
    <Route path="/dashboard/categories" element={<SuperadminServicesPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default superadminRoutes;
