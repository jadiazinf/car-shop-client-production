import { ReactNode } from "react";
import PlaceProvider from "../../../../../../../entities/location/providers/place";
import CompanyProvider from "../../../../../../../entities/company/providers/company";

function AdminUpdateRequestLayout(props: { children: ReactNode }) {
  return (
    <PlaceProvider>
      <CompanyProvider>
        { props.children }
      </CompanyProvider>
    </PlaceProvider>
  );
}

export default AdminUpdateRequestLayout;
