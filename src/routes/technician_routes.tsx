import { Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import { Navigate } from "react-router-dom";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import SearchWorkshopsPage from "../app/search/workshops";
import UserSessionPage from "../app/user-session";
import ProfilePage from "../app/profile/page";
import ProfileVehiclesPage from "../app/profile/vehicles/page";
import VehicleInfoPage from "../app/profile/vehicles/info/page";
import CreateVehicle from "../app/profile/vehicles/create/page";

const technicianRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/profile/vehicles" element={<ProfileVehiclesPage />} />
    <Route path="/profile/vehicles/new" element={<CreateVehicle />} />
    <Route path="/profile/vehicles/info/:id" element={<VehicleInfoPage />} />
    <Route path="/user-session" element={<UserSessionPage />} />
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default technicianRoutes;
