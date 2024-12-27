import { useEffect } from "react";
import DatesHelpers from "../../../helpers/dates/helper";
import UserHelper from "../helper";
import UserModel from "../model";
import useGetLocationParents, {
  GetLocationParentsProps,
} from "../../location/services/get_parents/use_get_parents";
import { LocationType } from "../../location/types";
import { Spinner } from "@nextui-org/react";

function UserInfo(props: { user: UserModel }) {
  const {
    isGettingLocationParentsLoading,
    payloadState: locations,
    performGetLocationParents,
  } = useGetLocationParents();

  useEffect(() => {
    if (props.user.location_id || props.user.location) {
      const location_id = props.user.location_id || props.user.location?.id;
      performGetLocationParents({ location_id: location_id! });
    }
  }, []);

  const userHelper = new UserHelper(props.user);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
              <span className="font-bold text-lg mb-3">Información básica</span>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col lg:flex-row w-full">
                  <div className="flex flex-col w-full">
                    <p className="font-light text-sm">Nombre completo</p>
                    <p className="font-medium">
                      {props.user.first_name} {props.user.last_name}
                    </p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="font-light text-sm">Fecha de nacimiento</p>
                    <p className="font-medium">
                      {DatesHelpers.formatYYYYMMDDtoDDMMYYYY(
                        props.user.birthdate as string
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row w-full">
                  <div className="flex flex-col w-full">
                    <p className="font-light text-sm">Género</p>
                    <p className="font-medium">
                      {userHelper.translateUserGender()}
                    </p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="font-light text-sm">Cédula de indetindad </p>
                    <p className="font-medium">{props.user.dni}</p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row w-full">
                  <div className="flex flex-col w-full">
                    <p className="font-light text-sm">Número de teléfono</p>
                    <p className="font-medium">{props.user.phone_number}</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="font-light text-sm">Correo electrónico</p>
                    <p className="font-medium">{props.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
              <span className="font-bold text-lg mb-3">Dirección</span>
              {locations === "not loaded" &&
              !isGettingLocationParentsLoading ? null : isGettingLocationParentsLoading ? (
                <Spinner />
              ) : (
                <div className="flex flex-col gap-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full">
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">País</p>
                      <p className="font-medium">
                        {
                          (locations as GetLocationParentsProps).payload.find(
                            (location) =>
                              location.location_type === LocationType.COUNTRY
                          )?.name
                        }
                      </p>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Estado</p>
                      <p className="font-medium">
                        {
                          (locations as GetLocationParentsProps).payload.find(
                            (location) =>
                              location.location_type === LocationType.STATE
                          )?.name
                        }
                      </p>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Ciudad</p>
                      <p className="font-medium">
                        {
                          (locations as GetLocationParentsProps).payload.find(
                            (location) =>
                              location.location_type === LocationType.CITY
                          )?.name
                        }
                      </p>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Municipio</p>
                      <p className="font-medium">
                        {
                          (locations as GetLocationParentsProps).payload.find(
                            (location) =>
                              location.location_type === LocationType.TOWN
                          )?.name
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Dirección exacta</p>
                      <p className="font-medium">{props.user.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
