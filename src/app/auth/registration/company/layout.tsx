import { ReactNode } from "react";
import UserProvider from "../../../../entities/user/providers/user";
import CompanyProvider from "../../../../entities/company/providers/company";
import PlaceProvider from "../../../../entities/location/providers/place";

function RegisterCompanyPageLayout(props: { children: ReactNode }) {
  return (
    <PlaceProvider>
      <UserProvider>
        <CompanyProvider>
          { props.children }
        </CompanyProvider>
      </UserProvider>
    </PlaceProvider>
  );
}

export default RegisterCompanyPageLayout;
