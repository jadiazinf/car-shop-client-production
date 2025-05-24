import { Navigate, Route } from "react-router-dom";
import LogoutPage from "../app/auth/logout/page";
import ChooseUserCompanyPage from "../app/auth/choose_user_company/page";
import CompaniesSuperadminPage from "../app/dashboard/companies/superadmin_page";
import CompaniesRequestsSuperadminPage from "../app/dashboard/companies/requests/superadmin_page";
import CompanyRequestPage from "../app/dashboard/companies/requests/id/superadmin_page";
import SuperadminServicesPage from "../app/dashboard/categories/superadmin/page";
import SuperadminDashboardPage from "../app/dashboard/superadmin/page";
import SearchWorkshopsPage from "../app/search/workshops/page";
import UserSessionPage from "../app/user-session";
import ProfilePage from "../app/profile/page";
import ProfileVehiclesPage from "../app/profile/vehicles/page";
import VehicleInfoPage from "../app/profile/vehicles/id/page";
import CreateVehicle from "../app/profile/vehicles/create/page";
import CompanyInfoForClient from "../app/search/workshops/id/page";
import UserQuotesPage from "../app/profile/quotes/page";
import UserQuoteInfoPage from "../app/profile/quotes/id/page";
import NewQuotePage from "../app/search/workshops/id/new_quote/page";
import { UserWorkshopsPage } from "../app/profile/workshops/page";
import ProfileNewWorkshopPage from "../app/profile/workshops/new/page";

const superadminRoutes = (
  <>
    <Route path="/" element={<Navigate to="/search/workshops" />} />

    {/* user session */}
    <Route path="/search/workshops/:id/new_quote" element={<NewQuotePage />} />
    <Route path="/user-session" element={<UserSessionPage />} />
    <Route path="/auth/logout" element={<LogoutPage />} />
    <Route path="/auth/session" element={<ChooseUserCompanyPage />} />

    {/* sarch */}
    <Route path="/search/workshops" element={<SearchWorkshopsPage />} />
    <Route path="/search/workshops/:id" element={<CompanyInfoForClient />} />

    {/* profile */}
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/profile/quotes" element={<UserQuotesPage />} />
    <Route path="/profile/quotes/:id" element={<UserQuoteInfoPage />} />

    {/* profile vehicles */}
    <Route path="/profile/vehicles" element={<ProfileVehiclesPage />} />
    <Route path="/profile/vehicles/new" element={<CreateVehicle />} />
    <Route path="/profile/vehicles/:id" element={<VehicleInfoPage />} />

    {/* profile workshops */}
    <Route path="/profile/workshops" element={<UserWorkshopsPage />} />
    <Route path="/profile/workshops/new" element={<ProfileNewWorkshopPage />} />

    {/* dashboard */}
    <Route path="/dashboard" element={<SuperadminDashboardPage />} />

    {/* dashboard companies */}
    <Route path="/dashboard/companies" element={<CompaniesSuperadminPage />} />

    {/* dashboard companies requests */}
    <Route
      path="/dashboard/companies/requests"
      element={<CompaniesRequestsSuperadminPage />}
    />
    <Route
      path="/dashboard/companies/requests/:id"
      element={<CompanyRequestPage />}
    />

    {/* dashboard categories */}
    <Route path="/dashboard/categories" element={<SuperadminServicesPage />} />

    {/*  */}
    <Route path="*" element={<Navigate to="/" />} />
  </>
);

export default superadminRoutes;
