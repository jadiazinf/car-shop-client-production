import { ReactNode } from "react";
import UserProvider from "../../../../entities/user/providers/user";
import VehicleProvider from "../../../../entities/vehicle/providers/vehicle";
import PlaceProvider from "../../../../entities/location/providers/place";
import BrandAndModelProvider from "../../../../entities/model/providers/brand_and_model";

function RegisterGeneralUserPageLayout(props: { children: ReactNode }) {
  return (
    <PlaceProvider>
      <UserProvider>
        <BrandAndModelProvider>
          <VehicleProvider>
            { props.children }
          </VehicleProvider>
        </BrandAndModelProvider>
      </UserProvider>
    </PlaceProvider>
  );
}

export default RegisterGeneralUserPageLayout;
