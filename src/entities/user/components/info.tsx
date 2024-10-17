import DatesHelpers from "../../../helpers/dates/helper";
import UserModel from "../model";

function UserInfo(props: { user: UserModel }) {
  return (
    <div className='w-full flex flex-col gap-3'>
      <div className='w-full text-center'>
        <span className='font-bold text-2xl font-inter'>Información de usuario</span>
      </div>
      <span>Nombre: <strong>{ props.user.first_name }</strong></span>
      <span>Apellido: <strong>{ props.user.last_name }</strong></span>
      <span>Cédula de identidad: <strong>{ props.user.dni }</strong></span>
      <span>Fecha de nacimiento: <strong>{ DatesHelpers.formatYYYYMMDDtoDDMMYYYY(props.user.birthdate as string) }</strong></span>
      <span>Género: <strong>{ props.user.gender }</strong></span>
      <span>Dirección exacta: <strong>{ props.user.address }</strong></span>
    </div>
  );
}

export default UserInfo;
