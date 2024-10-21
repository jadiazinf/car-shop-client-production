import { useEffect } from "react";
import DatesHelpers from "../../../helpers/dates/helper";
import UserHelper from "../helper";
import UserModel from "../model";
import { FaClipboardUser } from "react-icons/fa6";
import useGetLocationParents from "../../location/services/get_parents/use_get_parents";
import PlaceComponent from "../../location/components/place";
import { LocationType } from "../../location/types";

function UserInfo(props: { user: UserModel }) {

  const { isGettingLocationParentsLoading, payloadState: locations, performGetLocationParents } = useGetLocationParents();

  useEffect(() => {
    if (props.user.location_id || props.user.location) {
      const location_id = props.user.location_id || props.user.location?.id;
      performGetLocationParents({location_id: location_id!});
    }

  }, []);

  const userHelper = new UserHelper(props.user);

  return (
    <div className='flex flex-col gap-5'>
      <div className='w-full flex gap-5 items-center'>
        <FaClipboardUser className='w-5 h-5'/>
        <span className='font-bold text-2xl font-inter'>Información de usuario</span>
      </div>
      <div className='flex flex-col lg:flex-row gap-5'>
        <div className='w-full flex flex-col gap-3'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <span className='font-bold'>Información básica</span>
              <div className='flex flex-col pl-3'>
                <div className='flex flex-col md:flex-row md:gap-3'>
                  <span>Nombre: <strong>{ props.user.first_name }</strong></span>
                  <span>Apellido: <strong>{ props.user.last_name }</strong></span>
                </div>
                <span>Género: <strong>{ userHelper.translateUserGender() }</strong></span>
                <span>Fecha de nacimiento: <strong>{ DatesHelpers.formatYYYYMMDDtoDDMMYYYY(props.user.birthdate as string) }</strong></span>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-bold'>Documentación</span>
              <div className='flex flex-col pl-3'>
                <div className='flex'>
                  <span>Cédula de identidad: <strong>{ props.user.dni }</strong></span>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-bold'>Contacto</span>
              <div className='pl-3'>
                <div className='flex flex-col md:flex-row md:gap-3'>
                  <span>Correo electrónico: <strong>{ props.user.email }</strong></span>
                  <span>Número de teléfono: <strong>{ props.user.phone_number }</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full flex flex-col lg:items-end gap-2'>
          <div className='w-full md:w-1/2'>
            <span className='font-bold'>Ubicación</span>
            <div className='mt-5 pl-3'>
              {
                locations !== 'not loaded' && !isGettingLocationParentsLoading &&
                <PlaceComponent
                  direction="vertical"
                  country={locations.payload.find( location => location.location_type === LocationType.COUNTRY )!}
                  state={locations.payload.find( location => location.location_type === LocationType.STATE )!}
                  city={locations.payload.find( location => location.location_type === LocationType.CITY )!}
                  town={locations.payload.find( location => location.location_type === LocationType.TOWN )!}
                />
              }
              <div className='mt-3'>
                <span>Dirección exacta: <strong>{ props.user.address }</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
